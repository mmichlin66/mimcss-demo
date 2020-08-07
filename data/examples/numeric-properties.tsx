import * as mim from "mimbl";
import * as css from "mimcss"



// Define styles for our component
class MyStyles extends css.StyleDefinition
{
    outerBox = css.$class({
        // values of CSS <length> type use "px" for integer numbers and "em" for floating point numbers
        fontSize: 24,
        padding: 1.5,

        // values of CSS <angle> type use "deg" for integer numbers and "turn" for floating point numbers
        fontStyle: 45,

        // Mimcss provides functions with names corresponding to units
        margin: css.cm(0.5),

        // strings can also be used for numeric values - for developer convenience
        width: "95%",
        height: "3in",

        border: [1, "solid", "black"],
        overflow: "auto",
    })

    innerBox = css.$class({
        border: [3, "solid"],
        padding: 8,
        borderRadius: 8,
    })

    orangeBox = css.$class({
        "+": this.innerBox,
        backgroundColor: "orange",
        borderColor: "red",

        // use numeric functions to size and position the box. Since we are using the Len object, the
        // parameters will only accept values compatible with the CSS <length> type.
        // Note: there are better ways to position elements - we are just demonstrating the Mimcss
        // numeric functions.
        width: css.Len.calc`100% - ${200}`,

        // max( 100%, 30px, 2.5em)
        marginLeft: css.Len.max( "5%", 30, 1.2),
    })

    init = [
        css.$style( "*", { boxSizing: "border-box"}),
        css.$style( "html", {height: "100%"}),
        css.$style( "body", {height: "100%", margin: 0}),
    ]
}

// activate our styles
let styles = css.activate( MyStyles);



// Define component that displays "Hello World!"
class HelloWorld extends mim.Component
{
    // Render our component's HTML content
	public render()
	{
        // specify class by using the property of our style definition class
		return <div class={styles.outerBox}>
            <div class={styles.orangeBox}>
                This box uses Len.calc() and Len.min() methods
            </div>
        </div>
	}
}



// Mount our component under the body element.
mim.mount( new HelloWorld());


