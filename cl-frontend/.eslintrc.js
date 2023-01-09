module.exports = {
  env: {
    node: true,
    jest: true,
    es6: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "next/core-web-vitals",
  ],
  globals: {
    document: true,
    window: true,
    localStorage: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["import", "jsx-a11y", "@typescript-eslint/eslint-plugin", "react"],
  overrides: [
    {
      files: ["**/*.test.tsx"],
      env: {
        jest: true,
      },
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      }
    },
  ],
  rules: {
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          "React.ReactElement": "Import ReactElement directly",
          "React.Fragment": "Import Fragment directly",
        },
      },
    ],
    "@typescript-eslint/explicit-member-accessibility": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: {
          regex: "^I[A-Z]",
          match: true,
        },
      },
      {
        selector: "enumMember",
        format: ["UPPER_CASE"],
      },
    ],
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "none",
        ignoreRestSiblings: false,
      },
    ],
    "arrow-parens": ["error", "always"],
    "eol-last": ["error", "always"],
    "func-style": ["error", "declaration"],
    "import/default": "error",
    "import/first": "error",
    "import/named": "error",
    "import/newline-after-import": [
      "error",
      {
        count: 1,
      },
    ],
    "import/no-absolute-path": "error",
    "import/no-cycle": "error",
    "import/no-duplicates": "error",
    "import/no-self-import": "error",
    "import/no-unresolved": "error",
    "import/no-useless-path-segments": "error",
    "import/no-webpack-loader-syntax": "error",
    indent: "off",
    "keyword-spacing": [
      "error",
      {
        before: true,
        after: true,
      },
    ],
    "no-mixed-spaces-and-tabs": "error",
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1,
        maxBOF: 0,
      },
    ],
    "no-spaced-func": "error",
    "no-trailing-spaces": "error",
    "no-whitespace-before-property": "error",
    "object-curly-spacing": ["error", "always"],
    "object-property-newline": [
      "error",
      {
        allowAllPropertiesOnSameLine: false,
      },
    ],
    "object-shorthand": ["error", "always"],
    "react/forbid-elements": [
      "error",
      {
        forbid: ["React.Fragment"],
      },
    ],
    "react-hooks/exhaustive-deps": "off",
    "react/jsx-closing-bracket-location": [
      "error",
      {
        location: "line-aligned",
      },
    ],
    "react/jsx-wrap-multilines": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "tsconfig.json",
      },
    },
  },
};
