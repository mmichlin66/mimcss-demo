function config( isDev)
{
    var jsSuffix = isDev ? ".dev.js" : ".js";

    return {
        entry: './lib/Extension.js',

        output:
        {
            filename: "mimcss-demo" + jsSuffix,
            path: __dirname + "/lib",
            library: "mimcss-demo",
            libraryTarget: 'umd',
            globalObject: 'this'
        },

        mode: isDev ? "development" : "production",
        devtool: isDev ? "#inline-source-map" : undefined,
        resolve: { extensions: [".js"] },

        module:
        {
            rules:
            [
                { test: /\.js$/, use: [{ loader: "ifdef-loader", options: {DEBUG: isDev} }] },
                { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            ]
        },

        externals:
        {
            mimcss: { root: 'mimcss', commonjs2: 'mimcss', commonjs: 'mimcss', amd: 'mimcss' },
            mimbl: { root: 'mimbl', commonjs2: 'mimbl', commonjs: 'mimbl', amd: 'mimbl' },
            "mim-tsplay": { root: 'mim-tsplay', commonjs2: 'mim-tsplay', commonjs: 'mim-tsplay', amd: 'mim-tsplay' },
        }
    }
}



module.exports =
[
    config( true),
    config( false),
];



