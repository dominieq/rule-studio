const getAppropriateSign = (object1, object2, attribute) => {

    if (Object.keys(attribute).includes("preferenceType")){
        switch(attribute.preferenceType) {
            case "gain":
                if (object1[attribute.name] > object2[attribute.name]) {
                    return "\u2ab0"; // >= \u227B >
                }
                else if (object1[attribute.name] < object2[attribute.name]) {
                    return "\u2aaf"; // <= \u227A <
                }
                else {
                    return "=";
                }
            case "cost":
                if(object1[attribute.name] > object2[attribute.name]) {
                    return "\u2aaf";
                }
                else if (object1[attribute.name] < object2[attribute.name]) {
                    return "\u2ab0";
                }
                else {
                    return "=";
                }
            default:
                return "incomparable";
        }
    } else {
        return "incomparable"
    }
};

export default getAppropriateSign