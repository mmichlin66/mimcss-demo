import * as mim from "mimbl";
import {Playground} from "./Playground";
import "./SharedStyles";



// this function is called from body.onload
this.mimcssDemoMain = async function( appRoot: HTMLElement)
{
    mim.mount( new Playground(), appRoot);
}



