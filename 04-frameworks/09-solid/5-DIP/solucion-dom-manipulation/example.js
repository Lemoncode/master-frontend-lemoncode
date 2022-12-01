const modifyHTMLView = {
    setValues: function(data) {
        document.getElementById('name').text(data.name);
        document.getElementById('birthdate').text(data.birthdate);
    }
}

// Además de cumplir DIP también cumple SRP y OCP
const modifyLocalStorage = {
    setValues: function(data) {
        localStorage.setItem('name', data.name);
        localStorage.setItem('birthdate', data.birthdate);
    }
}

const apiSource = {
    getData: function() {
        return fetch('a-concrete-url');
    }
}

const otherSource = {
    getData: function() {
        return Promise.resolve(localStorage.getItem('data'));
    }
}

function setValuesFromServer(source, view) {
    source.getData().then(data => view.setValues(data));
}

setValuesFromServer(apiSource, modifyHTMLView);
setValuesFromServer(apiSource, modifyLocalStorage);
setValuesFromServer(otherSource, modifyHTMLView);

