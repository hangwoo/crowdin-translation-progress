import core from "@actions/core";
import 'node-fetch';

try {
  const token = core.getInput('access_token');
  const languages = core.getInput('languages').split(',');
  const projectId = core.getInput('project_id');
  const targetProgress = core.getInput("target_progress");
  const data = await fetch(`https://api.crowdin.com/api/v2/projects/${projectId}/languages/progress`, {
    headers: {
      "content-type": "applications/json",
      "Authorization" : `Bearer ${token}`,
    }
  });
  const progress = languages.map(languageId => getProgress({ data, languageId }));
  progress.forEach((result, index) => {
    core.setOutput(`${languages[index]} progress`, result);
    if (Number(result) < Number(targetProgress)) {
      const err = new Error("Low progress");
      err.message = `Lower than target progress in languageId:${languages[index]}`;
      throw err;
    }
  });
} catch (error) {
  core.setFailed(error.message);
}

function getProgress({
  data,
  languageId,
}) {
  const dt = data.find(result => result.data.languageId === languageId);
  return dt.translationProgress;
}