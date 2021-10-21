import * as mim from "mimbl";
import * as css from "mimcss"
import * as tsplay from "mim-tsplay"
import {demoStyles} from "../utils/DemoStyles"
import {OptionPicker} from "./OptionPicker";
import {sharedStyles} from "mim-tsplay";
import { INamedColors } from "mimcss";



const defaultNamedColor: keyof INamedColors = "black";
const defaultHexColor = 0x0;



/**
 * Events exposed by the option picker component
 */
export interface IColorPickerEvents
{
    change( color: css.CssColor, mimcssColorString: string): void;
}



/**
 * A control that allows selecting a CssColor value.
 */
export class ColorPicker extends mim.Component
{
    constructor( color?: string | number, alpha: number = 1, inverted: boolean = false)
    {
        super();

        this.namedColorPicker = new OptionPicker( Array.from( Object.keys(css.Colors)));
        this.namedColorPicker.events.change.attach( this.onNamedColorSelected);

        this.systemColorPicker = new OptionPicker( ["ActiveText", "ButtonFace", "ButtonText", "Canvas", "CanvasText",
                "Field", "FieldText", "GrayText", "Highlight", "HighlightText", "LinkText", "VisitedText"]);
        this.systemColorPicker.events.change.attach( this.onSystemColorSelected);

        this.setSelectedColor( color, alpha, inverted);
    }

    /** Events exposed by the ColorPicker component */
    public get events(): mim.MultiEventSlot<IColorPickerEvents> { return this._events; }

    /** Currently selected color */
    public get selectedColor(): css.CssColor { return this._selectedColor; }

    /**
     * Sets the currently selected color using the given parameters.
     * @param color Color value as a string or a number
     * @param alpha Alpha channel value - only relevant for named and numeric colors
     * @param inverted Color invertion flag - only relevant for named and numeric colors
     */
    public setSelectedColor( color?: string | number, alpha: number = 1, inverted: boolean = false)
    {
        if (color == null)
            color = defaultNamedColor;

        if (typeof color === "string")
        {
            if (color in css.Colors)
            {
                this.valueKind = ColorValueKind.Named;
                this.namedColorPicker.selectedItemID = color;
                this.buildNamedColor( color as keyof css.INamedColors, inverted);
            }
            else
            {
                if (color === "transparent")
                {
                    this.valueKind = ColorValueKind.Transparent;
                    this.updateSelectedColor( color);
                }
                else if (color === "currentcolor")
                {
                    this.valueKind = ColorValueKind.Current;
                    this.updateSelectedColor( color);
                }
                else
                {
                    this.valueKind = ColorValueKind.System;
                    this.systemColorPicker.selectedItemID = color;
                    this.updateSelectedColor( color as css.SystemColors);
                }
            }
        }
        else
        {
            this.buildHexColor( color, alpha, inverted);
            this.valueKind = ColorValueKind.Hex;
            if (this.hexInput)
                this.hexInput.value = color.toString(16);
        }

    }

    /** Returns Mimcss notation of the currently selected color */
    public get selectedMimcssColorString(): string { return this._selectedMimcssColorString; }

    public willUnmount(): void
    {
        this._events.change.clear();
    }

    public render(): any
    {
        let namedChecked = this.valueKind === ColorValueKind.Named;
        let hexChecked = this.valueKind === ColorValueKind.Hex;
        let systemChecked = this.valueKind === ColorValueKind.System;

        return <div class={demoStyles.controlBox}>
            <div class={demoStyles.controlRow}>
                <input type="radio" name="valueKind" id={ColorValueKind.Named} checked={namedChecked} click={this.onValueKindChanged}/>
                <label for={ColorValueKind.Named}>named</label>
                <div class={demoStyles.controlRow} style={{ visibility: namedChecked ? "visible" : "hidden"}}>
                    {this.namedColorPicker}
                    <label for="namedAlphaInput">alpha</label>
                    <label for="namedInvertInput">inverted</label>
                    <input type="checkbox" id="namedInvertInput" ref={this.namedInvertInput} defaultCheck={false} input={this.onNamedColorChanged}/>
                </div>
            </div>

            <div class={demoStyles.controlRow}>
                <input type="radio" name="valueKind" id={ColorValueKind.Hex} checked={hexChecked} click={this.onValueKindChanged}/>
                <label for={ColorValueKind.Hex}>hexadecimal</label>
                <div class={demoStyles.controlRow} style={{ visibility: hexChecked ? "visible" : "hidden"}}>
                    <input type="text" ref={this.hexInput} defaultValue={defaultHexColor.toString()}
                        size={6} input={this.onHexColorChanged} style={{textTransform: "uppercase", textAlign: "center"}}/>
                    <input type="color" ref={this.hexPickerInput} input={this.onHexPickerChanged}/>
                    <label for="hexAlphaInput">alpha</label>
                    <input type="number" id="hexAlphaInput" ref={this.hexAlphaInput} min={0} max={1} step={0.1}
                        defaultValue="1" input={this.onHexColorChanged} style={{width: css.em(4)}}/>
                    <label for="hexInvertInput">inverted</label>
                    <input type="checkbox" id="hexInvertInput" ref={this.hexInvertInput} defaultCheck={false} input={this.onHexColorChanged}/>
                </div>
           </div>

            <div class={demoStyles.controlRow}>
                <input type="radio" name="valueKind" id={ColorValueKind.System} checked={systemChecked} click={this.onValueKindChanged}/>
                <label for={ColorValueKind.System}>system</label>
                <span style={{ visibility: systemChecked ? "visible" : "hidden"}}>{this.systemColorPicker}</span>
            </div>

            <div class={demoStyles.controlRow}>
                <input type="radio" name="valueKind" id={ColorValueKind.Transparent}
                    checked={this.valueKind === ColorValueKind.Transparent} click={this.onValueKindChanged}/>
                <label for={ColorValueKind.Transparent}>transparent</label>
            </div>

            <div class={demoStyles.controlRow}>
                <input type="radio" name="valueKind" id={ColorValueKind.Current}
                    checked={this.valueKind === ColorValueKind.Current} click={this.onValueKindChanged}/>
                <label for={ColorValueKind.Current}>currentcolor</label>
            </div>
        </div>
    }

