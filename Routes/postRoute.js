const express = require('express');
const db = require('../Db/Db');
const { verifyToken } = require('./userRoute');
const router = express.Router();

// Hent alle blogginnlegg
router.get('/posts', (req, res) => {
    db.all(`SELECT posts.id, title, content, datePosted, username 
            FROM posts JOIN users ON posts.userId = users.id`, (error, posts) => {
        if (error) {
            res.status(500).send('Feil ved henting av innlegg');
            return;
        }
        res.json(posts);
    });
});

// Hent et spesifikt blogginnlegg ved ID
router.get('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT posts.id, title, content, datePosted, username 
            FROM posts JOIN users ON posts.userId = users.id 
            WHERE posts.id = ?`, [id], (error, post) => {
        if (error) {
            res.status(500).send('Feil ved henting av innlegg');
            return;
        }
        if (post) {
            res.json(post);
        } else {
            res.status(404).send('Innlegg ikke funnet');
        }
    });
});

// Opprett et nytt blogginnlegg
router.post('/posts', verifyToken, (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;
    const sql = `INSERT INTO posts (userId, title, content, datePosted) VALUES (?, ?, ?, datetime('now'))`;
    db.run(sql, [userId, title, content], (error) => {
        if (error) {
            res.status(500).send('Feil ved oppretting av innlegg');
            return;
        }
        res.status(200).send('Innlegg opprettet');
    });
});

// Oppdater et blogginnlegg
router.put('/posts/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    db.get(`SELECT userId FROM posts WHERE id = ?`, [id], (error, post) => {
        if (error) {
            res.status(500).send('Feil ved oppdatering av innlegg');
            return;
        }
        if (post && post.userId === userId) {
            const sql = `UPDATE posts SET title = ?, content = ? WHERE id = ?`;
            db.run(sql, [title, content, id], (updateError) => {
                if (updateError) {
                    res.status(500).send('Feil ved oppdatering av innlegg');
                    return;
                }
                res.status(200).send('Innlegg oppdatert');
            });
        } else {
            res.status(403).send('Ikke autorisert til å oppdatere innlegget');
        }
    });
});

// Slett et blogginnlegg
router.delete('/posts/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    db.get(`SELECT userId FROM posts WHERE id = ?`, [id], (error, post) => {
        if (error) {
            res.status(500).send('Feil ved sletting av innlegg');
            return;
        }
        if (post && post.userId === userId) {
            const sql = `DELETE FROM posts WHERE id = ?`;
            db.run(sql, [id], (deleteError) => {
                if (deleteError) {
                    res.status(500).send('Feil ved sletting av innlegg');
                    return;
                }
                res.status(200).send('Innlegg slettet');
            });
        } else {
            res.status(403).send('Ikke autorisert til å slette innlegget');
        }
    });
});

module.exports = router;
