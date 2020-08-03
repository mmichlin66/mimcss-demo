import * as mim from "mimbl";
import * as css from "mimcss"
import {TsxEditor, IExtraLibInfo} from "./TsxEditor";



// Map of example names to file paths
let htmlTemplateMarker = "const replace_me = true;";



// Type representing information about a single example
type ExampleInfo =
{
    // User-readable example name.
    name: string;

    // Path to the example file. If undefied or empty, then it is treated as a group name. All
    // examples after this item and until the next group item will be considered as belonging to
    // this group.
    path?: string;

    // optional description
    descr?: string;
}

// Type representing the list of examples.
type ExampleList = ExampleInfo[];

// Path to the file containing the list of examples
const ExampleListFilePath = "examples/example-list.json"



// Type representing the list of extra libraries.
type ExtraLibList = IExtraLibInfo[];

// Path to the file containing the list of extra libraries
const ExtraLibFilePath = "extra-lib-list.json"



/**
 * The MimcssDemo class is a Mimbl component that allows the user create TypeScript codeusing
 * Mimcss and Mimbl libraries in the monaco editor. The code is then transpiled to JavaScript,
 * which is embedded in a simple HTML file. The content of the HTML file is then displayed in
 * an IFRAME.
 */
export class MimcssDemo extends mim.Component
{
    // Style definitions for our component
    private sd: MimcssDemoStyles;

    // Monaco editor wrapper object
    private editor: TsxEditor;

    // Reference to the container HTML element
    private iframeRef = new mim.Ref<HTMLIFrameElement>();

    // List of extra libraries read from the extra-lib-list JSON file. It is initially empty.
    private extraLibList: ExtraLibList = [];

    // Example list read from the example-list JSON file. It is initially empty.
    private exampleList: ExampleList = [];

    // Map of example paths to ExampleInfo objects
    private exampleMap = new Map<string,ExampleInfo>();

    // Current file selected in the monaco editor
    @mim.updatable
    private currentFileInfo: ExampleInfo;

    // HTML template within which we need to replace a marker with the JavaScript transpiled
    // from the current file in the editor.
    private htmlTemplate: string | null = null;



    public async willMount()
    {
        this.sd = css.activate( MimcssDemoStyles);

        // create the editor
        this.editor = new TsxEditor( (path: string, rootPath: string) => fetchFileTextContent( path, rootPath));
    }

    public async didMount()
    {
        // load list of examples
        await this.loadExtraLibs();

        // add files with typings
        for( let libInfo of this.extraLibList)
            await this.editor.addExtraLib( libInfo);

        // load list of examples
        await this.loadExamples();

        // open template file
        this.currentFileInfo = this.exampleMap.get( "examples/basic-template.tsx");
        this.editor.loadFile( this.currentFileInfo.path);

        this.updateMe( this.renderExampleList);
    }

    public willUnmount()
    {
        css.deactivate( this.sd);
    }

    public render(): any
	{
        return <div class={this.sd.grid}>
            {this.renderEditorToolbar}
            {this.renderHtmlToolbar}
            <div class={this.sd.editorPanel}>{this.editor}</div>
            <div class={this.sd.splitter}></div>
            <iframe class={this.sd.htmlPanel} ref={this.iframeRef}></iframe>
            <div class={this.sd.statusbar}>
                Current example: <span>{this.currentFileInfo && this.currentFileInfo.name}</span>
            </div>
        </div>
    }

    private renderEditorToolbar(): any
	{
        return <div class={this.sd.editorToolbar}>
            {this.renderExampleList}
        </div>
    }

    private renderExampleList(): any
	{
        return <mim.Fragment>
            Examples: <select change={this.onExampleSelected}>
                {this.renderExampleOptions()}
            </select>
        </mim.Fragment>
    }

    private renderExampleOptions(): any[]
	{
        let options: any[] = [];
        for( let i = 0; i < this.exampleList.length; i++)
        {
            let info = this.exampleList[i];
            if (info.path)
                options.push( this.renderExampleOption( info));
            else
            {
                let subOptions: any[] = [];
                for( let j = i + 1; j < this.exampleList.length; j++)
                {
                    let info = this.exampleList[j];
                    if (info.path)
                    {
                        subOptions.push( this.renderExampleOption( info));
                        i++;
                    }
                    else
                    {
                        // the next item is a new group
                        i = j - 1;
                        break;
                    }
                }

                options.push( <optgroup label={info.name} title={info.descr}>
                    {subOptions}
                </optgroup>);
            }
        }

        return options;
    }

