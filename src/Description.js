// src/Description.js

import React from 'react';

const Description = () => {
  return (
    <div className="description">
      <h1>Resume Rater</h1>
      <p>Resume Rater is an app that will rate your resume on a scale of 10!</p>
      <h2>How it works?</h2>
      <p>
      This application leverages OCR (Optical Character Recognition) and AI to analyze resumes, providing tips and a rating for improvement. All processes are
        server-side and confidential.
      </p>
      <ol>
        <li>Upload an image/PDF of your resume</li>
        <li>Hit Submit and see your score!</li>
      </ol>
    </div>
  );
};

export default Description;
