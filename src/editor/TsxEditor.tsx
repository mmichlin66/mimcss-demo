import * as mim from "mimbl";
import * as css from "mimcss"
import * as monaco from "monaco-editor";

// import some JS files so that they are included into our bundle
import "monaco-editor/esm/vs/basic-languages/javascript/javascript";
import "monaco-editor/esm/vs/basic-languages/typescript/typescript";
import "monaco-editor/esm/vs/language/typescript/languageFeatures";
import "monaco-editor/esm/vs/language/typescript/tsMode";
import "monaco-editor/esm/vs/language/typescript/workerManager";



// Namespaces for brevity
let ts = monaco.languages.typescript;
let ed = monaco.editor;



/**
 * The IExtraLibInfo interface represents information about a library whose typings will be added
 * to the monaco engine and will be available to the code in the editor.
 */
export interface IExtraLibInfo
{
    // Library name
    libName: string,

    // List of file paths
    files: string[],

    // path relative to which all files are located (must end with "/")
    rootPath?: string,

    // Name of the file whose content will be used as "index.d.ts". Not needed if the name of the
    // main file from which all typings are available is already "index.d.ts".
    index?: string,
}



/**
 * 
 */
export class TsxEditor extends mim.Component
{
    // Map of libraries for which typings were added.
    private static extraLibInfos = new Map<string,IExtraLibInfo>();

    public static async addExtraLib( libInfo: IExtraLibInfo): Promise<void>
    {
        if (TsxEditor.extraLibInfos.has( libInfo.libName))
            return;
        else
            TsxEditor.extraLibInfos.set( libInfo.libName, libInfo);

        // fetch all files and put their content into the map by their paths
        let fileMap = new Map<string,string>();
        for( let file of libInfo.files)
        {
            try
            {
                let fileContent = await fetchFileContent( file, libInfo.rootPath);
                fileMap.set( file, fileContent)
            }
            catch( err)
            {
                console.error( `Cannot fetch file ${file}`, err);
            }
        }

        let extraLibRootPath = `file:///node_modules/${libInfo.libName}`;
        fileMap.forEach( (content: string, file: string) => {
            let filePath = file === libInfo.index ? "index.d.ts" : file;
            ts.typescriptDefaults.addExtraLib( content, `${extraLibRootPath}/${filePath}`)
        })
    }



    // Monaco editor object
    private monacoEditor: monaco.editor.IStandaloneCodeEditor;

    // Reference to the container HTML element
    private contaierRef = new mim.Ref<HTMLDivElement>();

    // Reference to the container HTML element
    private sd: TsxEditorStyles;

    // Map of file names to models.
    private files = new Map<string,monaco.editor.ITextModel>();



    constructor()
    {
        super();

        this.sd = css.activate( TsxEditorStyles);
    }



    public async didMount()
    {
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
    
        this.monacoEditor = ed.create( this.contaierRef.r, {
            model: null,
            language: "typescript",
            fontSize: 12,
            minimap: {enabled: false},
            automaticLayout: true,
            renderLineHighlight: "gutter",
            roundedSelection: false,
            mouseWheelZoom: true,
        });
    
        await this.loadFile( "examples/CommonStyles.tsx");
        await this.loadFile( "examples/Gradients.tsx");
        
        await addMimcssTypings();
        await addMimblTypings();

        let js = await this.compileFile( "examples/Gradients.tsx");
        console.log( js);
    
        // let exampleContent = await fetchFileContent( "examples/gradients.tsx");
        // let exampleUri = monaco.Uri.parse( "file:///examples/gradients.tsx");
        // let exampeModel = monaco.editor.createModel( exampleContent, "typescript", exampleUri);
        // this.monacoEditor.setModel( exampeModel);

        this.updateMe();
    }



    public willUnmount()
    {
        if (this.monacoEditor)
        {
            this.monacoEditor.dispose()
            this.monacoEditor = null;
        }
    }



	public render()
	{
        return <div ref={this.contaierRef} class={this.sd.container}>
            {this.monacoEditor ? null : "Loading ..."}
        </div>
    }
    


    /**
     * Adds a file with the given content to the editor
     * @param path
     * @param content 
     */
    public addFile( path: string, content: string): void
    {
        if (this.files.has( path))
            return;

        let uri = monaco.Uri.parse( `file:///${path}`);
        let model = monaco.editor.createModel( content, "typescript", uri);
        this.monacoEditor.setModel( model);

        this.files.set( path, model);
    }



    /**
     * Loads a file from the given with the given path and adds its content to the editor. Path
     * is either absolute URL or relative to the site root.
     * @param path
     */
    public async loadFile( path: string): Promise<void>
    {
        if (this.files.has( path))
            return;

        let content = await fetchFileContent( path);
        this.addFile( path, content);
    }



    /**
     * Compiles the given typescript file to JavaScript.
     * @param path
     */
    public async compileFile( path: string): Promise<string | null>
    {
        let model = this.files.get( path);
        if (!model)
            return null;

        let worker = await (await ts.getTypeScriptWorker())( model.uri);
        let resultAny = await worker.getEmitOutput( model.uri.toString());
        let result = resultAny as monaco.languages.typescript.EmitOutput;
        return result.outputFiles[0].text;
    }
}



async function addMimcssTypings(): Promise<void>
{
    return TsxEditor.addExtraLib({
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



async function addMimblTypings(): Promise<void>
{
    return TsxEditor.addExtraLib({
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



async function fetchFileContent( file: string, rootPath?: string): Promise<string>
{
    let path = (rootPath ? rootPath : "") + file;
    let res = await fetch( path);
    return await res.text();
}



class TsxEditorStyles extends css.StyleDefinition
{
    container = css.$class({
        width: "100%",
        height: "100%",
        overflow: "hidden"
    })
}



