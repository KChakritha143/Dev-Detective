async function getUser() {
    const username = document.getElementById("searchInput").value;
    const profile = document.getElementById("profile");
    const reposDiv = document.getElementById("repos");
    const loading = document.getElementById("loading");

    profile.innerHTML = "";
    reposDiv.innerHTML = "";
    loading.innerHTML = "Loading...";

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            throw new Error("User not found");
        }

        const data = await response.json();

        displayUser(data);
        getRepos(data.repos_url);

    } catch (error) {
        profile.innerHTML = "<p>User Not Found</p>";
    }

    loading.innerHTML = "";
}

function displayUser(user) {
    const profile = document.getElementById("profile");

    profile.innerHTML = `
        <div style="text-align:center;">
            <img src="${user.avatar_url}">
            <h2>${user.name || user.login}</h2>
            <p>@${user.login}</p>
            <p>${user.bio || "No bio available"}</p>
            <p>Joined: ${formatDate(user.created_at)}</p>
            <a href="${user.blog}" target="_blank">${user.blog || "No Portfolio"}</a>
        </div>
    `;
}

async function getRepos(url) {
    const reposDiv = document.getElementById("repos");

    try {
        const res = await fetch(url);
        const repos = await res.json();

        displayRepos(repos.slice(0, 5));

    } catch (error) {
        reposDiv.innerHTML = "<p>Error loading repositories</p>";
    }
}

function displayRepos(repos) {
    const reposDiv = document.getElementById("repos");

    reposDiv.innerHTML = "<h3>Top Repositories</h3>";

    repos.forEach(repo => {
        reposDiv.innerHTML += `
            <div class="repo">
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>Created: ${formatDate(repo.created_at)}</p>
            </div>
        `;
    });
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}