const https = require('https');
const { parse } = require('node-html-parser');

async function linkPreview(url) {
  let html = await httpget(url);
  if (html === '') {
    return undefined;
  }
  const root = parse(html);
  const ogImage = getOgImage(root);
  return ogImage;
}

function httpget(url) {
  const promise = new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      }
    }, (res) => {
      let data = '';
      res.setEncoding('utf8');

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(data);
        }
      })
    }).on('error', () => resolve(''));
  });
  return promise;
}

function getOgImage(root) {
  const ogImage = root.querySelector('meta[property="og:image"]');
  if (ogImage === null) {
    return undefined;
  }
  return ogImage.getAttribute('content');
}

module.exports = {
  linkPreview: linkPreview,
}
