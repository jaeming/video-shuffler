const folder = './public/'
const fs = require('fs')

const files = fs.readdirSync(folder).filter(i => i.includes('.mp4'))
fs.writeFileSync('./public/files.json', JSON.stringify(files))