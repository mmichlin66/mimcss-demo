import * as css from "mimcss"



export class DemoStyles extends css.StyleDefinition
{
    paramsArea = this.$gridarea();
    demoArea = this.$gridarea();
    resultArea = this.$gridarea();
    cssResultArea = this.$gridarea();

    masterGrid = this.$class({
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

    panel = this.$class({
        border: [1, "solid", "lightgrey"],
        placeSelf: "stretch",
        minWidth: 200,
        padding: 8
    })

    paramsPane = this.$class({
        "+": this.panel,
        gridArea: this.paramsArea,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16
    })

    demoPane = this.$class({
        "+": this.panel,
        gridArea: this.demoArea,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    })

    resultPane = this.$class({
        "+": this.panel,
        gridArea: this.resultArea,
    })

    cssResultPane = this.$class({
        "+": this.panel,
        gridArea: this.cssResultArea,
    })

    controlBox = this.$class({
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
    })

    controlRow = this.$class({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    })


}



export let demoStyles = css.activate( DemoStyles);



