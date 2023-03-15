import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [animalInput, setAnimalInput] = useState('')
  const [text, setText] = useState()
  const [image, setImage] = useState()

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    try {
      const getText = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ animal: animalInput }),
      })
      const getImage = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ animal: animalInput }),
      })

      // Wait for both endpoints to complete
      const [textResponse, imageResponse] = await Promise.all([
        getText,
        getImage,
      ])

      if (!textResponse.ok) throw new Error(textResponse.statusText)
      if (!imageResponse.ok) throw new Error(imageResponse.statusText)

      // Get the JSON data from the responses
      const finalText = await textResponse.json()
      const finalImage = await imageResponse.json()

      setText(finalText.result)
      setImage(finalImage.result)

      setIsLoading(false)
      setAnimalInput('')
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <title>Monster Creator</title>
        <link rel='icon' href='/dog.png' />
      </Head>

      <div className='w-full h-screen text-gray-800 bg-gray-200'>
        <main className='flex flex-col items-center pt-14 '>
          <img src='/dog.png' className='w-70' />
          <h3 className='pt-4 pb-4 text-4xl font-medium leading-10 text-red-800'>
            Describe Your Monster
          </h3>
          <form className='flex flex-col w-1/4' onSubmit={onSubmit}>
            <input
              className='px-3 py-4 border border-gray-300 rounded shadow border-r-3 outline-gray-800'
              type='text'
              name='animal'
              placeholder='Type in your animal creation'
              value={animalInput}
              onChange={(e) => setAnimalInput(e.target.value)}
            />

            {isLoading ? (
              <input
                disabled
                className='w-full p-3 my-10 text-center text-white bg-teal-800 rounded dark:md:hover:bg-teal-600 text-bold '
                type=''
                value='Generating...'
              />
            ) : (
              <input
                className='w-full p-3 my-10 text-center text-white bg-teal-800 rounded dark:md:hover:bg-teal-600 text-bold'
                type='submit'
                value='Create the Legend'
              />
            )}
          </form>
          <div className='w-1/2 my-10 bold'>{text}</div>
          {image && (
            <img
              className='w-1/4 shadow-lg rounded-xl'
              src={image}
              alt='Generated animal'
            />
          )}
        </main>
      </div>
    </div>
  )
}
