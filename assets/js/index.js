const musicAPI = new iTunesAPI();

const domLookup = {
	elementResultPane: document.getElementById("artist-search-results"),
	elementSearchButton: document.querySelector("#artist-search-form button"),
	elementSearchForm: document.getElementById("artist-search-form"),
	elementSearchText: document.querySelector("#artist-search-form input[type='text']"),
	elementSearchWarnings: document.querySelectorAll('#artist-search-form .search-form__warning')
}

function doArtistSearch(e) {
	e.preventDefault();
	
	const artist = domLookup.elementSearchText.value;

	if (artist) {
		setSearchControls(true);
		showWarning("");

		musicAPI.searchArtist(artist).then(_ => {
			setSearchControls(false);
			render(domLookup.elementResultPane,
				generateAlbumSearchResults(artist, musicAPI.data));
		}, _ => {
			setSearchControls(false);
			showAPIError();
		});

		showLoadingSpinner();
	} else {
		showWarning("empty");
	}
}

function setSearchControls(freeze) {
	domLookup.elementSearchText.disabled = freeze;
	domLookup.elementSearchButton.disabled = freeze;
}

function showWarning(key) {
	domLookup.elementSearchWarnings.forEach(element => {
		if (element.dataset.key === key) {
			element.classList.remove("hidden");
		} else {
			element.classList.add("hidden");
		}
	})
}

/* ---- CONTENT GENERATION ---- */
function showLoadingSpinner() {
	// From https://loading.io/css/
	render(domLookup.elementResultPane,
		`<div class="simple-center">
			<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
		</div>`);
}

function showAPIError() {
	render(domLookup.elementResultPane,
		`<h2>An error has occurred.  Please try again later.</h2>`);
}

function generateAlbumCardHtml(album) {
	return `<a class="album-card" href="${album.collectionViewUrl}" target="_blank">
		<img src="${album.artworkUrl100}" title="Album Art" />
		<h3>${album.collectionCensoredName}</h3>
		<h4>${album.artistName}</h4>
	</a>`;
}

function generateAlbumSearchResults(searchTerm, data) {
	console.log(data);
	const cards = data.results.map(item => generateAlbumCardHtml(item));

	return `<h2>${data.resultCount} result${(data.resultCount !== 1) ? "s" : ""} for "${searchTerm}"</h2>
	<div class="album-results">
		${cards.join("")}
	</div>`;
}

/* ---- DOM MANIPULATION ---- */
function render(element, content) {
	element.innerHTML = content;
}

function bindDomEvents() {
	domLookup.elementSearchForm.addEventListener("submit", doArtistSearch);
}

bindDomEvents();