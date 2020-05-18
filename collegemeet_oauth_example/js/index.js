var projectID = "newapp.myapp.in"
var scope = "email"
var redirectURL = window.location.origin + "/profile.html"

function login() {
    window.location.href = `https://oauth-v2-server.herokuapp.com/login?projectID=${projectID}&scope=${scope}&redirectURL=${redirectURL}`
}