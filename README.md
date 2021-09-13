# stylelint-css-modules-no-global-scoped-selector

![CI](https://github.com/lmichelin/stylelint-css-modules-no-global-scoped-selector/actions/workflows/CI.yml/badge.svg)

**Stylelint rule for CSS modules to prevent usage of global-scoped selectors.**

To be scoped locally a selector must contain at least one local class or id, otherwise the selector can have unwanted effects on other elements. More information is available on the [CSS Modules documentation](https://github.com/css-modules/css-modules).

Internally this rule uses the same logic as `css-loader` to check if a selector is **pure** i.e. scoped locally. The concept of _pure selector_ is explained in the [readme of css-loader](https://github.com/webpack-contrib/css-loader#mode).

_:white_check_mark: Example of local-scoped selectors:_

```scss
// SCSS

.container {
  // ...
}

.container {
  :global .external-class {
    // ...
  }
}
```

_:x: Example of global-scoped selectors:_

```scss
// SCSS

h1 {
  // ...
}

:global .external-class {
  // ...
}

h1 {
  :global .external-class {
    // ...
  }
}
```

# Installation

- Install the plugin:

```bash
# npm
npm i stylelint-css-modules-no-global-scoped-selector --save-dev

# yarn
yarn add stylelint-css-modules-no-global-scoped-selector --dev
```

- Update your `stylelint.config.js`:

```diff
module.exports = {
  plugins: [
    ...,
+   "stylelint-css-modules-no-global-scoped-selector",
  ],
  rules: {
    ...,
+   "css-modules/no-global-scoped-selector": true,
  },
}
```

# Configuration

If you don't want to check all your CSS files, you can use the `fileExtensions` option to specify which file extensions you want to check. For example, if your project contains CSS and SCSS modules all ending with `.module.css` or `.module.scss` you can update your `stylelint.config.js` like this:

```diff
module.exports = {
  plugins: [
    ...,
+   "stylelint-css-modules-no-global-scoped-selector",
  ],
  rules: {
    ...,
+   "css-modules/no-global-scoped-selector": [
+     true,
+     { fileExtensions: [".module.css", ".module.scss"] },
+   ],
  },
}
```
