const webpackMerge = require('webpack-merge');
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
        const additionConfig = {
            module: {
                rules: [
                    moduleRulesTs
                ]
            },
            resolve: {
                extensions: ['.ts']
            },
            devtool: "inline-source-map",
            output: {
                devtoolModuleFilenameTemplate(info) {
                    return `file:///${info.absoluteResourcePath.replace(/\\/g, '/')}`;
                },
            }

        }
        return webpackMerge(config, additionConfig);
    },
};