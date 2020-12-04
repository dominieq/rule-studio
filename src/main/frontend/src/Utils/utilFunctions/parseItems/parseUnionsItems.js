/**
 * Converts server response to an array of items. Single item can be displayed in {@link UnionsDialog}.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} data - Server response.
 * @returns {Object[]} - An array of items.
 */
function parseUnionsItems(data) {
    let items = [];

    if (data != null && data.hasOwnProperty("Unions")) {
        data.Unions.forEach((union, index) => {
            let unionType = "Undefined union type";

            if (union.hasOwnProperty("unionType")) {
                unionType = union.unionType.replace("_", " ").toLowerCase();
                unionType = unionType[0].toUpperCase() + unionType.slice(1);
            }

            items.push({
                id: index,
                name: {
                    primary: unionType,
                    secondary: union.hasOwnProperty("limitingDecision") ?
                        union.limitingDecision : "Undefined limiting decision",
                    toString() {
                        return this.primary + " " + this.secondary;
                    }
                },
                traits: {
                    "Accuracy of approximation": union.hasOwnProperty("accuracyOfApproximation") ?
                        union.accuracyOfApproximation : 0,
                    "Quality of approximation": union.hasOwnProperty("qualityOfApproximation") ?
                        union.qualityOfApproximation : 0,
                },
                toFilter() {
                    return [
                        this.name.toString().toLowerCase(),
                        ...Object.keys(this.traits).map(key => {
                            return key.toLowerCase() + " " + this.traits[key]
                        })
                    ];
                }
            });
        });
    }

    return items;
}

export default parseUnionsItems;
