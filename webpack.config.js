let isProd = process.argv.indexOf('-p') !== -1;
let mode = isProd ? "production" : "development";
let devtool = isProd ? "source-map" : "#inline-source-map";
let outputFilename = isProd ? "mimcss-demo.js" : "mimcss-demo.dev.js";

// define preprocessor variables for ifdef-loader
const ifdefLoaderOptions =
{
    DEBUG: !isProd,
    UNIQUE_CSS_NAMES: isProd,
};



module.exports =
{
    entry: "./src/main.tsx",

    output:
    {
        filename: outputFilename,
        path: __dirname + "/lib",
		libraryTarget: 'umd',
		globalObject: 'this'
    },

    mode: mode,

    // Enable sourcemaps for debugging webpack's output.
    devtool: devtool,

    resolve:
    {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", ".css"]
    },

    module:
    {
        rules:
        [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            //{ test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            {
                test: /\.tsx?$/,
                use:
                [
                    //{ loader: "awesome-typescript-loader" },
                    { loader: "ts-loader" },
                    { loader: "ifdef-loader", options: ifdefLoaderOptions }
                ],
				exclude: /node_modules|\.d\.ts$/
            },

			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals:
    {
        mimcss: { root: 'mimcss', commonjs2: 'mimcss', commonjs: 'mimcss', amd: 'mimcss' },
        mimbl: { root: 'mimbl', commonjs2: 'mimbl', commonjs: 'mimbl', amd: 'mimbl' },
    }
};