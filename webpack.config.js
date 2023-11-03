const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    entry: './main.ts', // Your entry point
    //externals: [nodeExternals({ allowlist: ['axios'] })],
    // Remove the externals configuration if it was excluding node_modules
    // externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'build'),
        libraryTarget: 'commonjs2',
    },
    optimization: {
        minimize: false, // You can enable this for smaller bundle sizes
    },
    mode: 'production',
    performance: {
        hints: false, // Turn off size warnings for entry points
    },
    // Add more plugins if needed
};
