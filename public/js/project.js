$(document).ready(function() {
    if (localStorage.getItem('x-auth') === null) {
        window.location.href = "/login";
    }
});

jQuery('#project-form').on('submit', function(e) {
    e.preventDefault();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var json = JSON.parse(this.responseText);
            prompt("Copy to clipboard: Ctrl+C, Enter", "{projectID : " + json.projectID + ",projectSecret : " + json.projectSecret + ",scope : " + json.scope + "}");
            window.location.href = '/';
        } else if (this.readyState == 4) {
            var res = JSON.parse(this.responseText);
            alert(res.message || "Unknown Error");
        }
    };
    xhttp.open("POST", window.location.origin + "/api/project", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
    var jsonObj = {
        name: jQuery("#project_name").val(),
        scope: jQuery("#project_scope").val(),
        redirectURLs: jQuery("#redirect_url").val().length == 0 ? [] : [jQuery("#redirect_url").val()]
    };
    xhttp.send(JSON.stringify(jsonObj));
});

function logout() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            window.location.href = "/login" + window.location.search
        }
    };
    xhttp.open("DELETE", window.location.origin + "/api/user/logout", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
    xhttp.send();
    localStorage.removeItem("x-auth");
}