const filterFunction = (filterText, items) => {
    if (filterText === "") {
        return items;
    } else {
        const filters = filterText.toString().toLowerCase().split(" ");

        let displayedItems = [];
        for (let i = 0; i < items.length; i++) {
            const object = {...items[i]};
            let objectName = object.name.toString().toLowerCase();

            let matchName, matchTraits = true;
            for (let j = 0; j < filters.length; j++) {
                if (!objectName.includes(filters[j])) {
                    matchName = false;
                    break
                }
            }
            if (matchName || matchTraits) {
                displayedItems = [...displayedItems, object];
            }
        }
        if (displayedItems.length > 0) {
            return displayedItems;
        } else {
            return null;
        }
    }
};

export default filterFunction;