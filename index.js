const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static folder for profile images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Prefix API routes or put them on root as per swagger
app.use('/', routes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    message: "Endpoint not found",
    data: null
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
