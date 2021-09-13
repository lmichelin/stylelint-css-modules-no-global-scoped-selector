const fs = require("fs")
const path = require("path")

const validFile = fs.readFileSync(path.join(__dirname, "./fixtures/validFile.scss")).toString()
const invalidFile = fs.readFileSync(path.join(__dirname, "./fixtures/invalidFile.scss")).toString()

const { ruleName, messages } = require("..")

testRule({
  plugins: ["."],
  ruleName,
  config: true,

  accept: [
    {
      code: validFile,
      description: "Valid SCSS file",
    },
  ],

  reject: [
    {
      code: invalidFile,
      description: "Invalid SCSS file",
      warnings: [
        { message: messages.rejectedKeyframes, line: 44, column: 12 },
        { message: messages.rejectedSelector(":global .global"), line: 1, column: 1 },
        { message: messages.rejectedSelector("h1 :global .global"), line: 6, column: 3 },
        { message: messages.rejectedSelector("h1 :global .global"), line: 13, column: 3 },
        { message: messages.rejectedSelector("h1 :global .global"), line: 19, column: 3 },
        { message: messages.rejectedSelector("h1 :global .global"), line: 23, column: 3 },
        { message: messages.rejectedSelector("h1 :global .global"), line: 29, column: 3 },
        { message: messages.rejectedSelector("h1 :global .global"), line: 30, column: 3 },
        { message: messages.rejectedSelector("h1 :global .global"), line: 31, column: 3 },
        { message: messages.rejectedSelector("h1"), line: 40, column: 1 },
      ],
    },
  ],
})
