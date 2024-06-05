const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 3000;

const corsOptions = {
	origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
	credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require("./Routes/userRoute").router;
const postRoutes = require("./Routes/postRoute");

app.use("/", userRoutes);
app.use("/", postRoutes);

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html on the root URL
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => console.log(`Server is running on ${port}`));
