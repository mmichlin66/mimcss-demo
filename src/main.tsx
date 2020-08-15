import * as mim from "mimbl";
import {Playground} from "./Playground";
import "./SharedStyles";



// this function is called from body.onload
globalThis.mimcssDemoMain = async function( appRoot: HTMLElement)
{
    mim.mount( new Playground(), appRoot);
}



