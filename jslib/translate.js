const {Translate} = require('@google-cloud/translate').v2;
const projectId = 'nos-reader'; // <-- REPLACE THIS!
process.env.GOOGLE_APPLICATION_CREDENTIALS = "/Users/wimdenherder/Documents/Programmeren/Nodejs/credentials/ferrous-quest-315005-8944b095c723.json"; // <-- REPLACE THIS!
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