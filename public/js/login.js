$(document).ready(function() {
    if (window.location.search.length != 0) {
        verifyProject();
    }
    if (localStorage.getItem('x-auth')) {
        if (window.location.search.length != 0) {
            $("#div_login , #div_oauth").toggleClass("centered-form__form");
            $("#div_login , #div_oauth").toggleClass("centered-form__form__hidden");
        } else {
            window.location.href = '/';
        }
    }

});

jQuery('#login-form').on('submit', function(e) {
    e.preventDefault();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var x_auth = xhttp.getResponseHeader('x-auth');
            localStorage.setItem('x-auth', x_auth);
            if (window.location.search.length != 0) {
                $("#div_login , #div_oauth").toggleClass("centered-form__form");
                $("#div_login , #div_oauth").toggleClass("centered-form__form__hidden");
            } else {
                window.location.href = '/';
            }
        } else if (this.readyState == 4) {
            console.log(JSON.parse(this.responseText));
            alert("Invalid Username or Password")
        }
    };
    xhttp.open("POST", window.location.origin + "/api/user/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    var jsonObj = {
        email: jQuery("#email").val(),
        password: jQuery("#password").val()
    };
    xhttp.send(JSON.stringify(jsonObj));
});
jQuery('#oauth-form').on('submit', function(e) {
    e.preventDefault();
    var search = window.location.search;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            window.location.replace(JSON.parse(this.responseText).redirectURL);
        } else if (this.readyState == 4) {
            var res = JSON.parse(this.responseText);
            $("body").empty();
            $("body").append(`<p>${res.message}</p>`);
        }
    };
    xhttp.open("GET", window.location.origin + "/api/oauth/code" + search, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
    xhttp.send();
});
jQuery('#cancel').on('click', function(e) {
    $("body").empty();
    $("body").append("<p>Request Denied</p>");
});

function gotoRegister(e) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            window.location.href = "/register" + window.location.search
        }
    };
    xhttp.open("DELETE", window.location.origin + "/api/user/logout", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
    xhttp.send();
    localStorage.removeItem("x-auth");
}

function verifyProject() {
    var search = window.location.search;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            var project = jsonData;
            $('#confirm_text').text(`${project.name} wants to access your details`)
            $('#scope').text(`Scope : ${project.scope}`)
        } else if (this.readyState == 4) {
            var res = JSON.parse(this.responseText);
            $("body").empty();
            $("body").append(`<p>${res.message}</p>`);
        }
    };
    xhttp.open("GET", window.location.origin + "/api/oauth/verifyproject" + search, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function Toggle() {
    var temp = document.getElementById("password");
    if (temp.type === "password") {
        temp.type = "text";
    } else {
        temp.type = "password";
    }
}