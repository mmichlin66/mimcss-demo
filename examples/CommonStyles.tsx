import * as css from "mimcss"



export class CommonStyles extends css.StyleDefinition
{
	init = [
		css.$style( "*", { boxSizing: "border-box" }),

		css.$style( "html", { height: "100%" }),
		css.$style( "body", {
            height: "100%",
            margin: 0,
			fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
			fontSize: 12,
        }),
	]

	// h = css.$abstract({ fontWeight: "bold", marginTop: 0.75, marginBottom: 0.5 })
	// headers = [
	// 	css.$style( "h1", { "+": this.h, fontSize: 24 }),
	// 	css.$style( "h2", { "+": this.h, fontSize: 20 }),
	// 	css.$style( "h3", { "+": this.h, fontSize: 18 }),
	// 	css.$style( "h4", { "+": this.h, fontSize: 16 }),
	// 	css.$style( "h5", { "+": this.h, fontSize: 14 }),
	// 	css.$style( "h6", { "+": this.h, fontSize: 12 }),
	// ]

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
