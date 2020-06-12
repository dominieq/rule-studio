import { downloadFunction } from "../downloadFunction";

async function exportProject(base, projectId, format) {
    const link = `${base}/projects/${projectId}/export?format=${format}`;

    await downloadFunction(link);
}

export default exportProject;
