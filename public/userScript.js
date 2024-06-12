document.addEventListener("DOMContentLoaded", () => {
	const apiBaseUrl = "http://localhost:3000";

	const fetchUserPosts = async () => {
		const token = localStorage.getItem("token");
		const username = localStorage.getItem("username");

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
                                <h2>${post.title}</h2>
                                <p>${post.content}</p>
                                <small>By: ${post.username} on ${post.datePosted}</small>
                                <button class="edit-post">Edit</button>
                                <button class="delete-post">Delete</button>
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
					button.addEventListener("click", editPost);
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
			fetchUserPosts();
			document.getElementById("post-form").reset();
		} catch (error) {
			console.error("Error creating post:", error);
		}
	});

	const editPost = async (e) => {
		const postId = e.target.closest(".post").dataset.id;
		const token = localStorage.getItem("token");
		const title = prompt("Enter new title:");
		const content = prompt("Enter new content:");

		if (title && content) {
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
				alert(data.message);
				fetchUserPosts();
			} catch (error) {
				console.error("Error editing post:", error);
			}
		}
	};

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
			fetchUserPosts();
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	fetchUserPosts();
});
