document.addEventListener("DOMContentLoaded", () => {
	const apiBaseUrl = "http://localhost:3000";


	const token = localStorage.getItem("token");
	const username = localStorage.getItem("username");

	if (!token || !username) {
		window.location.href = "index.html";
	}

	const fetchUserPosts = async () => {
		try {
			const response = await fetch(`${apiBaseUrl}/posts`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const posts = await response.json();

			if (response.ok) {
				const postsContainer = document.getElementById("posts");
				postsContainer.innerHTML = posts
					.filter((post) => post.username === username)
					.map(
						(post) => `
                            <div class="post" data-id="${post.id}">
                                <h2 contenteditable="false">${post.title}</h2>
                                <p contenteditable="false">${post.content}</p>
                                <small>By: ${post.username} on ${post.datePosted}</small>
                                <button class="edit-post"><i class="fas fa-edit"></i></button>
                                <button class="delete-post"><i class="fas fa-trash"></i></button>
                                <button class="save-post" style="display:none;"><i class="fas fa-save"></i></button>
                            </div>
                        `,
					)
					.join("");

				const deleteButtons = document.querySelectorAll(".delete-post");
				for (const button of deleteButtons) {
					button.addEventListener("click", deletePost);
				}

				const editButtons = document.querySelectorAll(".edit-post");
				for (const button of editButtons) {
					button.addEventListener("click", enableEditPost);
				}

				const saveButtons = document.querySelectorAll(".save-post");
				for (const button of saveButtons) {
					button.addEventListener("click", savePost);
				}
			} else {
				console.error("Error fetching posts:", posts.message);
				document.getElementById("posts").innerHTML = "<p>No posts found.</p>";
			}
		} catch (error) {
			console.error("Error fetching posts:", error);
		}
	};

	document.getElementById("logout-button").addEventListener("click", () => {
		localStorage.removeItem("token");
		localStorage.removeItem("username");
		window.location.href = "index.html";
	});

	document.getElementById("post-form").addEventListener("submit", async (e) => {
		e.preventDefault();
		const title = document.getElementById("post-title").value;
		const content = document.getElementById("post-content").value;

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
			fetchUserPosts();
			document.getElementById("post-form").reset();
		} catch (error) {
			console.error("Error creating post:", error);
		}
	});

	const enableEditPost = (e) => {
		const postElement = e.target.closest(".post");
		postElement.querySelector("h2").contentEditable = true;
		postElement.querySelector("p").contentEditable = true;
		postElement.querySelector("h2").classList.add("editable");
		postElement.querySelector("p").classList.add("editable");
		postElement.querySelector(".edit-post").style.display = "none";
		postElement.querySelector(".delete-post").style.display = "none";
		postElement.querySelector(".save-post").style.display = "inline-block";
	};

	const savePost = async (e) => {
		const postElement = e.target.closest(".post");
		const postId = postElement.dataset.id;
		const title = postElement.querySelector("h2").textContent;
		const content = postElement.querySelector("p").textContent;

		try {
			const response = await fetch(`${apiBaseUrl}/posts/${postId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ title, content }),
			});
			const data = await response.json();
			fetchUserPosts();
		} catch (error) {
			console.error("Error editing post:", error);
		}
	};

	const deletePost = async (e) => {
		const postId = e.target.closest(".post").dataset.id;

		try {
			const response = await fetch(`${apiBaseUrl}/posts/${postId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			fetchUserPosts();
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	document
		.getElementById("delete-user-button")
		.addEventListener("click", async () => {
			const confirmation = confirm(
				"Er du sikker på at du vil slette kontoen din?",
			);
			if (confirmation) {
				try {
					const response = await fetch(`${apiBaseUrl}/delete-user`, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					});
					const data = await response.json();
					if (response.ok) {
						alert("Kontoen din har blitt slettet.");
						localStorage.removeItem("token");
						localStorage.removeItem("username");
						window.location.href = "index.html";
					} else {
						console.error("Error deleting user:", data.message);
					}
				} catch (error) {
					console.error("Error deleting user:", error);
				}
			}
		});

	fetchUserPosts();
});
