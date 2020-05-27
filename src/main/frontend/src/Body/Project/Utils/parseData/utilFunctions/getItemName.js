function getItemName(index, objects, settings, defaultName = "Object") {
    let name = {
        primary: defaultName,
        secondary: index + 1,
        toString() {
            return this.primary + " " + this.secondary;
        }
    };

    if (settings != null && objects != null && objects[index] != null) {
        if (settings.hasOwnProperty("indexOption") && settings.indexOption !== "default"
            && objects[index].hasOwnProperty(settings.indexOption)) {

            name = {
                secondary: objects[index][settings.indexOption],
                toString() {
                    return this.secondary;
                }
            };
        }
    } else {
        // TODO throw error
    }

    return name;
}

export default getItemName;
