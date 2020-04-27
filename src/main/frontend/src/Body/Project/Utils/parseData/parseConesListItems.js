function parseConesListItems(items) {
    let listItems = [];

    if (Array.isArray(items) && items.length) {
        for (let i = 0; i < items.length; i++) {
            listItems.push({
                id: items[i].id,
                header: items[i].name.toString(),
                subheader: undefined,
                content: undefined,
                multiContent: Object.keys(items[i].tables).map(key => {
                    return {
                        title: "Number of objects in " + key.toLowerCase(),
                        subtitle: items[i].tables[key].length
                    }
                })
            });
        }
    }

    return listItems;
}

export default parseConesListItems