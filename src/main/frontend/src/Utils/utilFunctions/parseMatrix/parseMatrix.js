const exclude = ["value", "Deviation of value"];

function parseMatrix(matrixObject) {
     let details = {};

     if (matrixObject && Object.keys(matrixObject).length) {
         details = {
             ...details,
             value: matrixObject.value,
             deviation: matrixObject["Deviation of value"],
             traits: Object.keys(matrixObject).map(key => {
                 if (!exclude.includes(key) && !Array.isArray(matrixObject[key])) {
                     return {
                         [key]: matrixObject[key]
                     };
                 } else {
                     return {};
                 }
             }).reduce((previousValue, currentValue) => {
                 return {...previousValue, ...currentValue};
             }),
             tables: Object.keys(matrixObject).map(key => {
                 if (!exclude.includes(key) && Array.isArray(matrixObject[key])) {
                     return {
                         [key]: matrixObject[key]
                     };
                 } else {
                     return {};
                 }
             }).reduce((previousValue, currentValue) => {
                 return {...previousValue, ...currentValue};
             })
         };
     }

     return details;
}

export default parseMatrix;
