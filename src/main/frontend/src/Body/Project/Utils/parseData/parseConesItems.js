import { getItemName } from "./utilFunctions";

function parseConesItems(data, objects, settings) {
    let items = [];

    if (data && Object.keys(data).length) {
        for (let i = 0; i < data.numberOfObjects; i++) {
            items.push({
                id: i,
                name: getItemName(i, objects, settings),
                tables: Object.keys(data).map(key => {
                    if (key !== "numberOfObjects") {
                        return {
                            [key]: data[key][i].slice()
                        }
                    }
                }).reduce((previous, current) => {
                    return {...previous, ...current}
                }),
                toFilter() {
                    return [
                        this.name.toString().toLowerCase(),
                        ...Object.keys(this.tables).map(key => {
                            return key.toLowerCase() + " " + this.tables[key].length
                        }),
                    ]
                }
            });
        }
    }

    return items;
}

export default parseConesItems;
