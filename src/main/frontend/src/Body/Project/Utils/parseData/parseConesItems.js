function parseConesItems(data, objects, settings) {
    let items = [];

    if (data && Object.keys(data).length) {
        for (let i = 0; i < data.numberOfObjects; i++) {
            let id = i;

            let name = {
                primary: "Object",
                secondary: i + 1,
                toString() {
                    return this.primary + " " + this.secondary;
                }
            };

            if (Object.keys(settings).includes("indexOption") && settings.indexOption !== "default") {
                if (Object.keys(objects[i]).includes(settings.indexOption)) {
                    name = {
                        secondary: objects[i][settings.indexOption],
                        toString() {
                            return this.secondary;
                        }
                    };
                }
            }

            let tables = Object.keys(data).map(key => {
                if (key !== "numberOfObjects") {
                    return {
                        [key]: data[key][i].slice()
                    }
                }
            }).reduce((previous, current) => {
                return {...previous, ...current}
            });

            items.push({
                id: id,
                name: name,
                tables: tables
            });
        }
    }

    return items;
}

export default parseConesItems;