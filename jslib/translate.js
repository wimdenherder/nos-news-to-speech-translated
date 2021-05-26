const {Translate} = require('@google-cloud/translate').v2;
const projectId = 'nos-reader'; // <-- REPLACE THIS!
process.env.GOOGLE_APPLICATION_CREDENTIALS = "nos-reader-6255792a8a4f.json"; // <-- REPLACE THIS!
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