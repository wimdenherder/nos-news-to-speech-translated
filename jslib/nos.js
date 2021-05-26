const cheerio = require('cheerio');
const request = require('request');

async function getArticles() {
  const nosUrl = 'https://www.nos.nl';
  let html = await requestSync(nosUrl);
  const $ = cheerio.load(html);
  let links = [];
  $('.sc-1kyc94c-3').each(function(){
    if(!/artikel/i.test($(this).attr('href'))) return;
    let link = 'https://www.nos.nl' + $(this).attr('href');
    let infoPerArticleHtml = $(this).html();
    let $$ = cheerio.load(infoPerArticleHtml);
    console.log('getBody:'  + link + ' ' + getBody($$));
    let title = $$('.e48nto-2').text();
    let description = $$('.e48nto-3').text();
    links.push( {link, title, description} );
  });
  return links;
}

function getBody($) {
  return $('html *').contents().map(function() {
    return (this.type === 'text') ? $(this).text()+' ' : '';
  }).get().join('');
}

async function getArticleText(url) {
  let html = await requestSync(url);
  const $ = cheerio.load(html)
  return $('.text_3v_J6Y0G').text();

  // get body: $.html()

  let news = []; 
  document.querySelectorAll(".text_3v_J6Y0G").forEach(
    x=>news.push(x.innerHTML)
  ); 
  return news.join("\n\n");
}

async function requestSync(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, res, html) => {
      if (!error && res.statusCode === 200) {
        resolve(html);
      } else {
        console.error(error);
        reject(error);
      }
    });
  });
}

exports.getArticles = getArticles;
exports.getArticleText = getArticleText;