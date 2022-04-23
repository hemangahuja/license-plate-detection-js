import type { NextPage } from 'next'
import { useState } from 'react'

const Home: NextPage = () => {
  const [image, setImage] = useState<string | Blob>('')
  const [displayImage, setDisplayImage] = useState('')
  const [results, setResults] = useState<any>('')

  const getPlateData = async () => {
    let body = new FormData()
    body.append('upload', image)
    body.append('region', 'in')
    const response = await fetch(
      'https://api.platerecognizer.com/v1/plate-reader/',
      {
        method: 'POST',
        headers: {
          Authorization: 'Token ' + process.env.NEXT_PUBLIC_PLATE_API_TOKEN,
        },
        body,
      }
    )
    const data = await response.json()
    setResults(data)
  }
  return (
    <>
      <div className="flex h-full flex-col items-center justify-center bg-blue-50 p-5">
        <div className="flex">
          <label className="text-blue w-34 flex cursor-pointer flex-col items-center rounded-lg border border-blue-200 bg-white px-4 py-6 uppercase tracking-wide shadow-lg hover:bg-blue-500 hover:text-white">
            <svg
              className="h-8 w-8"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="mt-2 text-base leading-normal">Select a file</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                e.target.files && setImage(e.target.files[0])
                e.target.files &&
                  e.target.files[0] &&
                  setDisplayImage(URL.createObjectURL(e.target.files[0]))
              }}
            />
          </label>
        </div>
        <input
          type="submit"
          onClick={getPlateData}
          className="rounded-2 m-2 flex w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-blue-200 bg-white p-2  shadow-lg hover:bg-blue-500 hover:text-white"
        />
        <img
          width={400}
          height={300}
          src={displayImage}
          alt="preview"
          className="m-4 rounded-xl shadow-2xl"
        />
        {results &&
          results.results.map((result: any, index: number) => (
            <div
              key={index}
              className="m-5 ml-12 flex flex-col items-center justify-center text-2xl"
            >
              Max Confidence : {result.plate.toUpperCase()}
              {result.candidates.map((candidate: any, index: number) => {
                return (
                  <div key={index} className="m-2">
                    Plate : {candidate.plate.toUpperCase()} Score :{' '}
                    {(candidate.score * 100).toFixed(2)}%
                  </div>
                )
              })}
              Vehicle Type : {result.vehicle.type}, with Confidence :{' '}
              {(result.vehicle.score * 100).toFixed(2)}%
            </div>
          ))}
      </div>
    </>
  )
}

export default Home
