//==================
// STREAMS
//==================
// on keyup event stream
const onKeyUp = Bacon.fromEvent($('#search-text'), 'keyup')

// on movie list click stream
const onListClick = Bacon.fromEvent($('#movie-list'), 'click')

// on back button click stream
const onBackClick = Bacon.fromEvent($('#back-button'), 'click')

// text value stream
const onTextValue = onKeyUp.map(e => e.target.value).debounce(800)

// load movies stream
const onLoadMovies = Bacon.fromPromise(fetch('./movies.json'))
	.flatMap(result => Bacon.fromPromise(result.json()))

// on movie select stream
const onSelectedMovie  = onListClick.map(e => e.target.dataset.title)

//==================
// REDUCERS
//==================

// search movies reducer
const searchMoviesReducer = (state, text) => Object.assign({}, state, {
		results: searchMovies(state.movies, text),
		currentMovie: null //set current movie to null every time search is performed
	})

// load movies reducer
const onLoadMoviesReducer = (state, movies) => Object.assign({}, state, {movies})

// select movie reducer
const selectMovieReducer = (state, title) => Object.assign({}, state, {
	currentMovie: getMovie(state.movies, title)
})

//==================
// STORE
//==================

const store = Bacon.update({
		movies: [],
		results: [],
		currentMovie: null
	},
	onTextValue, searchMoviesReducer,
	onLoadMovies, onLoadMoviesReducer,
	onSelectedMovie,  selectMovieReducer
)

//==================
// SIDE EFFECTS
//==================

// stream for when current movie is updated to non-null
const onSetCurrentMovie = store.map(state => state.currentMovie).filter(x => x)

// render list on update
store.onValue(({results}) => hideSpinner() || renderList(results))

// show movie
onSetCurrentMovie.onValue(showMovie)

// show poster loader
onSetCurrentMovie
	.onValue(showImageLoader)

// update image src url
onSetCurrentMovie
	.flatMap(movie => Bacon.fromPromise(fetch(movie.posterurl)))
	.onValue(response => updatePosterUrl(response.url))

// show spinner on key up(pretending to search)
onKeyUp.onValue(showSpinner)

// go back to movie list when back button clicked
onBackClick.onValue(hideMovie)
