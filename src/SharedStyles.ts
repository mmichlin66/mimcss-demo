import * as css from "mimcss"



class SharedStyles extends css.StyleDefinition
{
	init = [
		css.$style( "*", {
			fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
			boxSizing: "border-box",
			fontSize: 12,
			position: "relative",
		}),

		css.$tag( "html", { height: "100%" }),
		css.$tag( "body", { height: "100%", margin: 0 }),
	]

	h = css.$abstract({ fontWeight: "bold", marginTop: 0.75, marginBottom: 0.5 })
	headers = [
		css.$tag( "h1", { "+": this.h, fontSize: 24 }),
		css.$tag( "h2", { "+": this.h, fontSize: 20 }),
		css.$tag( "h3", { "+": this.h, fontSize: 18 }),
		css.$tag( "h4", { "+": this.h, fontSize: 16 }),
		css.$tag( "h5", { "+": this.h, fontSize: 14 }),
		css.$tag( "h6", { "+": this.h, fontSize: 12 }),
	]

	defaultInlineGap = css.$var( "width", 8)
	defaultBlockGap = css.$var( "width", 8)

	spacing = css.$class();
	elastic = css.$class();
	vbox = css.$class({
		display: "flex", flexDirection: "column",
		"&": [
			["& > *", { flex: [0, 0, "auto"] }],
			[css.$selector( "&{0} > *", this.spacing), { marginBlockStart: this.defaultBlockGap, marginBlockEnd: this.defaultBlockGap }],
			[css.$selector( "& > {0}", this.elastic), { flex: "1 1 0", overflow: "auto" }],
		]
	})
	hbox = css.$class({
		display: "flex", flexDirection: "row", alignItems: "center",
		"&": [
			["& > *", { flex: [0, 0, "auto"] }],
			[css.$selector( "&{0} > *", this.spacing), { marginInlineStart: this.defaultInlineGap, marginInlineEnd: this.defaultInlineGap }],
			[css.$selector( "& > {0}", this.elastic), { flex: "1 1 0", overflow: "auto" }],
		]
	})


}



export let sharedStyles = css.$activate( SharedStyles);



