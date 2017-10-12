const $ = function(){
	class Container{
		constructor(elements){
			if(!(elements && elements.length)) return
			this.elements = Array.from(elements)
			for(let prop in elements[0]){
				if(typeof elements[0][prop] === 'function'){
					const elm = this.elements
					this[prop] = function(){
						return elm.map(
							el => el[prop](...arguments)
						)
					}
				}
			}
		}
		css(prop, val){
			const propType = typeof prop
			if(propType === 'string')
				this.elements.forEach(el => el.style[prop] = val)
			else if(propType === 'object'){
				for(let cssProp in prop){
					this.elements.forEach(el => el.style[cssProp] = prop[cssProp])
				}
			}
		}
		set(prop, val){
			if(!this.elements || !this.elements.forEach) return
			this.elements.forEach(el => el[prop] = val)
		}
		get(prop){
			if(!this.elements || !this.elements.map) return
			return this.elements.map(el => el[prop])
		}
		size(){
			if(!this.elements) return 0
			return this.elements.length
		}
	}
	return query => {
		const results = document.querySelectorAll(query)
		if(results.length < 2) return results[0]
		return new Container(results)
	}
}()