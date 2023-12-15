//-------------------------//
//     Module Imports     //
//-----------------------//

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../Db/Db');
const router = express.Router();


//-------------------------//
//     Salt Rounds for    //
//     Password Hashing  //
//----------------------//

const saltRounds = 10;

//-------------------------//
//     Secret Key for     //
//     JWT Token         //
//----------------------//

const secretKey = 'gokstadakademiet';

//-------------------------//
//     User Registration  //
//-----------------------//

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    
    const userExistsQuery = `SELECT id FROM users WHERE username = ? OR email = ?`;
    db.get(userExistsQuery, [username, email], async (userError, existingUser) => {
        if (userError) {
            res.status(500).json({ message: 'Feil ved sjekking av bruker', error: userError.message });
            return;
        }

        if (existingUser) {
            res.status(409).json({ message: 'Brukernavn eller e-post allerede i bruk' });
            return;
        }

        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const insertUserQuery = `INSERT INTO users (username, password, email, dateCreated) VALUES (?, ?, ?, datetime('now'))`;
            db.run(insertUserQuery, [username, hashedPassword, email], function (insertError) {
                if (insertError) {
                    res.status(500).json({ message: 'Kunne ikke registrere bruker', error: insertError.message });
                } else {
                    res.status(200).json({ message: 'Bruker registrert', username: username });
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Serverfeil ved registrering', error: error.message });
        }
    });
});



//-------------------------//
//     User Login         //
//-----------------------//

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (error, user) => {
        if (error) {
            res.status(500).json({ message: 'Feil ved innlogging', error: error.message });
            return;
        }
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = jwt.sign({ username: username }, secretKey, { expiresIn: '1h' });

                res.cookie('token', token, { httpOnly: false, secure: false, maxAge: 3600000 });
                res.json({ message: "Innlogging vellykket!", token: token });
            } else {
                res.status(401).json({ message: 'Feil passord' });
            }
        } else {
            res.status(404).json({ message: 'Bruker ikke funnet' });
        }
    });
});

//-------------------------//
//     Token Verification //
//     Middleware         //
//-----------------------//

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
  
    const [bearer, token] = authHeader.split(' ');
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token." });
      }
      req.user = user;
      next();
    });
  }
  
//-------------------------//
//     Module Export      //
//-----------------------//

module.exports = { router, authenticateToken };