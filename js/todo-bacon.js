//==================
// EVENT STREAMS
//==================

// on keyup event stream
const onKeyUp = Bacon.fromEvent($('#item-text'), 'keyup')

// on button click event stream(add item)
const onAddItemClick = Bacon.fromEvent($('#add-button'), 'click')

// on list item click(remove item)
const onListItemClick = Bacon.fromEvent($('#items-list'), 'click')

// on valid enter stream
const onValidEnter = onKeyUp
	.map(e => nonEmpty(e.target.value) && e.keyCode === 13)
	.filter(x => x)

// on add item stream
const onAddItem = onValidEnter.merge(onAddItemClick)


//==================
// PROPERTIES
//==================

//text value stream
const textValue = onKeyUp.map(e => e.target.value).toProperty(getText())


//====================
// DERIVATIVE STREAMS
//=====================

// added items  stream
const addNewItem = textValue.sampledBy(onAddItem)

// removed items stream
const removeItem = onListItemClick.map(e => e.target.dataset.id)


//==================
// REDUCERS
//==================

// new item reducer
const newItemReducer = (state, text) => state.concat(createItem(text))

// remove item  reducer
const removeItemReducer = (state, id) => state.filter(item => item.id != id)


//==================
// STORE
//==================

const store = Bacon.update([],
	addNewItem, newItemReducer,
	removeItem, removeItemReducer
)


//==================
// SIDE EFFECTS
//==================

// disable/enable btn if text empty/not empty
textValue.map(nonEmpty).not()
	.assign(setDisabled, $('#add-button'))

// render list on update
store.onValue(renderList)

// clear text input after adding item
onAddItem.onValue(clearTextInput)
