async function fetchShows(limit = 99) {
  const response = await fetch(`https://api.tvmaze.com/shows`);
  const data = await response.json();
  return data.slice(0, limit);
}

async function displayShows() {
  //const container = document.getElementById("shows-container"); // Ensure this exists in your HTML
  const items = await fetchShows();
  // const container = document.createElement("div");
  const showsContainer = document.querySelector(".container.shows-container");

  items.forEach((each) => {
    const showContainer = document.createElement("div");
    showContainer.classList.add("show_container");
    showContainer.id = `show-${each.id}`;
    showContainer.innerHTML = `
      <div class="show_image">
        <img src="${each.image?.medium || "placeholder.jpg"}" alt="${
      each.name
    }">
      </div>
      <div class="show_title">${each.name}</div>
      <div class="show_disc">${each.summary}</div>
      <button class="toggle-fav" data-id="${each.id}">
        <i class="fas fa-bookmark add-to-fav"></i> Add to Favorite
      </button>
    `;
    showsContainer.appendChild(showContainer);
  });
}

function toggleShowFavorite() {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches(".toggle-fav")) {
      const showId = e.target.getAttribute("data-id");
      const showContainer = document.getElementById(`show-${showId}`);
      const isFavorite = showContainer.classList.contains("favorite");
      const favContainer = document.getElementById("fav");

      if (isFavorite) {
        document
          .querySelector(".container.shows-container")
          .appendChild(showContainer);
        e.target.innerHTML = '<i class="fas fa-bookmark"></i> Add to Favorite';
      } else {
        favContainer.appendChild(showContainer);
        e.target.innerHTML =
          '<i class="fas fa-bookmark test"></i> Remove From Favorite';
      }

      showContainer.classList.toggle("favorite");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayShows().then(() => toggleShowFavorite());
  setupFavoritesToggle();
});

function setupFavoritesToggle() {
  const favLink = document.querySelector('[data-open="fav"]');
  const favContainer = document.getElementById("fav");

  favLink.addEventListener("click", (e) => {
    e.preventDefault();

    if (!document.querySelector(".fav-close-button")) {
      favContainer.innerHTML +=
        '<i class="fas fa-times fav-close-button" style="cursor: pointer;"></i>';
    }
    favContainer.classList.toggle("is-visible");
    document.body.style.overflow = favContainer.classList.contains("is-visible")
      ? "hidden"
      : "";
    let isAscendingFav = true;
    const sortFavBtn = document.getElementById("sort-fav");
    sortFavBtn.addEventListener("click", () => {
      isAscendingFav = sortShows(
        ".container.favorites-container",
        isAscendingFav
      );
    });

    document
      .querySelector(".fav-close-button")
      .addEventListener("click", () => {
        favContainer.classList.remove("is-visible");
        document.body.style.overflow = "";
      });
  });
}

async function countGenres() {
  const shows = await fetchShows();
  const genreCounts = {};

  shows.forEach((show) => {
    show.genres.forEach((genre) => {
      if (genreCounts[genre]) {
        genreCounts[genre] += 1;
      } else {
        genreCounts[genre] = 1;
      }
    });
  });

  console.log(genreCounts);
  return genreCounts;
}
function displayGenreCounts(genreCounts) {
  const container = document.getElementById("genre-counts-container");
  Object.entries(genreCounts).forEach(([genre, count]) => {
    const element = document.createElement("div");
    element.textContent = `${genre}: ${count}`;
    container.appendChild(element);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const genreCounts = await countGenres();
  displayGenreCounts(genreCounts);
});

let isAscendingHome = true;

function sortShows(containerSelector, isAscending) {
  const container = document.querySelector(containerSelector);
  let shows = Array.from(container.querySelectorAll(".show_container"));

  shows.sort((a, b) => {
    const titleA = a.querySelector(".show_title").textContent.toUpperCase();
    const titleB = b.querySelector(".show_title").textContent.toUpperCase();
    return isAscending
      ? titleA.localeCompare(titleB)
      : titleB.localeCompare(titleA);
  });

  shows.forEach((show) => container.appendChild(show));

  return !isAscending;
}

const sortHomeBtn = document.getElementById("sort-home");

sortHomeBtn.addEventListener("click", () => {
  isAscendingHome = sortShows(".container.shows-container", isAscendingHome);
});
