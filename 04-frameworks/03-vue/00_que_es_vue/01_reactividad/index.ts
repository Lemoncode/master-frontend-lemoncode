// @ts-check

/* const person = {
  name: 'Nerea',
}
person.name = 'Alfredo' */

const person = {
  // valor "interno"
  _name: 'Nerea',
  get name() {
    return this._name + '!'
  },
  set name(value) {
    this._name = value
  },
}

console.log(person.name)

person.name = 'Alfredo'

console.log(person.name)

// ==============

// Ejemplo con Proxies

const person2 = {
  name: 'Nerea',
}

type person2Keys = keyof typeof person2

const person2Proxy = new Proxy(person2, {
  get(target: typeof person2, prop: person2Keys) {
    console.log('get!!', target, prop)

    return target[prop]
  },
  set(target: typeof person2, prop: person2Keys, value: string) {
    console.log('set!!', target, prop, value)

    return Reflect.set(target, prop, value)
  },
})

console.log(person2Proxy.name)

person2Proxy.name = 'Alfredo'

console.log(person2Proxy.name)
