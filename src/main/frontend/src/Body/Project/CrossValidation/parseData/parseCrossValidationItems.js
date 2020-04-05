function parseCrossValidationItems(fold, settings) {
    let items = [];
    if (fold && Object.keys(fold).length) {
        const { indexOption } = settings;
        for (let i = 0; i < fold.validationTable.objects.length; i++) {
            let name = "Object " + (i + 1);

            if (indexOption !== "default") {
                if (Object.keys(fold.validationTable.objects[i]).includes(indexOption)) {
                    name = fold.validationTable.objects[i][indexOption];
                }
            }

            items.push({
                id: i,
                name: name,
                traits: {
                    ...fold.validationTable,
                    ...fold.classificationValidationTable.classificationResults[i]
                },
                tables: {
                    indicesOfCoveringRules: fold.classificationValidationTable.indicesOfCoveringRules[i],
                },
            });
        }
    }
    return items;
}

export default parseCrossValidationItems