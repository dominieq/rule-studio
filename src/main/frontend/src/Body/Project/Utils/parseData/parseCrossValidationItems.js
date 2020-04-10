function parseCrossValidationItems(fold, settings) {
    let items = [];

    if (fold && Object.keys(fold).length) {
        for (let i = 0; i < fold.validationTable.objects.length; i++) {
            let name = {
                primary: "Object",
                secondary: i + 1,
                toString() {
                    return this.primary + " " + this.secondary;
                }
            };

            if (Object.keys(settings).includes("indexOption") && settings.indexOption !== "default") {
                if (Object.keys(fold.validationTable.objects[i]).includes(settings.indexOption)) {
                    name = {
                        secondary: fold.validationTable.objects[i][settings.indexOption],
                        toString() {
                            return this.secondary;
                        }
                    };
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