import { responseJson } from "./utilFunctions";

async function fetchCrossValidation(projectId, method, data) {
   const response = await fetch(`http://localhost:8080/projects/${projectId}/crossValidation`, {
       method: method,
       body: data,
   }).catch(error => {
       throw { message: "Server not responding", open: true, severity: "error" };
   });

   return await responseJson(response);
}

export default fetchCrossValidation;