    private onValueKindChanged( e: Event): void
    {
        this.valueKind = (e.target as HTMLElement).id as ColorValueKind;
        if (this.valueKind === ColorValueKind.Named)
            this.onNamedColorChanged();
        else if (this.valueKind === ColorValueKind.Hex)
            this.onHexColorChanged();
        else if (this.valueKind === ColorValueKind.System)
            this.updateSelectedColor( this.systemColorPicker.selectedItemID as css.SystemColors);
        else if (this.valueKind === ColorValueKind.Transparent)
            this.updateSelectedColor( "transparent");
        else if (this.valueKind === ColorValueKind.Current)
            this.updateSelectedColor( "currentcolor");
    }

    private onNamedColorSelected = (namedColor: keyof css.INamedColors): void =>
    {
        this.onNamedColorChanged();
    }

    private onNamedColorChanged(): void
    {
        this.buildNamedColor( this.namedColorPicker.selectedItemID as keyof css.INamedColors,
                    this.namedInvertInput.checked);
    }

    private onHexColorChanged(): void
    {
        this.buildHexColor( parseInt( this.hexInput.value, 16),
                        parseFloat( this.hexAlphaInput.value), this.hexInvertInput.checked);
    }

    private onHexPickerChanged(): void
    {
        let n = parseInt( this.hexPickerInput.value.substr(1), 16);
        if (isNaN(n))
            n = 0;

        this.hexInput.value = n.toString(16).toUpperCase();
        this.onHexColorChanged();
    }

    private onSystemColorSelected = (systemColor: css.SystemColors): void =>
    {
        this.updateSelectedColor( systemColor);
    }

    // Builds CssColor from a name, alpha and invertion flag
    private buildNamedColor( name: keyof css.INamedColors, inverted: boolean): void
    {
        let color: css.CssColor = name;
        let mimcssColorString: string;

        if (inverted)
        {
            let n = css.Colors[name]
            n = n === 0 ? 0xFFFFFF : n === 0xFFFFFF ? 0 : -n;
            color = n;
        }

        this.updateSelectedColor( color, mimcssColorString);
    }

    // Builds CssColor from a number, alpha and invertion flag
    private buildHexColor( n: number, alpha: number, inverted: boolean): void
    {
        let mimcssColorString: string;
        if (isNaN(n))
            n = 0;

        if (isNaN(alpha))
            alpha = 1;

        if (inverted)
            n = n === 0 ? 0xFFFFFF : n === 0xFFFFFF ? 0 : -n;

        let color: css.CssColor = n;
        if (alpha === 0)
            color = "transparent";
        else if (alpha < 1)
        {
            color += n >= 0 ? alpha : -alpha;
            let sign = n >= 0 ? "" : "-";
            let op = n >= 0 ? "+" : "-";
            n = n >= 0 ? n : -n;
            mimcssColorString = `(${sign}0x${n.toString(16)} ${op} ${alpha})`;
        }

        this.updateSelectedColor( color, mimcssColorString);
    }

    private updateSelectedColor( color: css.CssColor, mimcssColorString?: string)
    {
        this._selectedColor = color;

        if (mimcssColorString)
            this._selectedMimcssColorString = mimcssColorString;
        else if (typeof color === "string")
            this._selectedMimcssColorString = `"${color}"`;
        else if (typeof color === "number")
            this._selectedMimcssColorString = color >= 0 ? "0x" + color.toString(16) : "-0x" + (-color).toString(16);

        this._events.change.fire( color, this._selectedMimcssColorString);
    }



    // Indicator what kind of color value the user has selected
    @mim.trigger
    private valueKind: ColorValueKind;

    // Picker for named colors
    private namedColorPicker: OptionPicker;

    // Picker for system colors
    private systemColorPicker: OptionPicker;

    // Reference to the check box where user sets whether to invert the named color
    @mim.ref
    private namedInvertInput: HTMLInputElement;

    // Reference to the text box where user enters alpha value for the numeric color
    @mim.ref
    private hexAlphaInput: HTMLInputElement;

    // Reference to the check box where user sets whether to invert the numeric color
    @mim.ref
    private hexInvertInput: HTMLInputElement;

    // Reference to the text box where user enters hexadecimal values
    @mim.ref
    private hexInput: HTMLInputElement;

    // Reference to the text box where user enters hexadecimal values
    @mim.ref
    private hexPickerInput: HTMLInputElement;

    // Currently selected color
    private _selectedColor: css.CssColor;

    // Currently selected color in Mimcss notation
    private _selectedMimcssColorString: string;

    // Events
    private _events = mim.createMultiEventSlot<IColorPickerEvents>();
}



const enum ColorValueKind
{
    Named = "Named",
    Hex = "Hex",
    System = "System",
    Transparent = "Transparent",
    Current = "Current",
}



