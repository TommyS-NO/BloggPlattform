const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000; // Portnummeret som serveren skal kjøre på

// CORS-konfigurasjon
const corsOptions = {
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true,
};
app.use(cors(corsOptions));

// Parse JSON og URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importer ruter
const userRoutes = require('./Routes/userRoute').router;
const postRoutes = require('./Routes/postRoute');

// Mount ruter
app.use('/', userRoutes);
app.use('/', postRoutes);

// Enkel rute for å bekrefte at serveren kjører
// app.get('/', (req, res) => {
//     res.send('Serveren FUNGERER ');
// });

// Start serveren
app.listen(port, () => {
    console.log('Serveren kjører på port ' + port);
});
