const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../Db/Db');
const router = express.Router();

const saltRounds = 10;
const secretKey = 'gokstadakademiet';

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const sql = `INSERT INTO users (username, password, email, dateCreated) VALUES (?, ?, ?, datetime('now'))`;
        db.run(sql, [username, hashedPassword, email], function (error) {
            if (error) {
                res.status(500).send('Kunne ikke registrere bruker');
                return;
            }
            res.status(200).send('Bruker registrert');
        });
    } catch (error) {
        res.status(500).send('Serverfeil ved registrering');
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (error, user) => {
        if (error) {
            res.status(500).send('Feil ved innlogging');
            return;
        }
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '2h' });
                    res.json({ token: token });  // Sender token i responsens kropp
                } else {
                    res.status(401).send('Feil passord');
                }
            });
        } else {
            res.status(404).send('Bruker ikke funnet');
        }
    });
});

router.get('/logout', (req, res) => {
    res.status(200).send('Bruker logget ut');
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send('En token kreves for autentisering');
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Ugyldig token');
    }
    return next();
};

module.exports = { router, verifyToken };
