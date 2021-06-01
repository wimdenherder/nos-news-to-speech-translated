// @ts-nocheck
const NOS = require('./jslib/nos.js');
const CLI = require('./jslib/cli.js');
const { textToSpeech } = require('./jslib/text-to-speech.js');
const { readlineSync } = require('./jslib/readlineSync.js');
const { createDirIfNotExists } = require('./jslib/fs-functions');
const { translate } = require('./jslib/translate.js');

(async function main() {
  cliApp();
})();

// command-line interaction
async function cliApp() {
  let today = getDateToday();
  let pathForArticle = `/Users/wimdenherder/documents/programmeren/nodejs/nos/nos_mp3s/${today}/`

  c(`\n\n\nIn which language do you want to listen?
  
  use languagecodes like
  en for english
  nl for netherlands/dutch
  ru for russian
  it for italian
  es for espanyol
  ja for japanese\n`)
  var toLanguageCode = await readlineSync();
  const languageLib = {
    en: 'en-UK',
    ja: 'ja-JP',
    ru: 'ru-RU',
    it: 'it-IT',
    es: 'es-ES',
    nl: 'nl-be'
  }
  toLanguageCode = (toLanguageCode.indexOf('-') === -1 ? languageLib[toLanguageCode] || toLanguageCode + "-" + toLanguageCode.toUpperCase() : toLanguageCode )|| "nl-NL";
  
  while(true) {
    let articles = await NOS.getArticles();
    let overview = articles.map((article, index) => {
      return `${index+1}. ${article.title}`;
    }).join("\n") + '\n\nNow type in the number of the article and hit enter:\n';
    c(overview);
    var input = await readlineSync();
    var articleIndices = input.split(" ");
    if(!input || !/\d+/.test(input)) {
      c("Please enter a number");
    } else {
    articleIndices.forEach(async function process(articleIndex) {
        articleIndex = parseInt(articleIndex, 10);
        c(`Generating article '${articleIndex}' for you`);
        let chosenArticle = articles[articleIndex-1];
        let outputName = await createMp3Article(chosenArticle, pathForArticle, toLanguageCode);
      });
    }
  }
}

// to do: check if mp3 already exists
async function createMp3Article(article, pathForArticle, toLanguageCode) {
  await createDirIfNotExists(pathForArticle);
  const textArtickle = await NOS.getArticleText(article.link);
  const translatedTextArticle = await translate(textArtickle,toLanguageCode,"nl");
  console.log('translatedTextArticle', translatedTextArticle);
  const options = { 
    text: translatedTextArticle, 
    outputName: pathForArticle + article.title.replace(/\s+/g,"-") + '.mp3',
    languageCode: toLanguageCode,
    ssmlGender: 'MALE', 
    audioEncoding: 'MP3',
  }
  console.log('options', options);
  textToSpeech(options).then(() => {
    CLI.runCli(`open "${options.outputName.replace(/"/g,'\"')}"`);
  }); // async always
  return options.outputName;
}

function getDateToday() { 
  return `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
}

// console shortcut
function c(text) {
  console.log(text);
}