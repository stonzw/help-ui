const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

const app_domain = 'situmo-dev.firebaseapp.com'

const OGP_IMG_WIDTH = 1200
const OGP_IMG_HEIGHT = 630

const func = functions.https.onRequest((req, res) => {
  const [, , docId] = req.path.split('/')
  return db.collection('help').doc(docId).get().then((snap) => {
    if (!snap) {
      res.status(404).end('404 Not Found')
      return
    }
    const help = snap ? snap.data() : {}
    const uname = help.owner || ''
    const imageURL = ''
    const html = createHtml(imageURL, docId)
    res.set('Cache-Control', 'public, max-age=600, s-maxage=600')
    res.status(200).end(html)
  }).catch((err) => {
    console.warn(err)
  })
})

const createHtml = (imageURL, docId) => {
  const SITEURL = `https://${app_domain}`
  const PAGEURL = `${SITEURL}/help/${docId}`
  const TITLE = 'hoge'
  const DESCRIPTION = 'hoge'
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>colorinco</title>
    <meta property="og:title" content="${TITLE}">
    <meta property="og:image" content="${imageURL}">
    <meta property="og:image:width" content="${OGP_IMG_WIDTH}">
    <meta property="og:image:height" content="${OGP_IMG_HEIGHT}">
    <meta property="og:description" content="${DESCRIPTION}">
    <meta property="og:url" content="${PAGEURL}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="hoge">
    <meta name="twitter:site" content="${SITEURL}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${TITLE}">
    <meta name="twitter:image" content="${imageURL}">
    <meta name="twitter:description" content="${DESCRIPTION}">
  </head>
  <body>
    <script type="text/javascript">window.location="/_help/${docId}";</script>
  </body>
</html>
`
}

exports.render_ogp = func
