var projectsMap = {};
$(document).ready(function() {
    if (!localStorage.getItem('x-auth')) {
        window.location.href = "/login";
    } else {
        renderProject();
    }
});

jQuery('#project-form').on('submit', function(e) {
    e.preventDefault();
    if (jQuery("#new_url").val().length == 0) {
        alert("Please enter redirect url")
    } else {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var json = JSON.parse(this.responseText);
                projectsMap[jQuery("#projects").val()].redirectURLs.push(jQuery("#new_url").val())
                $('#redirect_urls').append(`<li class="input-style"> 
                                        ${jQuery("#new_url").val()} 
                                    </li>`);
            }
        };
        xhttp.open("POST", window.location.origin + "/api/project/addRedirectUrl", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
        var jsonObj = {
            projectID: projectsMap[jQuery("#projects").val()].projectID,
            redirectURL: jQuery("#new_url").val()
        };
        xhttp.send(JSON.stringify(jsonObj));
    }
});



function renderProject() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            if (jsonData.length == 0) {
                window.location.href = "/project"
            }
            for (i = 0; i < jsonData.length; i++) {
                $('#projects').append(`<option value="${jsonData[i]._id}"> 
                                       ${jsonData[i].name} 
                                  </option>`);
                projectsMap[jsonData[i]._id] = jsonData[i]
            }
            var urls = jsonData[0].redirectURLs;
            $('#project_name').val(jsonData[0].name);
            $('#project_id').val(jsonData[0].projectID);
            $('#project_secret').val(jsonData[0].projectSecret);
            $('#project_scope').val(jsonData[0].scope);
            for (i = 0; i < urls.length; i++) {
                $('#redirect_urls').append(`<li class="input-style"> 
                                       ${urls[i]} 
                                  </li>`);
            }
        }
    };
    xhttp.open("GET", window.location.origin + "/api/project", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
    xhttp.send();
}

$('#projects').on('change', function() {
    $('#redirect_urls').empty()
    var urls = projectsMap[this.value].redirectURLs
    console.log(projectsMap[this.value])
    $('#project_id').val(projectsMap[this.value].projectID);
    $('#project_secret').val(projectsMap[this.value].projectSecret);
    $('#project_scope').val(projectsMap[this.value].scope);
    $('#project_name').val(projectsMap[this.value].name);
    for (i = 0; i < urls.length; i++) {
        $('#redirect_urls').append(`<li class="input-style"> 
                                       ${urls[i]} 
                                  </li>`);
    }
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