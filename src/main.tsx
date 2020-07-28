import * as mim from "mimbl";
import * as css from "mimcss"


/// #if !DEBUG
css.enableShortNames( true, "m");
/// #endif


import {sharedStyles} from "./SharedStyles"



// this function is called from body.onload
this.mimcssDemoMain = function( appRoot: HTMLElement)
{
	mim.mount( new MainForm(), appRoot);
}



class MyStyles extends css.StyleDefinition
{
	linearGradient = css.$class({
		width: 200,
		height: 200,
        backgroundImage: css.gradient.repeatingLinear.to(15)( css.Colors.lightcyan,
            css.Colors.orange, [30], [css.Colors.lightcyan, 50])
	})

	radialGradient = css.$class({
		width: 200,
		height: 200,
		backgroundImage: css.gradient.repeatingRadial.circle().extent("farthest-corner").at([5.5,3.3])(
						css.Colors.lightcyan, css.Colors.orange, [30], [css.Colors.lightcyan, 50])
	})

	// conic = css.$class({
	// 	width: 200,
	// 	height: 200,
	// 	backgroundImage: sh.conicGradient( 45, "70%", css.Colors.red, css.Colors.orange,
	// 		css.Colors.yellow, css.Colors.green, css.Colors.lightblue, css.Colors.blue, css.Colors.violet, css.Colors.red)
	// })
}



let myStyles = css.activate( MyStyles);



class MainForm extends mim.Component
{
	public render()
	{
		return <div class={sharedStyles.vbox.name + " " + sharedStyles.spacing.name}>
			<div class={sharedStyles.hbox.name + " " + sharedStyles.spacing.name}>
				<div class={myStyles.linearGradient.name} />
				<div class={myStyles.radialGradient.name} />
			</div>
		</div>
	}
}



