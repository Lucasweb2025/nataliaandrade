import sharp from 'sharp'

const input = '../logosemfundo.png'
const output = './public/logo.png'

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const threshold = 240

for (let i = 0; i < data.length; i += channels) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  if (r >= threshold && g >= threshold && b >= threshold) {
    data[i + 3] = 0
  }
}

await sharp(data, { raw: { width, height, channels } })
  .png()
  .toFile(output)

console.log('Done - white background removed')
