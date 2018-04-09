const path = require('path');

console.log(
    path.resolve(__dirname),
    path.resolve(__dirname, '.'),
    path.resolve(__dirname, '/')
);
module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader',
                options: {
                    "plugins": [
                        "transform-class-properties"
                    ],
                    "presets": [
                        ["env", { "modules": false }],
                        "preact"
                    ]
                }
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'src'),
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(ttf|woff2?|svg|eot|jpg)$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    path.resolve(__dirname, 'AudioKeys/images')
                ],
                loader: 'file-loader',
                options: {
                    name: '[name]-[hash].[ext]'
                }
            },
        ],
    }
}
