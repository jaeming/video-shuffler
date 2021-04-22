const express = require('express')
const Uploader = require('./upload')

const app = express()
const port = process.env.PORT || 3000

app.get('/save', async (req, res) => {
  const upload = await Uploader.perform(req.query.url)
  console.log('upload complete?')
  console.log(upload)
  res.json({msg: upload})
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
