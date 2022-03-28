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
			// TODO - This fails for Apple devices!
			// GET musics://mzstoreservices-int.dslb.apple.com/search?term=Gaga&media=music&entity=album&attribute=artistTerm&limit=200&callback=jsonp_1648499586626_43620 net::ERR_UNKNOWN_URL_SCHEME
			fetchJsonp(`${this._endpoint}/search?term=${encodeURI(searchItem)}&media=music&entity=album&attribute=artistTerm&limit=200`)
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