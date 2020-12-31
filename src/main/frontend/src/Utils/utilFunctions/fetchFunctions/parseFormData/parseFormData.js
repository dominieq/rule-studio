/**
 * <h3>Overview</h3>
 * Prepares FormData that will be included in the body of an API call.
 *
 * @category Utils
 * @subcategory Functions
 * @param {Object} parameters - The map of parameters to be appended to FormData.
 * @param {Object} files - The map of files to be appended to FormData.
 * @returns {FormData} - FormData with appended parameters and files.
 */
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
