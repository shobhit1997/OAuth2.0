
OAuth 2.0 Server
===================================

This is an Authentication Server with OAuth 2.0 service.
Introduction
------------

## Documentation

**To use the OAuth Service follow the following steps:**

1. Visit https://oauth-v2-server.herokuapp.com
2. Register/Login
3. Create a new project(Make sure that the project name is unique and redirectUrl is valid)
4. Store the project credentials
5. Goto Login URL 
	https://oauth-v2-server.herokuapp.com/login?projectID=[projectID]&redirectURL=[RedirectURL]&scope=[scope]
6. When the user login is successful user will be redirected to the ***Redirect URL*** you provided	while creating the project with the code.
   Eg: http://redirectURL?code=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjljNjc0YjRj.. 
7. Get the access_token by using the following api:
	**GET**:https://oauth-v2-server.herokuapp.com/oauth/token?projectID=[projectID]&projectSecret=[ProjectSecret]&code=[code]&scope=[scope]&redirectURL=[RedirectURL]
8. Get the user details by using the following api:
	**GET**:https://oauth-v2-server.herokuapp.com/oauth/userinfo?access_token=[access_token]
