document.addEventListener("DOMContentLoaded", () => {
  // 1. Get the post "slug" from the URL
  const params = new URLSearchParams(window.location.search);
  const postSlug = params.get("post"); // e.g., "mixing-tips"

  if (!postSlug) {
    displayPostNotFound();
    return;
  }

  // 2. Find the post in our "database" (from blog-content.js)
  // The 'blogPosts' variable comes from the blog-content.js file
  const postData = blogPosts.get(postSlug);

  if (!postData) {
    displayPostNotFound();
    return;
  }

  // 3. Inject the content into the page
  document.getElementById("post-title").textContent = postData.title;
  document.getElementById("post-category").textContent = postData.category;
  document.getElementById("post-author").textContent = `By ${postData.author}`;
  document.getElementById("post-date").textContent = postData.date;
  document.getElementById("post-image").src = postData.image;
  document.getElementById("post-image").alt = postData.title;
  document.getElementById("post-content-body").innerHTML = postData.content;

  // Also update the browser tab title
  document.title = `${postData.title} - EchoSpace Blog`;
});

function displayPostNotFound() {
  const contentElement = document.querySelector(".blog-post-content");
  if (contentElement) {
    contentElement.innerHTML = `
      <h1 class="blog-post-title hero-gradient-text">Post Not Found</h1>
      <p class="lead">Sorry, we couldn't find the post you're looking for.</p>
      <hr class="my-5">
      <a href="blogs.html" class="btn btn-secondary"><i class="bi bi-arrow-left"></i> Back to All Posts</a>
    `;
  }
}
