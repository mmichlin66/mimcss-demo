const dev_ifdefLoaderOptions = { DEBUG: true };
const prod_ifdefLoaderOptions = { DEBUG: false };



function config( outFileName, mode, devtool, ifdefLoaderOptions)
{
    return {
        entry: "./lib/main.js",

        output:
        {
            filename: outFileName,
            path: __dirname + "/lib",
            libraryTarget: 'umd',
            globalObject: 'this'
        },

        mode: mode,
        devtool: devtool,
        resolve: { extensions: [".js"] },

        module:
        {
            rules:
            [
                { test: /\.js$/, use: [{ loader: "ifdef-loader", options: ifdefLoaderOptions }] },
                { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
            ]
        },

        externals:
        {
            mimbl: { root: 'mimbl', commonjs2: 'mimbl', commonjs: 'mimbl', amd: 'mimbl' },
            mimcss: { root: 'mimcss', commonjs2: 'mimcss', commonjs: 'mimcss', amd: 'mimcss' },
        }
    }
}



module.exports =
[
    config( "mimcss-demo.dev.js", "development", "#inline-source-map", dev_ifdefLoaderOptions),
    config( "mimcss-demo.js", "production", "source-map", prod_ifdefLoaderOptions),
];



