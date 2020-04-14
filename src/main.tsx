import * as mim from "mimbl";
import {$abstract, $tag, $class, $id, $style, $keyframes, $var, $supports, $media,
	$import, $fontface, $namespace, $page, $use, $activate, $deactivate, $selector, sh, Colors, Len,
	IStylesheet, $enableOptimizedStyleNames, WebNamespaces, NestedGroup
} from "mimcss"


import {sharedStyles} from "./SharedStyles"



/// #if UNIQUE_CSS_NAMES
$enableOptimizedStyleNames( true, "m");
/// #endif


// this function is called from body.onload
this.mimcssDemoMain = function( appRoot: HTMLElement)
{
	mim.mount( new MainForm(), appRoot);
}



class MyStyles
{
	linearGradient = $class({
		width: 200,
		height: 200,
		backgroundImage: sh.repeatingLinearGradient( 15,
						Colors.lightcyan, Colors.orange, [30], [Colors.lightcyan, 50])
	})

	radialGradient = $class({
		width: 200,
		height: 200,
		backgroundImage: sh.repeatingRadialGradient( "circle", "farthest-corner", [5.5,3.3],
						Colors.lightcyan, Colors.orange, [30], [Colors.lightcyan, 50])
	})

	// conic = $class({
	// 	width: 200,
	// 	height: 200,
	// 	backgroundImage: sh.conicGradient( 45, "70%", Colors.red, Colors.orange,
	// 		Colors.yellow, Colors.green, Colors.lightblue, Colors.blue, Colors.violet, Colors.red)
	// })
}



let myStyles = $activate( MyStyles);



class MainForm extends mim.Component
{
	public render()
	{
		return <div class="vbox spacing">
			<div class={sharedStyles.classes.hbox}>
				<div class={myStyles.classes.linearGradient} />
				<div class={myStyles.classes.radialGradient} />
			</div>
		</div>
	}
}



