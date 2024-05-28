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
  const [reportId, setReportId] = useState(0);

  // Genrate a lighthouse report for the given URL
  const postData = async () => {
    if (!url) {
      setError("URL is required");
      return;
    }
    setLoading(true);
    setError('');
    setArtifact('');
    try {
      const response = await axios.post("/api/lighthouse", {
        url,
        emulatedForm
      });
      setUrl('');
      setEmulatedForm("mobile");
      console.log('data == ', response.data);
      setArtifact(response.data.reportPath);
      setReportId(response.data.reportId);
    } catch (error) {
      setArtifact('');
      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (event) => {
    // console.log('event.target.checked == ', event.target.value);
    const newValue = event.target.value;
    setEmulatedForm(newValue);
  };

  // Share the report in email
  const handleShareByEmail =  async () => {
    if (!reportId) {
      setError("No report available to share");
      return;
    }

    try {
        const response = await axios.post(`/api/share/${reportId}`);

        const subject = `Audit Report for ${response.data.url}`;
        const body = `Hello, \n\nI have generated a lighthouse report for the website ${response.data.url} using the void-audit-tool under a ${response.data.emulatedForm} device.\n\nPlease find the report attached. \n\n `;
        const link = response.data.reportPath;
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}\n\nHere is the link : ${encodeURIComponent(link)}`;
        
        window.open(mailtoLink);
    } catch (error) {
        setError("Failed to fetch report content");
        console.error(error);
    }
  };


  return (
   
    <div className="flex flex-col items-center h-screen p-4">
      <div className="w-full mb-8">
        <h2 className="text-2xl font-bold text-center">Void Audit Tool</h2>
      </div>
      <div className="flex justify-center w-full">
          <select
              className="mr-2 bg-blue-200 rounded-md p-2 text-black "
              value={emulatedForm}
              onChange={handleCheckboxChange}
            >
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
          </select>
          <input
            type="text"
            placeholder="https://www.void.fr/fr"
            className="border p-2 rounded-md text-black w-1/2 invalid:outline-2 invalid:outline-red-400"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if(e.key == "Enter"){
                postData()
              }
            }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md ml-4"
            onClick={postData}
          >
            Start Audit
          </button>
      </div>
      {error && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-md my-4 mx-auto max-w-full text-center break-words">
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

      <div className="w-4/5 h-3/4  mt-4 mx-auto">
        {
        artifact && 
          <>
            <div className="w-full h-full border-none">
              <iframe src={artifact} title="report-lighthouse" className="w-full h-full border-none" />
            </div>
            <div className="flex justify-center">
              <button 
                className="bg-blue-500 text-white mt-4 px-4 py-2 rounded-md ml-4" 
                onClick={handleShareByEmail}
                >
                Share
              </button>
            </div>
          </>
        }

      </div>
      
    </div>


  );
}

// 'use client';

// import { useState, useRef } from "react";
// import { RotatingLines } from 'react-loader-spinner';
// import axios from "axios";

// export default function Home() {
//   const [url, setUrl] = useState("");
//   const [emulatedForm, setEmulatedForm] = useState("mobile");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [stage, setStage] = useState("");
//   const [screenshotPath, setScreenshotPath] = useState("");
//   const [reportPath, setReportPath] = useState("");

//   const performAudit = async () => {
//     setLoading(true);
//     setError('');
//     setStage('Checking URL');

//     // First API call: Check URL validity and existence
//     try {
//         let response = await axios.post('/api/validateUrl', { url });
//         console.log('response == ', response);
        
//         if (response.status !== 200) throw new Error(response.data.error);
//         console.log('response DATA  == ', response.data);
//         setUrl(response.data.url);
//         console.log('url after validation: ', url);
//         setStage('Capturing Screenshot');
//         // Second API call: Capture screenshot
//         response = await axios.post('/api/captureScreen', { url });
//         if (response.status !== 200) throw new Error(response.data.error);
//         setScreenshotPath(response.data.screenshotPath);
        
//         setStage('Generating Report');
//         // Third API call: Generate Lighthouse report
//         response = await axios.post('/api/lighthouse', { url, emulatedForm });
//         if (response.status !== 200) throw new Error(response.data.error);
//         setReportPath(response.data.reportPath);

//         setStage('Completed');
//     } catch (error) {
//         setError(error.toString());
//         setStage('');
//     } finally {
//         setLoading(false);
//     }
// };

//   return (
//     <div className="flex flex-col items-center h-screen p-4">
//         <input
//             type="text"
//             placeholder="https://www.example.com"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//             className="border p-2 rounded-md text-black w-1/2"
//         />
//         <button onClick={performAudit} className="bg-blue-500 text-white px-4 py-2 rounded-md ml-4">
//             Start Audit
//         </button>

//         {loading && <p>Loading: {stage}</p>}
//         {error && <div className="text-red-500">{error}</div>}
//         {screenshotPath && <img src={screenshotPath} alt="Website Screenshot" />}
//         {reportPath && <iframe src={reportPath} title="Lighthouse Report" className="w-full h-full border-none"></iframe>}
//     </div>
//   );

// }
