const getAppropriateColor = (attribute) => {
    if(attribute.active === false || attribute.identifierType !== undefined || attribute.type === "description" ) {
        return { backgroundColor: "#A0A0A0" };
    }
    else {
        if (attribute.preferenceType === "gain") {
            return { backgroundColor: "#228B22" };
        }
        else if (attribute.preferenceType === "cost") {
            return { backgroundColor: "#DC143C" };
        }
        else if (attribute.preferenceType === "none") {
            return { backgroundColor: "#3F51B5" };
        }
        else return { backgroundColor: "#A0A0A0" }
    }
};

export default getAppropriateColor;