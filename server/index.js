const express = require('express');
const multer = require('multer');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');

require('dotenv').config();

//initialize the client
const openai = new OpenAI({apiKey: `${process.env.OPENAI_GPT_KEY}`});

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

    // Call OpenAI GPT API for tips and rating (TODO)
    const response = await openai.chat.completions.create({
      messages: [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": `Your job is to rate resumes on a scale of 1-10, and provide tips to improve the essay. Return response in the following parsable JSON format:

        {
            "R": "Rating",
            "T": "Response"
        }`},

        {"role": "system", "content": "Ok, please provide the resume and I will be analyzing it. I will format my response in a parsable JSON format"},
        {"role": 'user', "content": `Extract tips and rating from the following text: ${extractedText}`}],
      model: 'gpt-3.5-turbo',
    });

    // Extract tips and rating from the OpenAI GPT API response (TODO)
    console.log(response.text);

    const gptTips = response.choices[0].text;

    console.log('GPT Tips:', gptTips);
    // Send the extracted text and tips as a response to the client
    res.status(200).json({ text: extractedText, tips: gptTips });
  } catch (error) {
    console.error('Error during OCR or GPT API request:', error);
    res.status(500).send('Error during OCR or GPT API request.');
  }
});