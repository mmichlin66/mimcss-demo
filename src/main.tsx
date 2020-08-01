import * as mim from "mimbl";
import * as css from "mimcss"
import * as monaco from "monaco-editor";
import {TsxEditor} from "./editor/TsxEditor";



/// #if !DEBUG
css.enableShortNames( true, "m");
/// #endif


import {sharedStyles} from "./SharedStyles"



// this function is called from body.onload
this.mimcssDemoMain = async function( appRoot: HTMLElement)
{
    mim.mount( new TsxEditor(), appRoot);

    // let ts = monaco.languages.typescript;

    // let exampleContent = await fetchFileContent( "examples/gradients.tsx");
    // let exampleUri = monaco.Uri.parse( "file:///examples/gradients.tsx");

    // let exampeModel = monaco.editor.createModel( exampleContent, "typescript", exampleUri);
    // editor.setModel( exampeModel);

    // let func = await ts.getTypeScriptWorker();
    // let worker = await func( exampleUri);
    // let result = await worker.getEmitOutput( exampleUri.toString());
    // console.log( result.outputFiles[0].text);

    // editor.setModel(null);
    // editor.dispose();
    // exampeModel.dispose();
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

	conic = css.$class({
		width: 200,
		height: 200,
		backgroundImage: css.gradient.conic.from(45).at("70%")( css.Colors.red, css.Colors.orange,
			css.Colors.yellow, css.Colors.green, css.Colors.lightblue, css.Colors.blue, css.Colors.violet, css.Colors.red)
	})
}



let myStyles = css.activate( MyStyles);



class MainForm extends mim.Component
{
	public render()
	{
		return <div class={[sharedStyles.vbox, sharedStyles.spacing]}>
			<div class={[sharedStyles.hbox, sharedStyles.spacing]}>
				<div class={myStyles.linearGradient} />
				<div class={myStyles.radialGradient} />
				<div class={myStyles.conic} />
			</div>
		</div>
	}
}



