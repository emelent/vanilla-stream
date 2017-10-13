let blockSearch = false
let movies = []
let results = []

$('#search-text').onkeyup = e => {
	if(blockSearch)	return
	showSpinner()
	const text = e.target.value
	blockSearch = true
	setTimeout(() => {
		blockSearch = false
		results = searchMovies(movies, text)
		renderList(results)
		hideSpinner()
	}, 800)
}
fetch('./movies.json').then(result => result.json()).then(data => movies = data)
