import * as mim from "mimbl";
import * as css from "mimcss"


// Define styles for our component
class MyStyles extends css.StyleDefinition
{
    hello = css.$class({
        // 40px - "px" is the default unit for integer length values
        fontSize: 40,

        // "bold" is one of the keywords for the font-weight property
        fontWeight: "bold",

        // 0.5em - "em" is the default unit for floating number length values
        padding: 0.5,

        // css.Color object has properties for all built in colors
        color: css.Colors.dodgerblue,

        // tuple is used for the border property. Color can be provided as a keyword.
        border: [2, "inset", "darkblue"],

        // 16px
        borderRadius: 16,

        // using keyword
        textAlign: "center"
    })
}




// Define component that displays "Hello World!"
class HelloWorld extends mim.Component
{
    // activated styles
    private styles: MyStyles;

    public willMount()
    {
        // activate our styles - that is insert them into the DOM
        this.styles = css.activate( MyStyles);
    }

    public willUnmount()
    {
        // deactivate our styles - that is remove them from the DOM
        css.deactivate( this.styles);
    }

    // Render our component's HTML content
	public render()
	{
        // specify class by using the property of our style definition class
		return <div class={this.styles.hello}>
            Hello World!
        </div>
	}
}



// Mount our component under the body element.
mim.mount( new HelloWorld());


