//-------------------------//
//     Module Imports     //
//-----------------------//

const express = require('express');
const db = require('../Db/Db');
const { authenticateToken } = require('./userRoute');
const router = express.Router();

//-------------------------//
//     Fetch All Posts    //
//-----------------------//

router.get('/posts', (req, res) => {
    db.all(`SELECT posts.id, title, content, datePosted, users.username 
            FROM posts JOIN users ON posts.userId = users.id`, (error, posts) => {
        if (error) {
            res.status(500).json({ message: 'Feil ved henting av innlegg', error: error.message });
            return;
        }
        res.json(posts);
    });
});

//-------------------------//
// Fetch Post by ID       //
//-----------------------//

router.get('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT posts.id, title, content, datePosted, users.username 
            FROM posts JOIN users ON posts.userId = users.id 
            WHERE posts.id = ?`, [id], (error, post) => {
        if (error) {
            res.status(500).json({ message: 'Feil ved henting av innlegg', error: error.message });
            return;
        }
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Innlegg ikke funnet' });
        }
    });
});

//-------------------------//
//    Create New Post     //
//-----------------------//

router.post('/posts', authenticateToken, (req, res) => {
    const { title, content } = req.body;
    const username = req.user.username;

    db.get(`SELECT id FROM users WHERE username = ?`, [username], (error, user) => {
        if (error) {
            res.status(500).json({ message: 'Feil ved oppretting av innlegg', error: error.message });
            return;
        }
        if (user) {
            const sql = `INSERT INTO posts (userId, title, content, datePosted) VALUES (?, ?, ?, datetime('now'))`;
            db.run(sql, [user.id, title, content], function (postError) {
                if (postError) {
                    res.status(500).json({ message: 'Feil ved oppretting av innlegg', error: postError.message });
                    return;
                }
                res.status(200).json({ message: 'Innlegg opprettet', postId: this.lastID });
            });
        } else {
            res.status(404).json({ message: 'Bruker ikke funnet' });
        }
    });
});

//-------------------------//
//    Update a Post       //
//-----------------------//

router.put('/posts/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const username = req.user.username;

    db.get(`SELECT userId FROM posts WHERE id = ?`, [id], (error, post) => {
        if (error) {
            res.status(500).json({ message: 'Feil ved oppdatering av innlegg', error: error.message });
            return;
        }
        if (post) {
            db.get(`SELECT id FROM users WHERE username = ?`, [username], (userError, user) => {
                if (userError) {
                    res.status(500).json({ message: 'Feil ved oppdatering av innlegg', error: userError.message });
                    return;
                }
                if (user && post.userId === user.id) {
                    const sql = `UPDATE posts SET title = ?, content = ? WHERE id = ?`;
                    db.run(sql, [title, content, id], function (updateError) {
                        if (updateError) {
                            res.status(500).json({ message: 'Feil ved oppdatering av innlegg', error: updateError.message });
                            return;
                        }
                        res.status(200).json({ message: 'Innlegg oppdatert' });
                    });
                } else {
                    res.status(403).json({ message: 'Ikke autorisert til å oppdatere innlegget' });
                }
            });
        } else {
            res.status(404).json({ message: 'Innlegg ikke funnet' });
        }
    });
});

//-------------------------//
//    Delete a Post       //
//-----------------------//

router.delete('/posts/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const username = req.user.username;

    db.get(`SELECT userId FROM posts WHERE id = ?`, [id], (error, post) => {
        if (error) {
            res.status(500).json({ message: 'Feil ved sletting av innlegg', error: error.message });
            return;
        }
        if (post) {
            db.get(`SELECT id FROM users WHERE username = ?`, [username], (userError, user) => {
                if (userError) {
                    res.status(500).json({ message: 'Feil ved sletting av innlegg', error: userError.message });
                    return;
                }
                if (user && post.userId === user.id) {
                    const sql = `DELETE FROM posts WHERE id = ?`;
                    db.run(sql, [id], function (deleteError) {
                        if (deleteError) {
                            res.status(500).json({ message: 'Feil ved sletting av innlegg', error: deleteError.message });
                            return;
                        }
                        res.status(200).json({ message: 'Innlegg slettet' });
                    });
                } else {
                    res.status(403).json({ message: 'Ikke autorisert til å slette innlegget' });
                }
            });
        } else {
            res.status(404).json({ message: 'Innlegg ikke funnet' });
        }
    });
});

//-------------------------//
//    Module Export       //
//-----------------------//

module.exports = router;