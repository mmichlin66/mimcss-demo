import * as mim from "mimbl";
import * as css from "mimcss"


// Define styles for our component
class MyStyles extends css.StyleDefinition
{
}




// Define component
class MyComponent extends mim.Component
{
    // activated styles
    private styles: MyStyles;

    public willMount()
    {
        // activate our styles
        this.styles = css.activate( MyStyles);
    }

    public willUnmount()
    {
        // deactivate our styles
        css.deactivate( this.styles);
    }

	public render()
	{
        // render component HTML content
		return <div/>
	}
}



// Mount our component under the body element.
mim.mount( new MyComponent());


