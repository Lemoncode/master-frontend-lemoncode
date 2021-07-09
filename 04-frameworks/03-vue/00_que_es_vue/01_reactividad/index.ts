const person = {
  name: 'Nerea',
}
person.name = 'Alfredo'

/* const person = {
  // valor "interno"
  _name: 'Nerea',
  get name() {
    return this._name + '!'
  },
  set name(value) {
    this._name = value
  },
} */

console.log(person.name)

person.name = 'Alfredo'

console.log(person.name)
