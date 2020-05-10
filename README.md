
OAuth 2.0 Server
===================================

This is an Authentication Server with OAuth 2.0 service.
Introduction
------------

## Documentation

**To use the OAuth Service follow the following steps:**

1. Visit http://oauth.shobhitagarwal.me
2. Register/Login
3. Create a new project(Make sure that the project name is unique and redirectUrl is valid)
4. Store the project credentials
5. Goto Login URL 
	http://oauth.shobhitagarwal.me/login?projectID=[projectID]&redirectURL=[RedirectURL]&scope=[scope]
6. When the user login is successful user will be redirected to the ***Redirect URL*** you provided	while creating the project with the code.
   Eg: http://redirectURL?code=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjljNjc0YjRj.. 
8. Get the user details by using the following api:
	**GET**:http://oauth.shobhitagarwal.me/oauth/userinfo?projectID=[projectID]&projectSecret=[ProjectSecret]&code=[code]&scope=[scope]&redirectURL=[RedirectURL]
