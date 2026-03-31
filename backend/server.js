require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const signalRoutes = require('./routes/signalRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/signals', signalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
