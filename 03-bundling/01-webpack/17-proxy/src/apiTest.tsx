import React from "react";

const reqGet = (() => {
    let status = "pending";
    let result;
    const resultData = fetch("/api/get")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            status = "success";
            console.log(data);
            result = data;
        })
        .catch(error => {
            status = "error";
            result = `${status} ${error}`;
        });

    return {
        Request() {
            if (status === "pending") {
                console.log(status);
                throw resultData;
            } else if (status === "error") {
                console.log(status);
                return result;
            } else if (status === "success") {
                console.log(status);
                return result;
            }
        }
    }
})()

function getListObject(obj) {
    return (
        <ul>
            {Object.keys(obj).map((keyOb) =>
                (<li>
                    {keyOb}:&nbsp;
                    {typeof obj[keyOb] === "object" ?
                        getListObject(obj[keyOb]) :
                        obj[keyOb]}
                </li>))}
        </ul>
    )
}

export const RequestGet = () => {
    let obj = reqGet.Request();
    return (<div>
        <h5>Result API http://localhost:8080/api/get: </h5>
        {typeof obj === "object" ? getListObject(obj) : obj}
    </div>);
}