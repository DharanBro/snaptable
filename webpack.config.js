const path = require('path');
const webpackMerge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');

const prodConfig = {
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
}

const devConfig = {
    devtool: 'inline-source-map',
}

const common = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'SnapTable',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        libraryExport: 'default'
    },
    module: {
        rules: [
            {
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
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },

}

module.exports = (env) => {
    console.log("_________", env);
    const config = [common];

    if (env.mode === "dev") {
        config.push(devConfig);
    }

    if (env.mode === "prod") {
        config.push(prodConfig);
    }
    return webpackMerge(...config);
};