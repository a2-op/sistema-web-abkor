module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: [
        '@nuxtjs',
        'prettier',
        'prettier/vue',
        'plugin:prettier/recommended',
        'plugin:nuxt/recommended'
    ],
    plugins: [
        'prettier'
    ],
    // add your custom rules here
    rules: {
        "indent": [1, "tab", { "SwitchCase": 1 }],
        "no-tabs": 0,
        'nuxt/no-cjs-in-config': 'off',
        "no-console": 'off',
        "new-cap": 'off'
    }
}
