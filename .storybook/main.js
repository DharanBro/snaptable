const moduleRulesTs = {
    test: /\.ts?$/,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: [
                '@babel/preset-env',
                '@babel/preset-typescript',
            ]

        }
    }
}

module.exports = {
    stories: ['../stories/**/*.stories.[tj]s'],
    webpackFinal: async config => {
        config.module.rules.push(moduleRulesTs);
        config.resolve.extensions.push('.ts');
        return config;
    },
};