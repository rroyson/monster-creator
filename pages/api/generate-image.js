const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function (req, res) {
  const animal = req.body.animal || ''
  const openai = new OpenAIApi(configuration)

  const response = await openai.createImage({
    prompt: animal,
    n: 2,
    size: '256x256',
  })

  res.status(200).json({ result: response.data.data[0].url })
}
