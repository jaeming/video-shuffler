const AWS = require('aws-sdk')
const youtubedl = require('youtube-dl')
const stream = require('stream')
const util = require('util')

async function perform (url) {
  const passtrough = new stream.PassThrough()

  const info = util.promisify(youtubedl.getInfo)

  const {title} = await info(url)

  const dl = youtubedl(url, ['--format=best[ext=mp4]'], { maxBuffer: Infinity })

  dl.pipe(passtrough)

  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: process.env.S3_BUCKET,
      Key: title,
      Body: passtrough,
    },
    partSize: 1024 * 1024 * 64, // 64 MB in bytes
    service: new AWS.S3({
      accessKeyId: process.env.S3_KEY_ID,
      secretAccessKey: process.env.S3_ACCESS_KEY,
    })
  })

  return new Promise((resolve, reject) => 
    upload.send((err, data) => err ? reject(err) : resolve(data)))
}

module.exports = { perform }