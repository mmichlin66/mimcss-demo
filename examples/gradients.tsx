import * as mim from "mimbl";
import * as css from "mimcss"
import {CommonStyles} from "./CommonStyles"


// activate common styles
let commonStyles = css.activate( CommonStyles);



class GradientStyles extends css.StyleDefinition
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

// activate our styles
let styles = css.activate( GradientStyles);



class MainForm extends mim.Component
{
	public render()
	{
		return <div class={[commonStyles.vbox, commonStyles.spacing]}>
			<div class={[commonStyles.hbox, commonStyles.spacing]}>
				<div class={styles.linearGradient} />
				<div class={styles.radialGradient} />
				<div class={styles.conic} />
			</div>
		</div>
	}
}



// mount our form under the body element.
mim.mount( new MainForm());


