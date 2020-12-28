import { conjugateContent } from "../parseItems/parseDetails";

/**
 * <h3>Overview</h3>
 * Converts items to list items that will be displayed in {@link ResultList}.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object[]} items - An array of items prepared by {@link parseClassifiedItems}.
 * @returns {Object[]} - An array of list items displayed in {@link ResultList}.
 */
function parseClassifiedListItems(items) {
    let listItems = [];

    if (Array.isArray(items) && items.length) {
        for (let i = 0; i < items.length; i++) {
            listItems.push({
                id: items[i].id,
                header: items[i].name.toString(),
                subheader: "Covered by " + conjugateContent(items[i].traits.numberOfCoveringRules, "rule"),
                multiContent: [
                    {
                        title: "Original decision:",
                        subtitle: items[i].traits.originalDecision
                    },
                    {
                        title: "Suggested decision:",
                        subtitle: items[i].traits.suggestedDecision
                    },
                    {
                        title: "Certainty:",
                        subtitle: items[i].traits.certainty
                    }
                ]
            })
        }
    }

    return listItems;
}

export default parseClassifiedListItems;
