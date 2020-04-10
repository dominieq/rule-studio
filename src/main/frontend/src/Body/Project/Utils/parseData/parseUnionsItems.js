function parseUnionsItems(data) {
    let items = [];

    if (data) {
        let counter = 0;
        for (let type of ["downwardUnions", "upwardUnions"]) {
            for (let i = 0; i < data[type].length; i++) {
                let id = counter;

                let unionType = data[type][i].unionType.replace("_", " ").toLowerCase();
                unionType = unionType[0].toUpperCase() + unionType.slice(1);

                let name = {
                    primary: unionType,
                    secondary: data[type][i].limitingDecision,
                    toString() {
                        return this.primary + " " + this.secondary;
                    }
                };

                const traits = {
                    "Accuracy of approximation": data[type][i].accuracyOfApproximation,
                    "Quality of approximation": data[type][i].qualityOfApproximation,
                };

                const tables = Object.keys(data[type][i]).map(key => {
                    if (Array.isArray(data[type][i][key])) {
                        return {
                            [key]: data[type][i][key]
                        };
                    }
                }).reduce((previousValue, currentValue) => {
                    return {...previousValue, ...currentValue};
                });

                items.push({
                    id: id,
                    name: name,
                    traits: traits,
                    tables: tables
                });
                counter++;
            }
        }
    }

    return items;
}

export default parseUnionsItems;