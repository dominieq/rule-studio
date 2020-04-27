function getItemName(index, objects, settings, defaultName = "Object") {
    let name = {
        primary: defaultName,
        secondary: index + 1,
        toString() {
            return this.primary + " " + this.secondary;
        }
    };

    if (settings && Object.keys(settings).includes("indexOption") && settings.indexOption !== "default") {
        if (Object.keys(objects[index]).includes(settings.indexOption)) {
            name = {
                secondary: objects[index][settings.indexOption],
                toString() {
                    return this.secondary;
                }
            };
        }
    }

    return name;
}

export default getItemName;
