const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// CORS-konfigurasjon
const corsOptions = {
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true,
};
app.use(cors(corsOptions));

// Parse JSON og URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importer og monter ruter
const userRoutes = require('./Routes/userRoute').router;
const postRoutes = require('./Routes/postRoute');
app.use('/', userRoutes);
app.use('/', postRoutes);

// Start serveren
app.listen(port, () => {
    console.log('Serveren kjører på port ' + port);
});
