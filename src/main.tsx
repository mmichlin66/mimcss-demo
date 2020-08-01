import * as mim from "mimbl";
import * as css from "mimcss"
import * as monaco from "monaco-editor";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript";
import "monaco-editor/esm/vs/language/typescript/languageFeatures";
import "monaco-editor/esm/vs/language/typescript/tsMode";
import "monaco-editor/esm/vs/language/typescript/workerManager";



/// #if !DEBUG
css.enableShortNames( true, "m");
/// #endif


import {sharedStyles} from "./SharedStyles"



// this function is called from body.onload
this.mimcssDemoMain = async function( appRoot: HTMLElement)
{
    let ts = monaco.languages.typescript;
    ts.typescriptDefaults.setCompilerOptions({
        target: ts.ScriptTarget.ES2016,
        allowNonTsExtensions: true,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        module: ts.ModuleKind.CommonJS,
        // noEmit: true,
        typeRoots: ["node_modules"],
        jsx: ts.JsxEmit.React,
        jsxFactory: "mim.jsx",
    })

    addMimcssTypings();
    addMimblTypings();

    let editor = monaco.editor.create( appRoot, {
        model: null,
        language: "typescript",
        minimap: {enabled: false},
        automaticLayout: true,
        renderLineHighlight: "gutter",
        roundedSelection: false,
        mouseWheelZoom: true,
    });

    let exampleContent = await fetchFileContent( "examples/gradients.tsx");
    let exampleUri = monaco.Uri.parse( "file:///examples/gradients.tsx");

    let exampeModel = monaco.editor.createModel( exampleContent, "typescript", exampleUri);
    editor.setModel( exampeModel);

    let func = await ts.getTypeScriptWorker();
    let worker = await func( exampleUri);
    let result = await worker.getEmitOutput( exampleUri.toString());
    console.log( result.outputFiles[0].text);

    // editor.setModel(null);
    // editor.dispose();
    // exampeModel.dispose();

    // mim.mount( new MainForm(), appRoot);
}



interface ITypingsInfo
{
    // library name
    libName: string,

    // list of file paths
    files: string[],

    // path relative to which all files are located (must end with "/")
    rootPath?: string,

    // name of the file whose content will be used as "index.d.ts". Not needed if the file name
    // is index.d.ts
    index?: string,
}



async function addMimcssTypings()
{
    addTypings({
        libName: "mimcss",
        files: [
            "mimcssTypes.d.ts",
            "styles/UtilTypes.d.ts",
            "styles/ColorTypes.d.ts",
            "styles/ImageTypes.d.ts",
            "styles/StyleTypes.d.ts",
            "styles/SelectorTypes.d.ts",
            "styles/MediaTypes.d.ts",
            "styles/FontFaceTypes.d.ts",
            "rules/RuleTypes.d.ts",
            "api/UtilAPI.d.ts",
            "api/ColorAPI.d.ts",
            "api/ImageAPI.d.ts",
            "api/StyleAPI.d.ts",
            "api/RuleAPI.d.ts",
            "api/SchedulingAPI.d.ts"
        ],
        rootPath: "mimcss/",
        index: "mimcssTypes.d.ts",
    });
}



async function addMimblTypings()
{
    addTypings({
        libName: "mimbl",
        files: [
            "mimblTypes.d.ts",
            "api/mim.d.ts",
            "api/HtmlTypes.d.ts",
            "api/SvgTypes.d.ts",
            "api/LocalStyles.d.ts",
            "utils/EventSlot.d.ts"
        ],
        rootPath: "mimbl/",
        index: "mimblTypes.d.ts",
    });
}



async function addTypings( typingsInfo: ITypingsInfo)
{
    // fetch all files and put their content into the map by their paths
    let fileMap = new Map<string,string>();
    for( let file of typingsInfo.files)
    {
        try
        {
            let fileContent = await fetchFileContent( file, typingsInfo.rootPath);
            fileMap.set( file, fileContent)
        }
        catch( err)
        {
            console.error( `Cannot fetch file ${file}`, err);
        }
    }

    let ts = monaco.languages.typescript;
    let extraLibRootPath = `file:///node_modules/${typingsInfo.libName}`;
    fileMap.forEach( (content: string, file: string) => {
        let filePath = file === typingsInfo.index ? "index.d.ts" : file;
        ts.typescriptDefaults.addExtraLib( content, `${extraLibRootPath}/${filePath}`)
    })
}



async function fetchFileContent( file: string, rootPath?: string): Promise<string>
{
    let path = (rootPath ? rootPath : "") + file;
    let res = await fetch( path);
    return await res.text();
}



class MyStyles extends css.StyleDefinition
{
	linearGradient = css.$class({
		width: 200,
		height: 200,
        backgroundImage: css.gradient.repeatingLinear.to(15)( css.Colors.lightcyan,
            css.Colors.orange, [30], [css.Colors.lightcyan, 50])
	})

	radialGradient = css.$class({
		width: 200,
		height: 200,
		backgroundImage: css.gradient.repeatingRadial.circle().extent("farthest-corner").at([5.5,3.3])(
						css.Colors.lightcyan, css.Colors.orange, [30], [css.Colors.lightcyan, 50])
	})

	conic = css.$class({
		width: 200,
		height: 200,
		backgroundImage: css.gradient.conic.from(45).at("70%")( css.Colors.red, css.Colors.orange,
			css.Colors.yellow, css.Colors.green, css.Colors.lightblue, css.Colors.blue, css.Colors.violet, css.Colors.red)
	})
}



let myStyles = css.activate( MyStyles);



class MainForm extends mim.Component
{
	public render()
	{
		return <div class={[sharedStyles.vbox, sharedStyles.spacing]}>
			<div class={[sharedStyles.hbox, sharedStyles.spacing]}>
				<div class={myStyles.linearGradient} />
				<div class={myStyles.radialGradient} />
				<div class={myStyles.conic} />
			</div>
		</div>
	}
}



