const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const axios = require('axios');
const pdfParse = require('pdf-parse');

require('dotenv').config();

const app = express();
const PORT = 8080;

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
app.use(cors());

// POST endpoint for handling file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    let extractedText;

    // Check file type
    if (file.mimetype.includes('pdf')) {
      // Use pdf-parse for PDF files
      const data = await pdfParse(file.buffer);
      extractedText = data.text;
    } else {
      // Use tesseract.js for other image types
      const { data: { text } } = await Tesseract.recognize(file.buffer, 'eng');
      extractedText = text;
    }

    // Log the extracted text
    console.log('Extracted Text:', extractedText);

    // Call OpenAI GPT API for tips and rating
    const gptApiResponse = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: "say apple", // add extractedText
      max_tokens: 150, // You may adjust this based on your response length requirements
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPEN_AI_GPT_KEY}`, 
        'Content-Type': 'application/json',
      },
    });

    // Extract tips and rating from the OpenAI GPT API response
    const { choices } = gptApiResponse.data;
    const gptTips = choices.map(choice => choice.text).join('\n');

    // Send the extracted text and tips as a response to the client
    res.status(200).json({ text: extractedText, tips: gptTips });
  } catch (error) {
    console.error('Error during OCR or GPT API request:', error);
    res.status(500).send('Error during OCR or GPT API request.');
  }
});
