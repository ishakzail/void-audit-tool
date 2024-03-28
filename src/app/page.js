'use client';

import { useState } from "react";
import { RotatingLines } from 'react-loader-spinner';
import axios from "axios";

export default function Home() {
  const [url, setUrl] = useState("");
  const [emulatedForm, setEmulatedForm] = useState("mobile");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [artifact, setArtifact] = useState("");

  const postData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("/api/lighthouse", {
        url,
        emulatedForm
      });
      setUrl('');
      setEmulatedForm("mobile");
      setArtifact(response.data.reportPath);
    } catch (error) {
      setArtifact('');
      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (event) => {
    console.log('event.target.checked == ', event.target.value);
    const newValue = event.target.value;
    setEmulatedForm(newValue);
  };

  return (
   
    <div className="flex flex-col items-center h-screen p-4">
      <div className="w-full mb-8">
        <h2 className="text-2xl font-bold text-center">Void Audit Tool</h2>
      </div>

      <div className="flex flex-row justify-center w-full mb-4">
        <div className="flex items-center mr-4">
          <input
            type="radio"
            id="mobile"
            name="formFactor"
            value="mobile"
            checked={emulatedForm === "mobile"}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="mobile" className="text-sm text-black">Mobile</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="desktop"
            name="formFactor"
            value="desktop"
            checked={emulatedForm === "desktop"}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="desktop" className="text-sm text-black">Desktop</label>
        </div>
      </div>

      <div className="flex justify-center w-full mb-4">
        <input
          type="text"
          placeholder="https://www.void.fr/fr"
          className="border p-2 rounded-md text-black w-1/2"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md ml-4"
          onClick={postData}
        >
          Start Audit
        </button>
      </div>
      {error && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-md mb-4 mx-auto max-w-full text-center break-words">
            {error}
          </div>
      )}

      {loading && (
        <div className="mt-4">
          <RotatingLines
            visible={true}
            height="96"
            width="96"
            color="blue"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{ color: 'blue' }}
            wrapperClass="bg-color-blue"
          />
        </div>
      )}

      <div className="w-4/5 h-3/4 overflow-hidden mt-4 mx-auto">
        {artifact && <iframe src={artifact} title="report-lighthouse" className="w-full h-full border-none" />}
      </div>
    </div>


  );
}
