async function fetchCrossValidation(projectId, method, data, ignoreStatus) {

   const response = await fetch(`http://localhost:8080/projects/${projectId}/crossValidation`, {
       method: method,
       body: data,
   }).catch(error => {
       console.log(error);
       return null;
   });

   if (response.status === 200) {
       return await response.json().catch(error => {
           console.log(error);
           return null;
       });
   } else {
       const result = await response.json().catch(error => {
           console.log(error);
           return null;
       });

       let msg = result.message;
       if (Array.isArray(ignoreStatus) && ignoreStatus.length) {
           if (!ignoreStatus.includes(result.status)) {
               throw {message: msg, open: true, severity: "warning"};
           }
       } else if (typeof ignoreStatus === 'number') {
           if (ignoreStatus !== result.status) {
               throw {message: msg, open: true, severity: "warning"};
           }
       }
   }
}

export default fetchCrossValidation;