function getTitleConditions(conditions) {
    let titleConditions = [];

    for (let i = 0; i < conditions.length; i++) {
        if ( conditions.length > 1) {
            titleConditions.push({ ...conditions[i], brackets: true });

            if ( i + 1 < conditions.length) {
                titleConditions.push({ secondary: "\u2227" });
            }
        } else {
            titleConditions.push({ ...conditions[i], brackets: false });
        }
    }

    return titleConditions;
}

export default getTitleConditions;
