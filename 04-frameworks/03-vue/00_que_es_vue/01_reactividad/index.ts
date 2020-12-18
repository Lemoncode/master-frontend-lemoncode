const person = {
    _name: "Nerea", // valor "interno"
    get name() {
        return this._name; /* + '!' */
    },
    set name(value) {
        this._name = value;
    },
};

console.log(person.name);

person.name = "Alfredo";

console.log(person.name);

// reactividad con Proxies
// 👉🏽 En el apartado 05
