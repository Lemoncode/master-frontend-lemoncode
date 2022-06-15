function setValuesFromServer() {
    fetch('a-concrete-url').then(
        data => {
            document.getElementById('name').text(data.name);
            document.getElementById('birthdate').text(data.birthdate);
        }
    );
}

setValuesFromServer();
