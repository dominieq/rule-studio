import { downloadFunction } from "../downloadFunction";

async function exportProject(base, projectId) {
    const link = `${base}/projects/${projectId}/export`;

    await downloadFunction(link);
}

export default exportProject;
