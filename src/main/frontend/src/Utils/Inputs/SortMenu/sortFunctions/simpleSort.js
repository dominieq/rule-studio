import compareValues from "./compareValues";

function simpleSort(objects, category, order) {
    if (Array.isArray(objects)) {
        return objects.slice().sort(compareValues(category, order));
    } else {
        return null;
    }
}

export default simpleSort;
