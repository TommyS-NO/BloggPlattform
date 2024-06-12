document.addEventListener("DOMContentLoaded", () => {
	const apiBaseUrl = "http://localhost:3000";

	const fetchPosts = async () => {
		try {
			const response = await fetch(`${apiBaseUrl}/posts`);
			const posts = await response.json();
			const postsContainer = document.getElementById("posts");

			postsContainer.innerHTML = posts
				.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))
				.map(
					(post) => `
                <div class="post" data-id="${post.id}">
                    <h2>${post.title}</h2>
                    <p>${post.content}</p>
                    <small>By: ${post.username} on ${new Date(
											post.datePosted,
										).toLocaleString()}</small>
                    ${
											localStorage.getItem("username") === post.username
												? '<button class="delete-post">Delete</button>'
												: ""
										}
                </div>
            `,
				)
				.join("");

			const deleteButtons = document.querySelectorAll(".delete-post");
			for (const button of deleteButtons) {
				button.addEventListener("click", deletePost);
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
		}
	};

	document
		.getElementById("register-form")
		.addEventListener("submit", async (e) => {
			e.preventDefault();
			const username = document.getElementById("register-username").value;
			const email = document.getElementById("register-email").value;
			const password = document.getElementById("register-password").value;

			try {
				const response = await fetch(`${apiBaseUrl}/register`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, email, password }),
				});
				const data = await response.json();
				alert(data.message);
				if (data.message === "Bruker registrert") {
					document.getElementById("register-form").reset();
				}
			} catch (error) {
				console.error("Error registering user:", error);
			}
		});

	document
		.getElementById("login-form")
		.addEventListener("submit", async (e) => {
			e.preventDefault();
			const username = document.getElementById("login-username").value;
			const password = document.getElementById("login-password").value;

			try {
				const response = await fetch(`${apiBaseUrl}/login`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});
				const data = await response.json();
				if (data.token) {
					localStorage.setItem("token", data.token);
					localStorage.setItem("username", username);
					document.getElementById("auth-modal").style.display = "none";
					window.location.href = "userSite.html";
					document.getElementById("login-form").reset();
				} else {
					alert(data.message);
				}
			} catch (error) {
				console.error("Error logging in:", error);
			}
		});

	document.getElementById("register-link").addEventListener("click", (e) => {
		e.preventDefault();
		document.getElementById("register-container").style.display = "block";
		document.getElementById("login-container").style.display = "none";
	});

	document.getElementById("login-button").addEventListener("click", () => {
		document.getElementById("auth-modal").style.display = "flex";
		document.getElementById("register-container").style.display = "none";
		document.getElementById("login-container").style.display = "block";
	});

	const modal = document.getElementById("auth-modal");
	const closeButton = document.querySelector(".close-button");

	closeButton.addEventListener("click", () => {
		modal.style.display = "none";
	});

	window.addEventListener("click", (event) => {
		if (event.target === modal) {
			modal.style.display = "none";
		}
	});

	document.getElementById("search-input").addEventListener("input", (event) => {
		const searchTerm = event.target.value.toLowerCase();
		const posts = document.querySelectorAll(".post");
		for (const post of posts) {
			const title = post.querySelector("h2").textContent.toLowerCase();
			if (title.includes(searchTerm)) {
				post.style.display = "block";
			} else {
				post.style.display = "none";
			}
		}
	});

	fetchPosts();
});
