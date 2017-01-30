
///---Преобразует строковую дату в строку запроса
function DateString2UrlFull(date)
{
    var year = parseInt(date.split("-")[0]);
    var month = parseInt(date.split("-")[1]);
    var days = parseInt(date.split("-")[2]);

    var hourspart = date.split("T")[1];
    var hour = parseInt(hourspart.split(":")[0]);
    var minutes = parseInt(hourspart.split(":")[1]);
    var seconds = parseInt(hourspart.split(":")[2]);

    return "/" + year + "/" + month + "/" + days + "/" + hour + "/" + minutes + "/" + seconds;
}

function DateString2UrlMinutes(date) {
    var year = parseInt(date.split("-")[0]);
    var month = parseInt(date.split("-")[1]);
    var days = parseInt(date.split("-")[2]);

    var hourspart = date.split("T")[1];
    var hour = parseInt(hourspart.split(":")[0]);
    var minutes = parseInt(hourspart.split(":")[1]);

    return "/" + year + "/" + month + "/" + days + "/" + hour + "/" + minutes;
}

function DateString2UrlHours(date) {
    var year = parseInt(date.split("-")[0]);
    var month = parseInt(date.split("-")[1]);
    var days = parseInt(date.split("-")[2]);

    var hourspart = date.split("T")[1];
    var hour = parseInt(hourspart.split(":")[0]);

    return "/" + year + "/" + month + "/" + days + "/" + hour;
}

function DateString2UrlDate(date) {
    var year = parseInt(date.split("-")[0]);
    var month = parseInt(date.split("-")[1]);
    var days = parseInt(date.split("-")[2]);

    return "/" + year + "/" + month + "/" + days;
}

///---Преобразует дату в строку запроса
function Date2UrlFull(date)
{
    return "/" + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getHours() + "/" + date.getMinutes() + "/" + date.getSeconds();
}

function Date2UrlMinutes(date) {
    return "/" + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getHours() + "/" + date.getMinutes();
}