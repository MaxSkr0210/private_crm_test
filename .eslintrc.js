module.exports = {
  root: true,

  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-use-v-if-with-v-for": "off",
    "vue/no-use-v-if-with-v-for": [
      "error",
      {
        allowUsingIterationVar: false,
      },
    ],
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["filters"],
      },
    ],
  },
};
