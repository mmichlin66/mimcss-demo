import * as mim from "mimbl";
import * as css from "mimcss"
import {TsxEditor, IExtraLibInfo} from "./TsxEditor";



// Map of example names to file paths
let htmlTemplateMarker = "const replace_me = true;";



// Map of example names to file paths
let examples = [
    ["Hello World!", "examples/HelloWorld.tsx"],
    ["Template", "examples/Template.tsx"],
    ["Gradients", "examples/Gradients.tsx"]
];



let mimcssTypings: IExtraLibInfo =
{
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
}



let mimblTypings: IExtraLibInfo =
{
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
}



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

    // Current file selected in the monaco editor
    @mim.updatable
    private currentFilePath: string;

    // HTML template within which we need to replace a marker with the JavaScript transpiled
    // from the current file in the editor.
    private htmlTemplate: string | null = null;



    public async willMount()
    {
        this.sd = css.activate( MimcssDemoStyles);

        // create and initialize the editor
        this.editor = new TsxEditor( this.fetchFileContent);
        await this.editor.addExtraLib( mimcssTypings);
        await this.editor.addExtraLib( mimblTypings);

        // open empty file
        this.editor.loadFile( "examples/Template.tsx");
        this.currentFilePath = "examples/Template.tsx";
    }

    public willUnmount()
    {
        css.deactivate( this.sd);
    }

    public render()
	{
        return <div class={this.sd.grid}>
            {this.renderEditorToolbar}
            {this.renderHtmlToolbar}
            <div class={this.sd.editorPanel}>{this.editor}</div>
            <div class={this.sd.splitter}></div>
            <iframe class={this.sd.htmlPanel} ref={this.iframeRef}></iframe>
            <div class={this.sd.statusbar}>
                Current example: <span>{this.currentFilePath}</span>
            </div>
        </div>
    }

    public renderEditorToolbar()
	{
        return <div class={this.sd.editorToolbar}>
            Examples: <select change={this.onExampleSelected}>
                <option value="">-- Select --</option>
                {examples.map( pair =><option value={pair[1]}>{pair[0]}</option>)}
            </select>
        </div>
    }

    public renderHtmlToolbar()
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
        this.currentFilePath = path;
    }

    private async onRunClicked(): Promise<void>
    {
        if (!this.currentFilePath)
            return;

        let js = await this.editor.compileFile( this.currentFilePath);
        this.iframeRef.r.srcdoc = await this.createHtml(js);
    }



    private async createHtml( js:string): Promise<string>
    {
        if (!this.htmlTemplate)
        {
            this.htmlTemplate = await this.fetchFileContent( "MimcssDemoHtmlTemplate.html");
        }

        return this.htmlTemplate.replace( htmlTemplateMarker, js);
    };



    private fetchFileContent = async (file: string, rootPath?: string): Promise<string> =>
    {
        let path = (rootPath ? rootPath : "") + file;
        let res = await fetch( path);
        return await res.text();
    };
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



