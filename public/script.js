document.addEventListener("DOMContentLoaded", () => {
	const apiBaseUrl = "http://localhost:3000";
	let likesData = {};

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
                    <div class="like-container">
                        <small>Likes: <span class="like-count">${likesData[post.id] || 0}</span></small>
                        <button class="like-post" data-id="${post.id}">
                            <span>Like</span> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.32-.158-.888.283-.95l4.898-.696L7.538.792c.197-.4.73-.4.927 0l2.184 4.327 4.898.696c.441.062.612.63.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>
                        </button>
                    </div>
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

			const likeButtons = document.querySelectorAll(".like-post");
			for (const button of likeButtons) {
				button.addEventListener("click", likePost);
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
		}
	};

	const likePost = (e) => {
		const postId = e.target.closest(".like-post").dataset.id;
		if (!likesData[postId]) {
			likesData[postId] = 0;
		}
		likesData[postId]++;
		const likeCountElement = e.target
			.closest(".post")
			.querySelector(".like-count");
		likeCountElement.textContent = likesData[postId];
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
					// Log the user in after successful registration
					const loginResponse = await fetch(`${apiBaseUrl}/login`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ username, password }),
					});
					const loginData = await loginResponse.json();
					if (loginData.token) {
						localStorage.setItem("token", loginData.token);
						localStorage.setItem("username", username);
						document.getElementById("auth-modal").style.display = "none";
						window.location.href = "userSite.html";
						document.getElementById("login-form").reset();
					} else {
						alert(loginData.message);
					}
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
				console.log("Login response:", data); // Debugging line
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
