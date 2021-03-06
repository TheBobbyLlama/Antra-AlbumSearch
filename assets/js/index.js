const musicAPI = new iTunesAPI();

const domLookup = {
	elementResultPane: document.getElementById("artist-search-results"),
	elementSearchButton: document.querySelector("#artist-search-form button"),
	elementSearchForm: document.getElementById("artist-search-form"),
	elementSearchText: document.querySelector("#artist-search-form input[type='text']"),
	elementSearchWarnings: document.querySelectorAll('#artist-search-form .search-form__warning')
}

let displayCount;

function extractArtists(data) {
	const searchTerm = domLookup.elementSearchText.value.toLowerCase();

	return data.results
		.map(album => album.artistName) // Get artist names
		.filter((artist, index, self) => { return ((self.indexOf(artist) === index) &&  // Distinct
													(artist.toLowerCase() !== searchTerm)); }); // Not exact match to our search term.
}

function doArtistSearch(e, count) {
	e?.preventDefault();
	
	const artist = domLookup.elementSearchText.value;

	if (artist) {
		setSearchControls(true);
		showWarning("");

		musicAPI.searchArtist(artist).then(_ => {
			displayCount = count || 10;
			localStorage.setItem("lastSearch", artist);
			localStorage.setItem("lastSearchCount", displayCount);
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

function searchResultsClick(e) {
	switch (e.target.tagName) {
		case "BUTTON":
			if (e.target.dataset.artist) {
				domLookup.elementSearchText.value = e.target.dataset.artist;
				doArtistSearch();
			} else if (e.target.dataset.action === "load-more") {
				displayCount += 10;
				localStorage.setItem("lastSearchCount", displayCount);
				render(domLookup.elementResultPane,
					generateAlbumSearchResults(domLookup.elementSearchText.value, musicAPI.data));
			}
			break;
	}
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

function generateArtistOptionHtml(artist) {
	return `<button type="button" class="btn--simple" title="${artist}" data-artist="${artist}">${artist}</button>`;
}

function generateArtistOptions(artists) {
	if (artists.length) {
		const artistButtons = artists.map(artist => generateArtistOptionHtml(artist));

		return `<div class="option-results">
			<h3>Narrow Your Search</h3>
			<div class="option-results__display">
				${artistButtons.join("")}
			</div>
		</div>`
	} else {
		return "";
	}
}

function generateAlbumCardHtml(album) {
	return `<a class="album-card" href="${album.collectionViewUrl}" target="_blank">
		<img src="${album.artworkUrl100}" title="Album Art" />
		<h3>${album.collectionCensoredName}</h3>
		<h4>${album.artistName}</h4>
	</a>`;
}

function generateAlbumSearchResults(searchTerm, data) {
	const cards = data.results.map(item => generateAlbumCardHtml(item)).slice(0, displayCount);
	const artists = extractArtists(data);

	return `<h2>${data.resultCount} result${(data.resultCount !== 1) ? "s" : ""} for "${searchTerm}"</h2>
	${generateArtistOptions(artists)}
	<div class="album-results">
		${cards.join("")}
	</div>
	${(displayCount < data.results.length) ? `<button class="btn--simple" data-action="load-more">Load More</button>` : ""}`;
}

/* ---- DOM MANIPULATION ---- */
function render(element, content) {
	element.innerHTML = content;
}

function bindDomEvents() {
	domLookup.elementSearchForm.addEventListener("submit", doArtistSearch);
	domLookup.elementResultPane.addEventListener("click", searchResultsClick);
}

bindDomEvents();

domLookup.elementSearchText.value = localStorage.getItem("lastSearch");

if (domLookup.elementSearchText.value) {
	doArtistSearch(null, localStorage.getItem("lastSearchCount"));
}