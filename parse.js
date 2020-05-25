const request = require('request')
const cheerio = require('cheerio')
const map = require('async/map')
const read = require('node-readability')

function processLink(link, callback) {
  read(link, (err, article, meta) => {
    if (err) {
      console.log("error", err)
      callback(err)
      return
    }
    callback(null, article)
  })
}


request('https://seths.blog/top-100/', {}, (err, res, body) => {
  if (err) throw err
  const $ = cheerio.load(body)
  var links = []
  $('#wrapper>div>h4>a').each(function (idx, elem) {
    links.push(elem.attribs.href);
  })

  // console.log is a bit lazy, but works well for this
  console.log('<!doctype html><html lang="en"><head>')
  console.log('<meta charset="utf-8">')
  console.log(`
<style type="text/css">
* {
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
body {
  padding: 32px;
}
</style>`)
  console.log('</head><body>')
  console.log('<h1>Seth\'s 100</h1>')

  map(links, processLink, (err, articles) => {
    articles.forEach((article, idx) => {
      console.log(`<h3>#${idx} - ${article.title}</h3><p>${article.content}</p>`)
    })
    console.log('</body></html>')
  })
})
