const musicAPI = new iTunesAPI();

musicAPI.searchArtist("Gaga").then(_ => {
	console.log(musicAPI.data);
})