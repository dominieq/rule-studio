function parseClassificationItems(data, settings) {
    let items = [];

    if (data && Object.keys(data).length) {
        for (let i = 0; i < data.classificationResults.length; i++) {
            let name = {
                primary: "Object",
                secondary: i + 1,
                toString() {
                    return this.primary + " " + this.secondary;
                }
            };

            if (Object.keys(settings).includes("indexOption") && settings.indexOption !== "default") {
                if (Object.keys(data.informationTable.objects[i]).includes(settings.indexOption)) {
                    name = {
                        secondary: data.informationTable.objects[i][settings.indexOption],
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
                    attributes: data.informationTable.attributes.slice(),
                    objects: data.informationTable.objects.slice(),
                    suggestedDecision: data.classificationResults[i].suggestedDecision
                },
                tables: {
                    indicesOfCoveringRules: data.indicesOfCoveringRules[i].slice()
                }
            });
        }
    }

    return items;
}

export default parseClassificationItems;