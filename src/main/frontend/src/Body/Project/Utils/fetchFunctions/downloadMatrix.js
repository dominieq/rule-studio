import { download } from "./utilFunctions";

async function downloadMatrix(projectId, data) {
    let link = `http://localhost:8080/projects/${projectId}/misclassificationMatrix/download`;
    if (data) {
        if (Object.keys(data).includes("typeOfMatrix")) {
            link = link + `?typeOfMatrix=${data.typeOfMatrix}`;
        }
        if (Object.keys(data).includes("numberOfFold")) {
            link = link + `&numberOfFold=${data.numberOfFold}`;
        }
    }

    await download(link);
}

export default downloadMatrix;