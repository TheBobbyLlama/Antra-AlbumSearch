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
			console.log(musicAPI.data);
			setSearchControls(false);
		}, _ => {
			console.log("Error!")
			setSearchControls(false);
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

/* ---- DOM MANIPULATION ---- */
function render(element, content) {
	element.innerHTML = content;
}

function bindDomEvents() {
	domLookup.elementSearchForm.addEventListener("submit", doArtistSearch);
}

bindDomEvents();