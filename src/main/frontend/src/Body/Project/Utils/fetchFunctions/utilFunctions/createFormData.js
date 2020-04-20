function createFormData(parameters, project) {
    let data = new FormData();

    Object.keys(parameters).map(key => {
        data.append(key, parameters[key])
    });

    if (!project.dataUpToDate) {
        data.append("metadata", JSON.stringify(project.result.informationTable.attributes));
        data.append("data", JSON.stringify(project.result.informationTable.objects));
    }

    return data;
}

export default createFormData;