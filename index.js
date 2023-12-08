// importer requirements

const app = express();
const port = 3000; // MÅ IKKE ENDRES
const secretKey = 'gokstadakademiet'; // MÅ IKKE ENDRES

const corsOptions = {
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true,
}; // MÅ IKKE ENDRES! Tillater sending av cookies/autentiseringsopplysninger

app.use(cors(corsOptions)); // MÅ IKKE ENDRES
app.use(express.json()); // MÅ IKKE ENDRES
app.use(express.urlencoded({ extended: true })); // MÅ IKKE ENDRES

// Opprett databasefilen
let db = new sqlite3.Database('./database.db', (error) => {

})

// Lag en bruker
app.post('/register', (req, res) => {

})

// Login for bruker
app.post('/login', (req, res) => {

});

// Logout for bruker
app.post('/logout', (req, res) => {

});

// Hent alle poster inkludert username fra users
app.get('/posts', (req, res) => {

});

// Hent en post på ID
app.get('/posts/:id', (req, res) => {

})

// Opprett en post
app.post('/posts', (req, res) => {

});

// Oppdater post
app.put('/posts/:id', (req, res) => {

});

// Slett en post
app.delete('/posts/:id', (req, res) => {

});

// Start serveren
app.listen(port, () => {

})