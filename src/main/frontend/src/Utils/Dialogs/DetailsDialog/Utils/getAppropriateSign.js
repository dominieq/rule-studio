/**
 * <h3>Overview</h3>
 * Returns appropriate relation symbol to compare values of attributes from two objects.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} object1 - The selected object with it's details displayed in {@link FullscreenDialog}.
 * @param {Object} object2 - An object from information table.
 * @param {Object} attribute - An attribute from information table.
 * @param {number} tableIndex - The index of dominance cone.
 * @returns {string} - Relation symbol.
 */
const getAppropriateSign = (object1, object2, attribute, tableIndex) => {
    if (attribute.type === "description" || Object.keys(attribute).includes("identifierType") || !attribute.active) {
        return "--";
    } else {
        if (object1[attribute.name] === object2[attribute.name] || object1[attribute.name] === "?" || object2[attribute.name] === "?") {
            return "=";
        }

        if (attribute.type !== "decision") {
            if(tableIndex === 0 || tableIndex === 2) return "\u227A";
            else return "\u227B";
        } else {
            switch(attribute.preferenceType) {
                case "gain":
                    if (attribute.valueType === "enumeration") {
                        const idx1 = attribute.domain.indexOf(object1[attribute.name]);
                        const idx2 = attribute.domain.indexOf(object2[attribute.name]);

                        if(idx1 > idx2) return "\u227B";
                        else return "\u227A";
                    } else {
                        if(Number(object1[attribute.name]) > Number(object2[attribute.name])) return "\u227B";                         
                        else return "\u227A";
                    }
                case "cost":
                    if (attribute.valueType === "enumeration") {
                        const idx1 = attribute.domain.indexOf(object1[attribute.name]);
                        const idx2 = attribute.domain.indexOf(object2[attribute.name]);

                        if(idx1 < idx2) return "\u227B";
                        else return "\u227A";
                    } else {
                        if (Number(object1[attribute.name]) < Number(object2[attribute.name])) return "\u227B";
                        else return "\u227A";
                    }
                case "none":
                    return "--";
                default:
                    return "";
            }
        }
    }    
};

export default getAppropriateSign