    private renderExampleOption( info: ExampleInfo): any
	{
        let selected = this.currentFileInfo && info.path === this.currentFileInfo.path;
        return <option value={info.path} title={info.descr} selected={selected}>
            {info.name}
        </option>;
    }

    private renderHtmlToolbar(): any
	{
        return <div class={this.sd.htmlToolbar}>
            <button id="run" click={this.onRunClicked}
                title="Compile code and display results">Run</button>
        </div>
    }



    private onExampleSelected( e: Event): void
    {
        let path = (e.target as HTMLSelectElement).value;
        if (!path)
            return;

        this.editor.loadFile( path);
        this.currentFileInfo = this.exampleMap.get( path);
    }

    private async onRunClicked(): Promise<void>
    {
        if (!this.currentFileInfo)
            return;

        let js = await this.editor.compileFile( this.currentFileInfo.path);
        this.iframeRef.r.srcdoc = await this.createHtml(js);
    }



    // Load list of extra libraries
    private async loadExtraLibs()
    {
        try
        {
            this.extraLibList = await fetchFileJsonContent( ExtraLibFilePath);
        }
        catch( err)
        {
            console.error( "Cannot load list of extra libraries", err);
        }
    }

    // Load example list and put examples into our internal map
    private async loadExamples()
    {
        try
        {
            this.exampleList = await fetchFileJsonContent( ExampleListFilePath);

            // our internal map contains only real examples with paths - not group names
            this.exampleList.forEach( info => {
                if (info.path)
                    this.exampleMap.set( info.path, info);
            });
        }
        catch( err)
        {
            console.error( "Cannot load list of examples", err);
        }
    }

    private async createHtml( js:string): Promise<string>
    {
        if (!this.htmlTemplate)
        {
            this.htmlTemplate = await fetchFileTextContent( "MimcssDemoHtmlTemplate.html");
        }

        return this.htmlTemplate.replace( htmlTemplateMarker, js);
    };
}






async function fetchFileTextContent( file: string, rootPath?: string): Promise<string>
{
    let path = (rootPath ? rootPath : "") + file;
    let res = await fetch( path);
    return await res.text();
}

async function fetchFileJsonContent<T = any>( file: string, rootPath?: string): Promise<T>
{
    let text = await fetchFileTextContent( file, rootPath);
    return JSON.parse( text) as T;
}



class MimcssDemoStyles extends css.StyleDefinition
{
    editorToolbarArea = css.$gridarea();
    editorContentArea = css.$gridarea();
    htmlToolbarArea = css.$gridarea();
    htmlContentArea = css.$gridarea();
    statusbarArea = css.$gridarea();
    splitterArea = css.$gridarea();

    grid = css.$class({
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: ["1fr", "auto", "1fr"],
        gridTemplateRows: ["auto", "1fr", "auto"],
        gridTemplateAreas: [
            [this.editorToolbarArea, 1,1, 1,1],
            [this.editorContentArea, 2,1, 2,1],
            [this.htmlToolbarArea, 1,3, 1,3],
            [this.htmlContentArea, 2,3, 2,3],
            [this.statusbarArea, 3,1, 3,3],
            [this.splitterArea, 1,2, 2,2],
        ]
    })

    panel = css.$class({
        padding: 4,
        border: "2px inset",
        placeSelf: "stretch",
        minWidth: 200,
    })

    editorPanel = css.$class({
        "+": this.panel,
        gridArea: this.editorContentArea,
    })

    htmlPanel = css.$class({
        "+": this.panel,
        gridArea: this.htmlContentArea,
    })

    toolbar = css.$class({
        backgroundColor: "lightgrey",
        padding: 4
    })

    editorToolbar = css.$class({
        "+": this.toolbar,
        gridArea: this.editorToolbarArea,
    })

    htmlToolbar = css.$class({
        "+": this.toolbar,
        gridArea: this.htmlToolbarArea,
    })

    statusbar = css.$class({
        padding: 4,
        backgroundColor: "lightgrey",
        gridArea: this.statusbarArea,
    })

    splitter = css.$class({
        width: 8,
        backgroundColor: "lightgrey",
        gridArea: this.splitterArea,
    })
}



