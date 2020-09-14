/**
 * Conjugates a provided word based on a provided number.
 *
 * @category Utils
 * @subcategory Functions
 * @param {number} number - Used to conjugate word.
 * @param {string} base - A word that will be conjugated.
 * @returns {string} - Conjugated word.
 */
function conjugateContent(number, base) {
    if (number === 1) {
        return number + ` ${base}`;
    } else {
        return number + ` ${base}s`;
    }
}

export default conjugateContent;
