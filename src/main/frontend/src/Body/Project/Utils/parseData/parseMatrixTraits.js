const exclude = ["value", "Deviation of value"];

function parseMatrixTraits(matrixObject) {
     let details = {};
     if (matrixObject && Object.keys(matrixObject).length) {
         let traits = Object.keys(matrixObject).map(key => {
             if (!exclude.includes(key) && !Array.isArray(matrixObject[key])) {
                 return {
                     [key]: matrixObject[key]
                 };
             }
         }).reduce((previousValue, currentValue) => {
             return {...previousValue, ...currentValue};
         });

         let tables = Object.keys(matrixObject).map(key => {
             if (!exclude.includes(key) && Array.isArray(matrixObject[key])) {
                 return {
                     [key]: matrixObject[key]
                 };
             }
         }).reduce((previousValue, currentValue) => {
             return {...previousValue, ...currentValue};
         });

         details = {
             ...details,
             value: matrixObject.value,
             deviation: matrixObject["Deviation of value"],
             traits: traits,
             tables: tables
         };
     }
     return details;
}

export default parseMatrixTraits;