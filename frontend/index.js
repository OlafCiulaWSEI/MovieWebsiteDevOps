let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");

let getMovie = () => {
  let movieName = movieNameRef.value.trim();
  if (movieName.length <= 0) {
    result.innerHTML = "<h3 class='msg'>Please enter a movie name</h3>";
    return;
  }

  // UWAGA: tutaj wywołujemy backend zamiast OMDb
  let url = `http://34.228.68.78:3000/movies?title=${encodeURIComponent(movieName)}`;

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      if (data.Response === "True") {
        // dalej możesz zostawić swój istniejący template
        result.innerHTML = `
          <div class="info">
            <div>
              <img src=${data.Poster} class="poster"/>
            </div>
            <div>
              <h2>${data.Title}</h2>
              <div class="rating">
                <img src="star-icon.svg"/>
                <h4>${data.imdbRating}</h4>
              </div>
              <div class="details">
                <span>${data.Rated}</span>
                <span>${data.Year}</span>
                <span>${data.Runtime}</span>
              </div>
              <div class="genre">
                <div>${data.Genre.split(",").join("</div><div>")}</div>
              </div>
            </div>
            <h3>Plot:</h3>
            <p>${data.Plot}</p>
            <h3>Cast:</h3>
            <p>${data.Actors}</p>
          </div>
        `;
      } else {
        result.innerHTML = `<h3 class="msg">${data.Error}</h3>`;
      }
    })
    .catch(() => {
      result.innerHTML = "<h3 class='msg'>Error occurred</h3>";
    });
};

searchBtn.addEventListener("click", getMovie);
window.addEventListener("load", getMovie);

