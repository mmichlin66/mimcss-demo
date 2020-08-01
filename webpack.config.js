const dev_ifdefLoaderOptions = { DEBUG: true };
const prod_ifdefLoaderOptions = { DEBUG: false };
const MonacoPlugin = require("monaco-editor-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');


function config( isDev)
{
    var jsSuffix = isDev ? ".dev.js" : ".js";
    var htmlSuffix = isDev ? ".dev.html" : ".html";

    return {
        entry: { "mimcss-demo": './lib/main.js' },

        output:
        {
            filename: "[name]" + jsSuffix,
            path: __dirname + "/lib",
            libraryTarget: 'umd',
            globalObject: 'this'
        },

        mode: isDev ? "development" : "production",
        devtool: isDev ? "#inline-source-map" : "source-map",
        resolve: { extensions: [".js"] },

        module:
        {
            rules:
            [
                { test: /\.js$/, use: [{ loader: "ifdef-loader", options: {DEBUG: isDev} }] },
                { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
                { test: /\.css$/, use: ['style-loader', 'css-loader'] },
                { test: /\.ttf$/, use: ['file-loader'] }
            ]
        },

        plugins: [
            new MonacoPlugin({
                languages: ["typescript"],
                filename: "[name].worker" + jsSuffix,
            }),

            new CopyPlugin({
                patterns: [
                    { from: "index" + htmlSuffix },

                    { from: "node_modules/mimbl/lib/mimbl" + jsSuffix },
                    { from: "node_modules/mimbl/lib/mimblTypes.d.ts", to: "mimbl/" },
                    { from: "node_modules/mimbl/lib/api/mim.d.ts", to: "mimbl/api/" },
                    { from: "node_modules/mimbl/lib/api/HtmlTypes.d.ts", to: "mimbl/api/" },
                    { from: "node_modules/mimbl/lib/api/SvgTypes.d.ts", to: "mimbl/api/" },
                    { from: "node_modules/mimbl/lib/api/LocalStyles.d.ts", to: "mimbl/api/" },
                    { from: "node_modules/mimbl/lib/utils/EventSlot.d.ts", to: "mimbl/utils/" },

                    { from: "node_modules/mimcss/lib/mimcss" + jsSuffix },
                    { from: "node_modules/mimcss/lib/mimcssTypes.d.ts", to: "mimcss/" },
                    { from: "node_modules/mimcss/lib/styles/UtilTypes.d.ts", to: "mimcss/styles/" },
                    { from: "node_modules/mimcss/lib/styles/ColorTypes.d.ts", to: "mimcss/styles/" },
                    { from: "node_modules/mimcss/lib/styles/ImageTypes.d.ts", to: "mimcss/styles/" },
                    { from: "node_modules/mimcss/lib/styles/StyleTypes.d.ts", to: "mimcss/styles/" },
                    { from: "node_modules/mimcss/lib/styles/SelectorTypes.d.ts", to: "mimcss/styles/" },
                    { from: "node_modules/mimcss/lib/styles/MediaTypes.d.ts", to: "mimcss/styles/" },
                    { from: "node_modules/mimcss/lib/styles/FontFaceTypes.d.ts", to: "mimcss/styles/" },
                    { from: "node_modules/mimcss/lib/rules/RuleTypes.d.ts", to: "mimcss/rules" },
                    { from: "node_modules/mimcss/lib/api/UtilAPI.d.ts", to: "mimcss/api/" },
                    { from: "node_modules/mimcss/lib/api/ColorAPI.d.ts", to: "mimcss/api/" },
                    { from: "node_modules/mimcss/lib/api/ImageAPI.d.ts", to: "mimcss/api/" },
                    { from: "node_modules/mimcss/lib/api/StyleAPI.d.ts", to: "mimcss/api/" },
                    { from: "node_modules/mimcss/lib/api/RuleAPI.d.ts", to: "mimcss/api/" },
                    { from: "node_modules/mimcss/lib/api/SchedulingAPI.d.ts", to: "mimcss/api/" },

                    { from: "examples/**/*" },
                ],
            })
        ],

        externals:
        {
            mimbl: { root: 'mimbl', commonjs2: 'mimbl', commonjs: 'mimbl', amd: 'mimbl' },
            mimcss: { root: 'mimcss', commonjs2: 'mimcss', commonjs: 'mimcss', amd: 'mimcss' },
            // typescript: { root: 'typescript', commonjs2: 'typescript', commonjs: 'typescript', amd: 'typescript' },
        }
    }
}



module.exports =
[
    config( true),
    config( false),
];



