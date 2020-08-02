import * as mim from "mimbl";
import * as css from "mimcss"


export class CommonStyles extends css.StyleDefinition
{
	init = [
		css.$style( "*", {
			fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
			boxSizing: "border-box",
			fontSize: 12,
			position: "relative",
		}),

		css.$style( "html", { height: "100%" }),
		css.$style( "body", { height: "100%", margin: 0 }),
	]

	h = css.$abstract({ fontWeight: "bold", marginTop: 0.75, marginBottom: 0.5 })
	headers = [
		css.$style( "h1", { "+": this.h, fontSize: 24 }),
		css.$style( "h2", { "+": this.h, fontSize: 20 }),
		css.$style( "h3", { "+": this.h, fontSize: 18 }),
		css.$style( "h4", { "+": this.h, fontSize: 16 }),
		css.$style( "h5", { "+": this.h, fontSize: 14 }),
		css.$style( "h6", { "+": this.h, fontSize: 12 }),
	]

	defaultInlineGap = css.$var( "width", 8)
	defaultBlockGap = css.$var( "width", 8)

	spacing = css.$class();
	elastic = css.$class();
	vbox = css.$class({
		display: "flex", flexDirection: "column",
		"&>": [
			["*", { flex: [0, 0, "auto"] }],
			[this.elastic, { flex: "1 1 0", overflow: "auto" }],
		],
		"&": [
			[css.selector`&${this.spacing} > *`, { marginBlockStart: this.defaultBlockGap, marginBlockEnd: this.defaultBlockGap }],
		]
	})
	hbox = css.$class({
		display: "flex", flexDirection: "row", alignItems: "center",
		"&>": [
			["*", { flex: [0, 0, "auto"] }],
			[this.elastic, { flex: "1 1 0", overflow: "auto" }],
		],
		"&": [
			[css.selector`&${this.spacing} > *`, { marginInlineStart: this.defaultInlineGap, marginInlineEnd: this.defaultInlineGap }],
		]
	})
}

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


