class iTunesAPI {
	constructor () {
		this._data = [];
		this._endpoint = "https://itunes.apple.com";
	}
	get data() {
		return this._data;
	}
	searchArtist(searchItem) {
		return new Promise((res, rej) => {
			fetch(`${this._endpoint}/search?term=${encodeURI(searchItem)}&media=music&entity=album&attribute=artistTerm&limit=200`)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					rej(false)
				}
			}, rej)
			.then(json => {
				this._data = json;
				res(true);
			}, rej);
		});
	}
}