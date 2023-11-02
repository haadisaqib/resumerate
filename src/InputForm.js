// src/InputForm.js

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const InputForm = () => {
  const [uploadCount, setUploadCount] = useState(3);

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

  const handleUpload = () => {
    const userUUID = localStorage.getItem('userUUID');
    const newUploadCount = uploadCount - 1;

    setUploadCount(newUploadCount);

    if (userUUID) {
      localStorage.setItem(`uploadCount_${userUUID}`, newUploadCount.toString());
    }

    if (newUploadCount === 0) {
      document.getElementById('submitBtn').disabled = true;
    }

    // TODO: Add logic to make the API call here
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
    </div>
  );
};

export default InputForm;
