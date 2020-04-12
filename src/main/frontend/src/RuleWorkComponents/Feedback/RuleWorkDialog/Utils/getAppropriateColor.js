const getAppropriateColor = (attribute) => {
    let style = {
        color: "#000"
    };

    if (attribute.type === 'decision') {
        style = {
            ...style,
            fontWeight: 900,
            textTransform: "uppercase"
        }
    }

    if(attribute.active === false || attribute.identifierType !== undefined || attribute.type === "description" ) {
        return {
            ...style,
            backgroundColor: "#A0A0A0"
        };
    }
    else {
        if (attribute.preferenceType === "gain") {
            return {
                ...style,
                backgroundColor: "#228B22"
            };
        }
        else if (attribute.preferenceType === "cost") {
            return {
                ...style,
                backgroundColor: "#DC143C"
            };
        }
        else if (attribute.preferenceType === "none") {
            return {
                ...style,
                backgroundColor: "#3F51B5"
            };
        }
        else return {
            ...style,
            backgroundColor: "#A0A0A0"
        };
    }
};

export default getAppropriateColor;