import * as mim from "mimbl";
import * as css from "mimcss"
import * as tsplay from "mim-tsplay"
import {demoStyles} from "../utils/DemoStyles"



/**
 * Each item for the picker is either an ID or a tuple containing ID and display name.
 */
export type OptionPickerItem = string | [string, string];



/**
 * Events exposed by the option picker component
 */
export interface IOptionPickerEvents
{
    change( itemID: string): void;
}



/**
 * A control that displays a choice of options.
 */
export class OptionPicker extends mim.Component
{
    constructor( items: OptionPickerItem[], selectedItemID?: string)
    {
        super();
        this.items = items;
        this._selectedItemID = selectedItemID
            ? selectedItemID
            : items.length > 0
                ? typeof items[0] === "string" ? items[0] : items[0][0]
                : null;
    }

    /** Events exposed by the OptionPicker component */
    public get events(): mim.MultiEventSlot<IOptionPickerEvents> { return this._events; }

    public get selectedItemID(): string { return this._selectedItemID; }
    public set selectedItemID( v: string) { this._selectedItemID = v; this.updateMe(); }

    public willUnmount(): void
    {
        this._events.change.clear();
    }

    public render(): any
    {
        return <select change={this.onItemSelected}>
            {this.items.map( item => {
                let id: string, displayName: string;
                if (typeof item === "string")
                    id = displayName = item;
                else
                    id = item[0], displayName = item[1];

                let selected = id === this._selectedItemID;
                return <option value={id} selected={selected}>{displayName}</option>;
            })}
        </select>
    }

    private onItemSelected( e: Event): void
    {
        let itemID = (e.target as HTMLSelectElement).value;
        this._selectedItemID = itemID;
        this._events.change.fire( itemID);
    }

    // List of items to pick from
    private items: OptionPickerItem[];

    // Currently selected item ID
    private _selectedItemID: string;

    // Events
    private _events = mim.createMultiEventSlot<IOptionPickerEvents>();
}



