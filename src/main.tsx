import * as mim from "mimbl";
import {MimcssDemo} from "./MimcssDemo";
import "./SharedStyles";



// this function is called from body.onload
this.mimcssDemoMain = async function( appRoot: HTMLElement)
{
    mim.mount( new MimcssDemo(), appRoot);
}



