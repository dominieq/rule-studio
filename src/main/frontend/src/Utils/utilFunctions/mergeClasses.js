import clsx from "clsx";

function mergerClasses(c1, c2) {
    return {
        ...c1,
        ...Object.keys(c2).map(key => {
            if (Object.keys(c1).includes(key)) {
                return {[key]: clsx(c1[key], c2[key])};
            } else {
                return {...c2[key]};
            }
        }).reduce((previousValue, currentValue) => {
            return { ...previousValue, ...currentValue };
        })
    };
}

export default mergerClasses;