import { responseJson } from "./utilFunctions";

async function fetchCrossValidation(base, projectId, method, data) {
   const response = await fetch(`${base}/projects/${projectId}/crossValidation`, {
       method: method,
       body: data,
   }).catch(error => {
       throw { message: "Server not responding", open: true, severity: "error" };
   });

   return await responseJson(response);
}

export default fetchCrossValidation;