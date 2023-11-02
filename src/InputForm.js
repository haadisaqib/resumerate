// src/InputForm.js

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const InputForm = () => {
  const [uploadCount, setUploadCount] = useState(3);

  const handleUpload = () => {
    const userUUID = localStorage.getItem('userUUID');
    const newUploadCount = uploadCount - 1;

    setUploadCount(newUploadCount);

    if (userUUID) {
      localStorage.setItem(`uploadCount_${userUUID}`, newUploadCount.toString());
    }

    // TODO: Add logic to make the API call here
  };

  return (
    <div className="input-form">
      <br />
      <input type="file" accept=".png, .jpg, .jpeg, .pdf" />
      <br />
      <p>You have {uploadCount} submits left.</p>
      <button onClick={handleUpload} disabled={uploadCount === 0}>
        Submit
      </button>
    </div>
  );
};

export default InputForm;
