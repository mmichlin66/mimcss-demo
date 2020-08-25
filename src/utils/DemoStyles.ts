import * as css from "mimcss"
import * as tsplay from "mim-tsplay"



export class DemoStyles extends css.StyleDefinition
{
    paramsArea = css.$gridarea();
    demoArea = css.$gridarea();
    resultArea = css.$gridarea();
    cssResultArea = css.$gridarea();

    masterGrid = css.$class({
        // width: "100%",
        // height: "100%",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: ["auto", "auto"],
        gridTemplateRows: ["auto", "auto", "auto"],
        gridTemplateAreas: [
            [this.paramsArea, 1,1, 1,1],
            [this.demoArea, 1,2, 1,2],
            [this.resultArea, 2,1, 2,2],
            [this.cssResultArea, 3,1, 3,2],
        ]
    })

    panel = css.$class({
        border: "1px solid lightgrey",
        placeSelf: "stretch",
        minWidth: 200,
        padding: 8
    })

    paramsPane = css.$class({
        "+": this.panel,
        gridArea: this.paramsArea,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16
    })

    demoPane = css.$class({
        "+": this.panel,
        gridArea: this.demoArea,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    })

    resultPane = css.$class({
        "+": this.panel,
        gridArea: this.resultArea,
    })

    cssResultPane = css.$class({
        "+": this.panel,
        gridArea: this.cssResultArea,
    })

    controlBox = css.$class({
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
    })

    controlRow = css.$class({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    })


}



export let demoStyles = css.activate( DemoStyles);



