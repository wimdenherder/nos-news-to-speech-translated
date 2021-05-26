const fs = require('fs');
const util = require('util');
const textToSpeechLib = require('@google-cloud/text-to-speech');
process.env.GOOGLE_APPLICATION_CREDENTIALS = "/usr/local/bin/webconfig/project-id-4791922729342675509-04962bca7446.json"; // <-- REPLACE THIS!

async function textToSpeech(options) {
  const { 
     text, 
     outputName, 
     languageCode, 
     ssmlGender = 'MALE', 
     audioEncoding = 'MP3'
    } 
    = options;
  
  if(!text || !outputName) throw "text and output should be assigned to options in textToSpeech function"

  const client = new textToSpeechLib.TextToSpeechClient();

  let textMax4900Chars = text.slice(0,4900);
  /// to do: create multiple and concat

  const request = {
    input: {text: textMax4900Chars},
    voice: {languageCode, ssmlGender},
    audioConfig: {audioEncoding},
  };

  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(outputName, response.audioContent, 'binary');
  console.log(`Audio content written to file: ${outputName}`);
}

exports.textToSpeech = textToSpeech;