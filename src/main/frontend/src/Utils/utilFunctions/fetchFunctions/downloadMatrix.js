import { downloadFunction } from "./downloadFunction";

async function downloadMatrix(base, projectId, data ) {
    let link = `${base}/projects/${projectId}/misclassificationMatrix/download`;

    if (data) {
        if (Object.keys(data).includes("typeOfMatrix")) {
            link = link + `?typeOfMatrix=${data.typeOfMatrix}`;
        }
        if (Object.keys(data).includes("numberOfFold")) {
            link = link + `&numberOfFold=${data.numberOfFold}`;
        }
    }

    await downloadFunction(link);
}

export default downloadMatrix;
