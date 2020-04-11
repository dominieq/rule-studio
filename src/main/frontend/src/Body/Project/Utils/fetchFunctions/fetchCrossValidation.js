import { responseJson } from "./utilFunctions";

async function fetchCrossValidation(projectId, method, data, ignoreStatus) {
   const response = await fetch(`http://localhost:8080/projects/${projectId}/crossValidation`, {
       method: method,
       body: data,
   }).catch(error => {
       console.log(error);
       return null;
   });

   return await responseJson(response, ignoreStatus);
}

export default fetchCrossValidation;