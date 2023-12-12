const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));

app.use(cors());

// POST endpoint for handling file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  // Access the uploaded file from req.file
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // Handle the file as needed (e.g., save to disk, process, etc.)
  // For demonstration purposes, log the file information
  console.log('File received:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  });

  // Send a response to the client
  res.status(200).send('File uploaded successfully.');
});
