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
 * Type of callback that is used to fetch file content.
 */
export type FileFetcher = ( path: string, rootPath?: string) => Promise<string>;



/**
 * The IExtraLibInfo interface represents information about a library whose typings will be added
 * to the monaco engine and will be available to the code in the editor.
 */
export interface IExtraLibInfo
{
    // Library name
    libName: string,

    // Library url
    url: string,

    // List of file paths
    files: string[],

    // path relative to which all files are located (must end with "/")
    rootPath?: string,

    // Name of the file whose content will be used as "index.d.ts". Not needed if the name of the
    // main file from which all typings are available is already "index.d.ts".
    index?: string,
}



/**
 * The ICompilationResult interface represents the result of compilation of the code in the editor.
 */
export interface ICompilationResult
{
    // Flag whether file emittion was skipped
    emitSkipped: boolean;

    // Array of objects representing errors - both syntax and semantic.
    errors: ICompilationErrorInfo[],

    // Array of file names and their text content
    outputFiles: { name: string, text: string}[];
}



/**
 * The ICompilationErrorInfo interface represents a single compilation error or warning.
 */
export interface ICompilationErrorInfo
{
    // True for syntax errors and false for semantic ones.
    isSyntax: boolean;

    // Category
    category: CompilationIssueCategory;

    // Category
    code: number;

    // Row number in the file
    message: string;

    // Row number in the file
    row: number;

    // Column number in the row
    col: number;

    // Length of the offending code
    length: number;

    // Array of objects representing errors - both syntax and semantic.
    diag: monaco.languages.typescript.Diagnostic,
}



/**
 * Reported error categories.
 */
export const enum CompilationIssueCategory
{
    Warning = 0,
    Error = 1,
    Suggestion = 2,
    Message = 3,
}



/**
 * The TxtEditor class is a Mimbl component that wraps the monacto editor. It provides convenient
 * methods for adding extra libraries, creating and loading files.
 */
export class TsxEditor extends mim.Component
{
    // Monaco editor object
    public monacoEditor: monaco.editor.IStandaloneCodeEditor;

    // Map of libraries for which typings were added.
    private extraLibInfos = new Map<string,IExtraLibInfo>();

    // Reference to the container HTML element
    private contaierRef = new mim.Ref<HTMLDivElement>();

    // Map of file names to models.
    private files = new Map<string,monaco.editor.ITextModel>();

    // Map of file names to models.
    private fileFetcher: FileFetcher;



    constructor( fileFetcher: FileFetcher)
    {
        super();

        this.fileFetcher = fileFetcher;

        // set compiler options
        ts.typescriptDefaults.setCompilerOptions({
            target: ts.ScriptTarget.ES2016,
            allowNonTsExtensions: true,
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            module: ts.ModuleKind.CommonJS,
            // noEmit: true,
            typeRoots: ["node_modules"],
            declaration: true,
            experimentalDecorators: true,
            jsx: ts.JsxEmit.React,
            jsxFactory: "mim.jsx",
        })
    }


    public async didMount()
    {
        // create the editor - we need to do it in didMount because it needs a DOM element
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
        return <div ref={this.contaierRef} style={{ width: "100%", height: "100%", overflow: "hidden"}} />
    }
    


    /**
     * Adds an extra library loading files listed in the given information object.
     * @param libInfo
     */
    public async addExtraLib( libInfo: IExtraLibInfo): Promise<void>
    {
        if (this.extraLibInfos.has( libInfo.libName))
            return;
        else
            this.extraLibInfos.set( libInfo.libName, libInfo);

        // fetch all files and put their content into the map by their paths
        let fileMap = new Map<string,string>();
        for( let file of libInfo.files)
        {
            try
            {
                let fileContent = await this.fileFetcher( file, libInfo.rootPath);
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



    /**
     * Adds a file with the given content to the editor
     * @param path
     * @param content 
     */
    public addFile( path: string, content: string): void
    {
        let model = this.files.get( path);
        if (!model)
        {
            let uri = monaco.Uri.parse( `file:///${path}`);
            model = monaco.editor.createModel( content, "typescript", uri);
            this.files.set( path, model);
        }

        this.monacoEditor.setModel( model);
    }



    /**
     * Loads a file from the given with the given path and adds its content to the editor. Path
     * is either absolute URL or relative to the site root.
     * @param path
     */
    public async loadFile( path: string): Promise<void>
    {
        let model = this.files.get( path);
        if (!model)
        {
            let content = await this.fileFetcher( path);
            this.addFile( path, content);
        }
        else
            this.monacoEditor.setModel( model);
    }



    /**
     * Loads a file from the given with the given path and adds its content to the editor. Path
     * is either absolute URL or relative to the site root.
     * @param path
     */
    public getFile( path: string): monaco.editor.ITextModel
    {
        return this.files.get( path);
    }



    /**
     * Compiles the given typescript file to JavaScript.
     * @param path
     */
    public async compileFile( path: string): Promise<ICompilationResult | null>
    {
        let model = this.files.get( path);
        if (!model)
            return null;

        let modelName = model.uri.toString();
        let worker = await (await ts.getTypeScriptWorker())( model.uri);

        let syntaxDiagnostics = await worker.getSyntacticDiagnostics( modelName);
        let semanticDiagnostics = await worker.getSemanticDiagnostics( modelName);
        let output = await worker.getEmitOutput( modelName) as monaco.languages.typescript.EmitOutput;

        // combine syntax and semantix errors into a single array
        let errors: ICompilationErrorInfo[] = [];
        for( let diag of syntaxDiagnostics)
            errors.push( this.convertDiagnosticToError( model, true, diag))
        for( let diag of semanticDiagnostics)
            errors.push( this.convertDiagnosticToError( model, false, diag))

        // sort the array by error position
        errors.sort( (a, b) => a.diag.start - b.diag.start);

        return {
            emitSkipped: output.emitSkipped,
            outputFiles: output.outputFiles.map( file => { return { name: file.name, text: file.text}}),
            errors,
        }
    }


    private convertDiagnosticToError( model: monaco.editor.ITextModel, isSyntax: boolean,
        diag: monaco.languages.typescript.Diagnostic): ICompilationErrorInfo
    {
        let pos = model.getPositionAt( diag.start);
        return {
            isSyntax,
            category: diag.category,
            code: diag.code,
            message: typeof diag.messageText === "string" ? diag.messageText : diag.messageText.messageText,
            row: pos.lineNumber,
            col: pos.column,
            length: diag.length,
            diag
        };
    }
}



