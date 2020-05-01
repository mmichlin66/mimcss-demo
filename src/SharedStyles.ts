﻿import * as css from "mimcss"



class SharedStyles extends css.StyleDefinition
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



