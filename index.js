const core = require("@actions/core");
const fetch = require('node-fetch');

try {
  const token = core.getInput('access_token');
  const languages = core.getInput('languages').split(',');
  const projectId = core.getInput('project_id');
  const targetProgress = core.getInput("target_progress");
  fetch(`https://api.crowdin.com/api/v2/projects/${projectId}/languages/progress`, {
    headers: {
      "content-type": "applications/json",
      "Authorization" : `Bearer ${token}`,
    }
  }).then(responseToJson)
    .then(result => {
      if (result.error) {
        core.setFailed(result.error.message);
      }
      const data = result.data;
      const progress = languages.map(languageId => getProgress({ data, languageId }));

      progress.forEach((result, index) => {
        console.log(`${languages[index]} progress`, result);
        if (Number(result) < Number(targetProgress)) {
          console.log(`Language id: ${languages[index]}`);
          core.setFailed(`Lower than target progress(target: ${targetProgress}%, current: ${result}%)`);
        }
      });
    })
    .catch(err => {
    core.setFailed(err.message);
  });
} catch (error) {
  core.setFailed(error.message);
}

function getProgress({
  data,
  languageId,
}) {
  const dt = data.find(result => result.data.languageId === languageId);
  return dt.data.translationProgress;
}

function responseToJson(response) {
  return response.json().then(json => json);
}