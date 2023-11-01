// src/InputForm.js

import React from 'react';

const InputForm = () => {
  return (
    <div className="input-form">
      <input type="text" placeholder="Enter your OPENAI API Key" />
      <br />
      <input type="file" accept=".png, .jpg, .jpeg, .pdf" />
      <br />
      <button>Submit</button>
    </div>
  );
};

export default InputForm;
