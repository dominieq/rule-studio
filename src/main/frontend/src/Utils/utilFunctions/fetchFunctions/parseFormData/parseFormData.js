function parseFormData(parameters, files) {
    let data = new FormData();

    if (parameters && Object.keys(parameters).length) {
        Object.keys(parameters).map(key => data.append(key, parameters[key]));
    }

    if (files && Object.keys(files).length) {
        Object.keys(files).map(key => data.append(key, files[key]));
    }

    return data;
}

export default parseFormData;
