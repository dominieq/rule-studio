function createFullCategories(labels, values) {
    if (labels.length === values.length) {
        let categories = [];

        for (let i = 0; i < values.length; i++) {
            categories.push({
                label: labels[i].toLowerCase(),
                value: values[i]
            });
        }

        categories.unshift({
            label: "none (original order)",
            value: ""
        });

        return categories;
    } else {
        return [];
    }
}

export default createFullCategories;
