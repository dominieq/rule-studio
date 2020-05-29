function conjugateContent(number, base) {
    if (number === 1) {
        return number + ` ${base}`;
    } else {
        return number + ` ${base}s`;
    }
}

export default conjugateContent;
