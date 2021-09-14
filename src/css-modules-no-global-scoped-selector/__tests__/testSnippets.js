const { ruleName, messages } = require("..")

testRule({
  plugins: ["."],
  ruleName,
  config: true,

  accept: [
    {
      code: ".local h1 { display: none; }",
      description: "scoped tag",
    },
    {
      code: ".local :global .global { display: none; }",
      description: "scoped global selector",
    },
    {
      code: ".local { :global .global { display: none; } }",
      description: "nested scoped global selector",
    },
    {
      code: "%common { display: none; }",
      description: "placeholder selector",
    },
    {
      code: "@keyframes local { from { transform: translateX(0%); } to { transform: translateX(100%); } }",
      description: "scoped keyframes",
    },
  ],

  reject: [
    {
      code: "h1 { display: none; }",
      description: "tag selector",
      warnings: [{ message: messages.rejectedSelector("h1"), line: 1, column: 1 }],
    },
    {
      code: ":global .global { display: none; }",
      description: "top-level non scoped global selector",
      warnings: [{ message: messages.rejectedSelector(":global .global"), line: 1, column: 1 }],
    },
    {
      code: "h1 :global .global { display: none; }",
      description: "non scoped global selector following tag",
      warnings: [{ message: messages.rejectedSelector("h1 :global .global"), line: 1, column: 1 }],
    },
    {
      code: "h1 { h2 { :global .global { display: none; } } }",
      description: "nested non scoped global selector following tag",
      warnings: [{ message: messages.rejectedSelector("h1 h2 :global .global"), line: 1, column: 11 }],
    },
    {
      code: ":hover { :global .global { display: none; } }",
      description: "nested non scoped global selector following tag with &:pseudo-class",
      warnings: [{ message: messages.rejectedSelector(":hover :global .global"), line: 1, column: 10 }],
    },
    {
      code: "h1 { &:hover { :global .global { display: none; } } }",
      description: "nested non scoped global selector following tag with &:pseudo-class",
      warnings: [{ message: messages.rejectedSelector("h1:hover :global .global"), line: 1, column: 16 }],
    },
    {
      code: "h1 :global .global, :global .global { display: none; }",
      description: "multiple non scoped global selector",
      warnings: [
        { message: messages.rejectedSelector("h1 :global .global"), line: 1, column: 1 },
        { message: messages.rejectedSelector(":global .global"), line: 1, column: 21 },
      ],
    },
    {
      code: ".local :global .global, :global .global { display: none; }",
      description: "one scoped and one non scoped global selector",
      warnings: [{ message: messages.rejectedSelector(":global .global"), line: 1, column: 25 }],
    },
    {
      code: ":global .global, .local :global .global { display: none; }",
      description: "one non scoped and one scoped global selector",
      warnings: [{ message: messages.rejectedSelector(":global .global"), line: 1, column: 1 }],
    },
    {
      code: "h1 { h3 { :global .global { display: none; } } h4 { :global .global { display: none; } } } h2 { h3 { :global .global { display: none; } } h4 { :global .global { display: none; } } }",
      description: "big nested non scoped global selector following tag",
      warnings: [
        { message: messages.rejectedSelector("h1 h3 :global .global"), line: 1, column: 11 },
        { message: messages.rejectedSelector("h1 h4 :global .global"), line: 1, column: 53 },
        { message: messages.rejectedSelector("h2 h3 :global .global"), line: 1, column: 102 },
        { message: messages.rejectedSelector("h2 h4 :global .global"), line: 1, column: 144 },
      ],
    },
    {
      code: "h1, h2 { h3 { :global .global { display: none; } } h4 { :global .global { display: none; } } }",
      description: "multiple nested non scoped global selector following tag",
      warnings: [
        { message: messages.rejectedSelector("h1 h3 :global .global"), line: 1, column: 15 },
        { message: messages.rejectedSelector("h2 h3 :global .global"), line: 1, column: 15 },
        { message: messages.rejectedSelector("h1 h4 :global .global"), line: 1, column: 57 },
        { message: messages.rejectedSelector("h2 h4 :global .global"), line: 1, column: 57 },
      ],
    },
    {
      code: "h1 { :global .global { display: none; } :global .global { display: none; } }",
      description: "nested non scoped global selectors following tag",
      warnings: [
        { message: messages.rejectedSelector("h1 :global .global"), line: 1, column: 6 },
        { message: messages.rejectedSelector("h1 :global .global"), line: 1, column: 41 },
      ],
    },
    {
      code: "h1 { :global .global, :global .global { display: none; } }",
      description: "nested non scoped global selectors with comma following tag",
      warnings: [
        { message: messages.rejectedSelector("h1 :global .global"), line: 1, column: 6 },
        { message: messages.rejectedSelector("h1 :global .global"), line: 1, column: 23 },
      ],
    },
    {
      code: ":global .global, :global .global, :global .global { display: none; }",
      description: "non scoped global selectors repeated 3 times",
      warnings: [
        { message: messages.rejectedSelector(":global .global"), line: 1, column: 1 },
        { message: messages.rejectedSelector(":global .global"), line: 1, column: 18 },
        { message: messages.rejectedSelector(":global .global"), line: 1, column: 35 },
      ],
    },
    {
      code: "%common { display: none; } h1 { @extend %common; }",
      description: "tag selector extending a placeholder selector",
      warnings: [{ message: messages.rejectedSelector("h1"), line: 1, column: 28 }],
    },
    {
      code: "@keyframes :global(global) { from { transform: translateX(0%); } to { transform: translateX(100%); } }",
      description: "global keyframes",
      warnings: [{ message: messages.rejectedKeyframes, line: 1, column: 12 }],
    },
    {
      code: ":global.global { display: none; }",
      description: "syntax error: missing space after :global",
      warnings: [
        {
          message: messages.localizeNodeError(":global.global", "Missing whitespace after :global"),
          line: 1,
          column: 1,
        },
      ],
    },
  ],
})
