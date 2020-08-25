import * as mim from "mimbl";
import * as css from "mimcss"
import * as tsplay from "mim-tsplay"
import {demoStyles} from "../utils/DemoStyles"
import { BorderStyle_StyleType, BorderStyle_Keyword, INamedColors } from "mimcss";
import { OptionPicker } from "../utils/OptionPicker";
import { ColorPicker } from "../utils/ColorPicker";



let defaultSize: css.CssLength = 4;
let defaultStyle: BorderStyle_Keyword = "solid";
let defaultColor: css.CssColor = "black";


/**
 * A dialog that allows the user to provide values for the border style property.
 */
export class BorderPropParams extends mim.Dialog
{
    constructor( propName: "border" | "outline")
    {
        super( undefined, `${propName} property parameters`);
        this.propName = propName;

        this.addButton( { id: "ok", content: "OK", callback: () => this.onOKClicked()})
        this.addButton( { id: "cancel", content: "Cancel", returnValue: null})

        this.size = defaultSize;
        this.style = defaultStyle;
        this.color = defaultColor;

        this.stylePicker = new OptionPicker( ["none", "hidden", "dotted", "dashed", "solid", "double",
            "groove", "ridge", "inset", "outset"], defaultStyle);
        this.stylePicker.events.change.attach( this.onStyleChanged);

        this.colorPicker = new ColorPicker();
        this.colorPicker.events.change.attach( this.onColorChanged);
        this.mimcssColorString = this.colorPicker.selectedMimcssColorString;
    }

    public renderBody(): any
    {
        return <div class={demoStyles.masterGrid}>
            {this.renderParams}
            {this.renderDemo}
            {this.renderResult}
            {this.renderCssResult}
       </div>
    }

    public renderParams(): any
    {
        return <div class={demoStyles.paramsPane}>
            <div class={tsplay.sharedStyles.vbox}>
                <strong>Size</strong>
                <input type="text" defaultValue={defaultSize.toString()} input={this.onSizeChanged}></input>
            </div>
            <div class={tsplay.sharedStyles.vbox}>
                <strong>Style</strong>
                {this.stylePicker}
            </div>
            <div class={tsplay.sharedStyles.vbox}>
                <strong>Color</strong>
                {this.colorPicker}
                {/* <input type="text" defaultValue={defaultColor.toString()}
                        input={(e) => this.color = (e.target as HTMLInputElement).value as keyof INamedColors}></input> */}
            </div>
        </div>
    }

    public renderDemo(): any
    {
        return <div class={demoStyles.demoPane}>
            <div style={{
                [this.propName]: [this.size, this.style, this.color],
                width: 100, height: 100,
            }} />
        </div>
    }

    public renderResult(): any
    {
        return <div class={demoStyles.resultPane}>
            <span><strong>Mimcss: </strong></span>
            <span>{this.result}</span>
        </div>
    }

    public renderCssResult(): any
    {
        return <div class={demoStyles.cssResultPane}>
            <span><strong>CSS: </strong></span>
            <span>{this.cssResult}</span>
        </div>
    }

    private onSizeChanged( e: Event): void
    {
        let sizeAsString = (e.target as HTMLInputElement).value;
        this.size = parseFloat( sizeAsString);
        if (isNaN(this.size))
            this.size = 1;
    }

    private onStyleChanged = (style: BorderStyle_Keyword): void =>
    {
        this.style = style;
    }

    private onColorChanged = (color: css.CssColor, mimcssColorString: string): void =>
    {
        this.color = color;
        this.mimcssColorString = mimcssColorString;
    }

    private async onOKClicked(): Promise<void>
    {
        this.close( this.result);
    }



    // Resulting string that is displayed in the reslt pane and is also the snippet to be inserted
    @mim.computed
    private get result(): string
    {
        let size = typeof this.size === "string" ? `"${this.size}"` : this.size.toString();

        return `${this.propName}: [${size}, "${this.style}", ${this.mimcssColorString}]`;
    }

    // CSS equivalent of the resulting string
    @mim.computed
    private get cssResult(): string
    {
        return this.propName + ": " + css.getStylePropValue( this.propName,
            [this.size, this.style, this.color]);
    }

    // Name of the property - border or outline
    private propName: "border" | "outline";

    // Border size
    @mim.trigger
    private size: css.BorderWidth_Single;

    // Border style
    @mim.trigger
    private style: css.BorderStyle_Keyword;

    // Border color
    @mim.trigger
    private color: css.CssColor;

    // Border color
    @mim.trigger
    private mimcssColorString: string;

    private stylePicker: OptionPicker;

    private colorPicker: ColorPicker;
}



