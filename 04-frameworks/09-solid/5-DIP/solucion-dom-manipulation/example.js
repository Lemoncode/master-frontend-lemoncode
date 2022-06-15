const modifyHTMLView = {
    setValues: function(data) {
        document.getElementById('name').text(data.name);
        document.getElementById('birthdate').text(data.birthdate);
    }
}

function setValuesFromServer(url, view) {
    fetch(url).then(data => view.setValues(data));
}

setValuesFromServer('url', modifyHTMLView);

// Además de cumplir DIP también cumple SRP y OCP
const modifyLocalStorage = {
    setValues: function(data) {
        localStorage.setItem('name', data.name);
        localStorage.setItem('birthdate', data.birthdate);
    }
}

setValuesFromServer('url2', modifyHTMLView);
setValuesFromServer('url3', modifyLocalStorage);
