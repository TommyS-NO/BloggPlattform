const express = require("express");
const db = require("../Db/Db");
const { authenticateToken } = require("./userRoute");
const router = express.Router();

router.get("/posts", (req, res) => {
	db.all(
		`SELECT posts.id, title, content, datePosted, users.username 
        FROM posts JOIN users ON posts.userId = users.id`,
		(error, posts) => {
			if (error) {
				return res.status(500).json({
					message: "Feil ved henting av innlegg",
					error: error.message,
				});
			}
			res.json(posts);
		},
	);
});

router.get("/posts/:id", (req, res) => {
	const { id } = req.params;
	db.get(
		`SELECT posts.id, title, content, datePosted, users.username 
        FROM posts JOIN users ON posts.userId = users.id 
        WHERE posts.id = ?`,
		[id],
		(error, post) => {
			if (error) {
				return res.status(500).json({
					message: "Feil ved henting av innlegg",
					error: error.message,
				});
			}
			if (post) {
				res.json(post);
			} else {
				res.status(404).json({ message: "Innlegg ikke funnet" });
			}
		},
	);
});

router.post("/posts", authenticateToken, (req, res) => {
	const { title, content } = req.body;
	const { username } = req.user;

	db.get(
		"SELECT id FROM users WHERE username = ?",
		[username],
		(error, user) => {
			if (error) {
				return res.status(500).json({
					message: "Feil ved oppretting av innlegg",
					error: error.message,
				});
			}
			if (user) {
				const sql = `INSERT INTO posts (userId, title, content, datePosted) VALUES (?, ?, ?, datetime('now'))`;
				db.run(sql, [user.id, title, content], function (postError) {
					if (postError) {
						return res.status(500).json({
							message: "Feil ved oppretting av innlegg",
							error: postError.message,
						});
					}
					res
						.status(200)
						.json({ message: "Innlegg opprettet", postId: this.lastID });
				});
			} else {
				res.status(404).json({ message: "Bruker ikke funnet" });
			}
		},
	);
});

router.put("/posts/:id", authenticateToken, (req, res) => {
	const { id } = req.params;
	const { title, content } = req.body;
	const { username } = req.user;

	db.get("SELECT userId FROM posts WHERE id = ?", [id], (error, post) => {
		if (error) {
			return res.status(500).json({
				message: "Feil ved oppdatering av innlegg",
				error: error.message,
			});
		}
		if (post) {
			db.get(
				"SELECT id FROM users WHERE username = ?",
				[username],
				(userError, user) => {
					if (userError) {
						return res.status(500).json({
							message: "Feil ved oppdatering av innlegg",
							error: userError.message,
						});
					}
					if (user && post.userId === user.id) {
						const sql = "UPDATE posts SET title = ?, content = ? WHERE id = ?";
						db.run(sql, [title, content, id], (updateError) => {
							if (updateError) {
								return res.status(500).json({
									message: "Feil ved oppdatering av innlegg",
									error: updateError.message,
								});
							}
							res.status(200).json({ message: "Innlegg oppdatert" });
						});
					} else {
						res
							.status(403)
							.json({ message: "Ikke autorisert til å oppdatere innlegget" });
					}
				},
			);
		} else {
			res.status(404).json({ message: "Innlegg ikke funnet" });
		}
	});
});

router.delete("/posts/:id", authenticateToken, (req, res) => {
	const { id } = req.params;
	const { username } = req.user;

	db.get("SELECT userId FROM posts WHERE id = ?", [id], (error, post) => {
		if (error) {
			return res.status(500).json({
				message: "Feil ved sletting av innlegg",
				error: error.message,
			});
		}
		if (post) {
			db.get(
				"SELECT id FROM users WHERE username = ?",
				[username],
				(userError, user) => {
					if (userError) {
						return res.status(500).json({
							message: "Feil ved sletting av innlegg",
							error: userError.message,
						});
					}
					if (user && post.userId === user.id) {
						const sql = "DELETE FROM posts WHERE id = ?";
						db.run(sql, [id], (deleteError) => {
							if (deleteError) {
								return res.status(500).json({
									message: "Feil ved sletting av innlegg",
									error: deleteError.message,
								});
							}
							res.status(200).json({ message: "Innlegg slettet" });
						});
					} else {
						res
							.status(403)
							.json({ message: "Ikke autorisert til å slette innlegget" });
					}
				},
			);
		} else {
			res.status(404).json({ message: "Innlegg ikke funnet" });
		}
	});
});

module.exports = router;
