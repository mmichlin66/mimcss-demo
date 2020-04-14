import {$abstract, $tag, $class, $id, $style, $keyframes, $var, $supports, $media,
	$import, $fontface, $namespace, $page, $use, $activate, $deactivate, $selector, sh, Colors, Len,
	IStylesheet, $enableOptimizedStyleNames, WebNamespaces, NestedGroup
} from "mimcss"



class SharedStyles
{
	init = [
		$style( "*", {
			fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
			boxSizing: "border-box",
			fontSize: 12,
			position: "relative",
		}),

		$tag( "html", { height: "100%" }),
		$tag( "body", { height: "100%", margin: 0 }),
	]

	h = $abstract({ fontWeight: "bold", marginTop: 0.75, marginBottom: 0.5 })
	headers = [
		$tag( "h1", { "+": this.h, fontSize: 24 }),
		$tag( "h2", { "+": this.h, fontSize: 20 }),
		$tag( "h3", { "+": this.h, fontSize: 18 }),
		$tag( "h4", { "+": this.h, fontSize: 16 }),
		$tag( "h5", { "+": this.h, fontSize: 14 }),
		$tag( "h6", { "+": this.h, fontSize: 12 }),
	]

	vbox = $class({ display: "flex", flexDirection: "column" })
	hbox = $class({ display: "flex", flexDirection: "row", alignItems: "center" })

	elastic = $class();

}



export let sharedStyles = $activate( SharedStyles);



