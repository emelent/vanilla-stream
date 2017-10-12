//==================
// STREAMS
//==================
// on keyup event stream
const onKeyUp = Bacon.fromEvent($('#item-text'), 'keyup')

// on list item click(remove item)
const onListMovieClick = Bacon.fromEvent($('#movie-list'), 'click')

//text value stream
const textValue = onKeyUp.map(e => e.target.value).debounce(800)

const loadMovies = Bacon.fromPromise(fetch('./movies.json'))
	.flatMap(result => Bacon.fromPromise(result.json()))


//==================
// REDUCERS
//==================

//search movies reducer
const searchMoviesReducer = (state, text) => Object.assign({}, state, {
		results: searchMovies(state.movies, text)
	})

//load movies reducer
const loadMoviesReducer = (state, movies) => Object.assign({}, state, {movies})


//==================
// STORE
//==================

const store = Bacon.update({
		movies: [],
		results: []
	},
	textValue, searchMoviesReducer,
	loadMovies, loadMoviesReducer
)

//==================
// SIDE EFFECTS
//==================

// render list on update
store.onValue(({results}) => hideSpinner() || renderList(results))
onKeyUp.onValue(showSpinner)