const stylelint = require("stylelint")
const _ = require("lodash")
const resolvedNestedSelector = require("postcss-resolve-nested-selector")
const { ruleMessages, validateOptions, report } = stylelint.utils

const rewire = require("rewire")
const postcssModulesLocalByDefaultRewired = rewire("postcss-modules-local-by-default")

const extractICSS = postcssModulesLocalByDefaultRewired.__get__("extractICSS")
const localizeNode = postcssModulesLocalByDefaultRewired.__get__("localizeNode")

const ruleName = "css-modules/no-global-scoped-selector"

const messages = ruleMessages(ruleName, {
  rejectedKeyframes: "@keyframes :global(...) is not scoped locally",
  rejectedSelector: selector =>
    `Selector "${selector}" is not scoped locally (scoped selectors must contain at least one local class or id)`,
})

module.exports = stylelint.createPlugin(ruleName, (isEnabled, options) => (root, result) => {
  const validOptions = validateOptions(
    result,
    ruleName,
    { actual: isEnabled },
    { actual: options, possible: { fileExtensions: [_.isString] }, optional: true },
  )
  if (!validOptions) return

  if (
    options &&
    options.fileExtensions &&
    (!root.source ||
      !root.source.input.file ||
      !options.fileExtensions.some(extension => root.source.input.file.endsWith(extension)))
  ) {
    return
  }

  // START OF CODE ADAPTED FROM postcss-modules-local-by-default

  const localAliasMap = new Map()

  const { icssImports } = extractICSS(root, false)

  Object.keys(icssImports).forEach(key => {
    Object.keys(icssImports[key]).forEach(prop => {
      localAliasMap.set(prop, icssImports[key][prop])
    })
  })

  root.walkAtRules(atRule => {
    if (/keyframes$/i.test(atRule.name)) {
      const globalMatch = /^\s*:global\s*\((.+)\)\s*$/.exec(atRule.params)

      if (globalMatch) {
        report({
          ruleName,
          result,
          message: messages.rejectedKeyframes,
          node: atRule,
          word: atRule.params,
        })
      }
    }
  })

  root.walkRules(rule => {
    if (rule.parent && rule.parent.type === "atrule" && /keyframes$/i.test(rule.parent.name)) {
      // ignore keyframes rules
      return
    }

    if (!rule.nodes.some(({ type }) => ["decl", "atrule"].includes(type))) {
      // ignore rules without declarations
      return
    }

    const splitRule = rule.toString().split(",")

    rule.selectors.forEach((selector, selectorIndex) => {
      if (selector.startsWith("%")) return // ignore SCSS placeholder selectors

      resolvedNestedSelector(selector, rule).forEach(resolvedSelector => {
        const clonedRule = rule.clone()

        clonedRule.selector = resolvedSelector

        const context = localizeNode(clonedRule, "pure", localAliasMap)

        if (context.hasPureGlobals) {
          report({
            ruleName,
            result,
            message: messages.rejectedSelector(resolvedSelector),
            node: rule,
            word: splitRule.slice(selectorIndex).join(",").trim(),
          })
        }
      })
    })
  })

  // END OF CODE ADAPTED FROM postcss-modules-local-by-default
})

module.exports.ruleName = ruleName
module.exports.messages = messages
