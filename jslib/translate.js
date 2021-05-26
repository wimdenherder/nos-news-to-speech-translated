const {Translate} = require('@google-cloud/translate').v2;
const projectId = 'project-id-4791922729342675509'; // <-- REPLACE THIS!
process.env.GOOGLE_APPLICATION_CREDENTIALS = "/usr/local/bin/webconfig/project-id-4791922729342675509-04962bca7446.json"; // <-- REPLACE THIS!
const translateApi = new Translate({projectId}); 

async function translate(text, targetLang, fromLang) {
  const options = {
    to: targetLang.split("-")[0],
    source: fromLang.split("-")[0],
  }
  const [translation] = await translateApi.translate(text, options);
  return translation;
}

exports.translate = translate;