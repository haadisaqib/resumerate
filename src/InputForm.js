import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ServerResponseModal from './ServerResponseModal';

const InputForm = () => {
  const [uploadCount, setUploadCount] = useState(3);
  const [serverResponse, setServerResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let userUUID = localStorage.getItem('userUUID');

    if (!userUUID) {
      userUUID = uuidv4();
      localStorage.setItem('userUUID', userUUID);
      localStorage.setItem(`uploadCount_${userUUID}`, '3');
    } else {
      const savedUploadCount = localStorage.getItem(`uploadCount_${userUUID}`);
      if (savedUploadCount) {
        setUploadCount(parseInt(savedUploadCount, 10));
      }
    }

    if (parseInt(uploadCount, 10) === 0) {
      document.getElementById('submitBtn').disabled = true;
    }
  }, [uploadCount]);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleUpload = async () => {
    const userUUID = localStorage.getItem('userUUID');
    const newUploadCount = uploadCount - 1;

    setUploadCount(newUploadCount);

    if (userUUID) {
      localStorage.setItem(`uploadCount_${userUUID}`, newUploadCount.toString());
    }

    if (newUploadCount === 0) {
      document.getElementById('submitBtn').disabled = true;
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]');
    formData.append('file', fileInput.files[0]);

    try {
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData,
        headers: {
          // Add any necessary headers here (e.g., authorization token)
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      // Parse the JSON response from the server
      const jsonResponse = await response.json();

      // Extract tips from the OpenAI GPT API response
      const tipsResponse = jsonResponse.tips.message.content;
      const tipsObject = JSON.parse(tipsResponse.substring(tipsResponse.indexOf('{')));

      // Handle both cases where "T" is a string or an array
      const tipsArray = Array.isArray(tipsObject.T) ? tipsObject.T : [tipsObject.T];

      // Update the state with the extracted tips
      setServerResponse({
        text: jsonResponse.text,
        tips: tipsArray,
        rating: tipsObject.R,
      });

      // Show the modal with the server response
      handleShowModal();

      // Handle successful response here
      console.log('File uploaded successfully');
    } catch (error) {
      // Handle errors here
      console.error('Error uploading file:', error.message);
    }
  };


  return (
    <div className="input-form">
      <br />
      <input type="file" accept=".png, .jpg, .jpeg, .pdf" />
      <br />
      <p>You have {uploadCount} submits left.</p>
      <button id="submitBtn" onClick={handleUpload} disabled={uploadCount === 0}>
        Submit
      </button>

      {/* Display the server response in the modal */}
      <ServerResponseModal
        show={showModal}
        handleClose={handleCloseModal}
        rating={serverResponse?.rating}
        tips={serverResponse?.tips}
      />
    </div>
  );
};

export default InputForm;
