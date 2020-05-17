$(document).ready(function() {
    getAccessToken();
});

function getAccessToken() {
    var projectID = "newapp.myapp.in"
    var scope = "email"
    var redirectURL = window.location.origin + "/profile.html"
    var projectSecret = "e7e4ce18b03fcd06698864f9641493cd79bba705abfd887aec0c5c03d3b2c2fd"
    var search = window.location.search + `&projectID=${projectID}&scope=${scope}&redirectURL=${redirectURL}&projectSecret=${projectSecret}`;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            getUserInfo(jsonData.access_token)
        } else if (this.readyState == 4) {
            var res = JSON.parse(this.responseText);
            $("body").empty();
            $("body").append(`<p>${res.message}</p>`);
        }
    };
    xhttp.open("GET", "https://oauth-v2-server.herokuapp.com/api/oauth/token" + search, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function getUserInfo(access_token) {
    var search = `?access_token=${access_token}`;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            setUserInfo(jsonData)
        } else if (this.readyState == 4) {
            var res = JSON.parse(this.responseText);
            $("body").empty();
            $("body").append(`<p>${res.message}</p>`);
        }
    };
    xhttp.open("GET", "https://oauth-v2-server.herokuapp.com/api/oauth/userinfo" + search, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function setUserInfo(userInfo) {
    $('#name').val(userInfo.name);
    $('#email').val(userInfo.email);
    $('#id').val(userInfo._id);
}