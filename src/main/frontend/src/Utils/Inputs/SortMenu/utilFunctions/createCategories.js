import createFullCategories from "./createFullCategories";

function createCategories(categories) {
    return createFullCategories(categories, categories);
}

export default createCategories;
