//=========================
// GLOBALS
//=========================

//item list
let items = []

//=========================
// EVENT HANDLERS
//=========================

// on button click event handler
$('#add-button').onclick =  () => {
	// add item and re-render list
	addAndUpdate(getText())
}

//on key up event handler
$('#item-text').onkeyup = e => {
	// input box text
	const text = getText()
	
	if(nonEmpty(text)){
		// update btn enabled
		setDisabled($('#add-button'), false)

		// handle on enter key press
		if(e.keyCode === 13){
			// add item and re-render list
			addAndUpdate(text)
		}
	}else{
		// update btn disabled
		setDisabled($('#add-button'), true)
	}
}

// on list item click
$('#items-list').onclick = e =>  {
	// remove item from list
	removeItem(e.target.dataset.id)

	// re-render list
	renderList(items)
}


//=========================
// FUNCS
//=========================

// adds new item && updates list 
const addAndUpdate = text => {
	// add item to list
	addItem(text)

	// clear text input
	clearTextInput()

	// re-render list
	renderList(items)
} 

// add new item to list
const addItem = text => items.push(createItem(text))

// remove item from list
const removeItem = id => items = items.filter(x => x.id != id)


//=========================
// SET UP
//=========================

// enable/disable button on start up
$('#add-button').disabled = !nonEmpty(getText())
