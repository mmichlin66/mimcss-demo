import * as mim from "mimbl";
import * as css from "mimcss"
import * as tsplay from "mim-tsplay"

/**
 * The Extension class is a playground extension that demonstrates Mimcss capabilities.
 */
class Extension implements tsplay.IPlaygroundExtension
{
    /** User friendly extension name */
    public static get displayName(): string { return "mimcss-demo"; }

    /**
     * Returns a list of extra library objects providing information about type files that will
     * be added to the editor for type checking.
     */
    public getExtraLibs(): tsplay.IExtraLibInfo[]
    {
        return null;
    }

    /**
     * Returns a list of examples.
     */
    public getExamples(): tsplay.IExampleInfo[]
    {
        return null;
    }

    /**
     * Returns a list of code snippets. Extensions can provide regular template-based snippets, but
     * they can also implement custom snippets with arbitrary UI.
     */
    public getCodeSnippets(): tsplay.ICodeSnippetInfo[]
    {
        let arr: (tsplay.ITemplateCodeSnippetInfo | tsplay.ICustomCodeSnippetInfo)[] =
        [
            {
                category: "Imports",
                name: "Mimcss",
                description: "Defines import from mimcss library",
                template: 'import * as css from "mimcss"\n',
            },
        ];

        return arr;
    }
}



// Register our extension
tsplay.registerExtension( Extension);



