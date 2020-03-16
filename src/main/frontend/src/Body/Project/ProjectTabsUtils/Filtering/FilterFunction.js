const filterFunction = (filterText, items) => {
    if (filterText === "") {
        return items;
    } else {
        let displayedItems = [];
        for (let i = 0; i < items.length; i++) {
            const object = {...items[i]};

            if (object.name.toString().includes(filterText)) {
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