import createFullCategories from "./createFullCategories";

function createCategories(categories, noneLabel = "none", noneValue = "") {
    return createFullCategories(categories, categories, noneLabel, noneValue);
}

export default createCategories;
