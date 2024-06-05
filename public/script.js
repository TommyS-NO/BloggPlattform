const apiBaseUrl = "http://localhost:3000";

const fetchPosts = async () => {
	try {
		const response = await fetch(`${apiBaseUrl}/posts`);
		const posts = await response.json();
		const postsContainer = document.getElementById("posts");

		postsContainer.innerHTML = posts
			.map(
				(post) => `
            <div class="post" data-id="${post.id}">
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <small>By: ${post.username} on ${post.datePosted}</small>
                ${
									localStorage.getItem("username") === post.username
										? '<button class="delete-post">Delete</button>'
										: ""
								}
            </div>
        `,
			)
			.join("");

		// biome-ignore lint/complexity/noForEach: <explanation>
		document.querySelectorAll(".delete-post").forEach((button) => {
			button.addEventListener("click", deletePost);
		});
	} catch (error) {
		console.error("Error fetching posts:", error);
	}
};

// Register new user
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

// Log in existing user
document.getElementById("login-form").addEventListener("submit", async (e) => {
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
			document.getElementById("auth-container").style.display = "none";
			document.getElementById("post-container").style.display = "block";
			document.getElementById("logout-button").style.display = "block";
			fetchPosts();
			document.getElementById("login-form").reset();
		} else {
			alert(data.message);
		}
	} catch (error) {
		console.error("Error logging in:", error);
	}
});

// Log out user
document.getElementById("logout-button").addEventListener("click", () => {
	localStorage.removeItem("token");
	localStorage.removeItem("username");
	document.getElementById("auth-container").style.display = "flex";
	document.getElementById("login-container").style.display = "none";
	document.getElementById("post-container").style.display = "none";
	document.getElementById("logout-button").style.display = "none";
	document.getElementById("posts").innerHTML = "";
});

// Create new post
document.getElementById("post-form").addEventListener("submit", async (e) => {
	e.preventDefault();
	const title = document.getElementById("post-title").value;
	const content = document.getElementById("post-content").value;
	const token = localStorage.getItem("token");

	try {
		const response = await fetch(`${apiBaseUrl}/posts`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ title, content }),
		});
		const data = await response.json();
		alert(data.message);
		fetchPosts();
		document.getElementById("post-form").reset();
	} catch (error) {
		console.error("Error creating post:", error);
	}
});

// Delete a post
const deletePost = async (e) => {
	const postId = e.target.closest(".post").dataset.id;
	const token = localStorage.getItem("token");

	try {
		const response = await fetch(`${apiBaseUrl}/posts/${postId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();
		alert(data.message);
		fetchPosts();
	} catch (error) {
		console.error("Error deleting post:", error);
	}
};

// Show/hide forms based on button clicks
document.getElementById("register-button").addEventListener("click", () => {
	document.getElementById("auth-container").style.display = "flex";
	document.getElementById("register-container").style.display = "block";
	document.getElementById("login-container").style.display = "none";
});

document.getElementById("login-button").addEventListener("click", () => {
	document.getElementById("auth-container").style.display = "flex";
	document.getElementById("register-container").style.display = "none";
	document.getElementById("login-container").style.display = "block";
});

// Fetch posts on page load
document.addEventListener("DOMContentLoaded", fetchPosts);
