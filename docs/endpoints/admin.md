### 1. /admin/signin , method: POST
- use for login

- request body 
    ```
    {
        "username": "adminn",
        "password": "pass"
    }
    ```


 - success response:  200
    ```
    {
        "success": true,
        "message": "Login Success",
        "token": "................."
    }
    ```
    - Save this token in cookies and send it in headers as admin token.
`
 - fail reponse 1: 401 wrong email or password
    ```
    {
        "success": false,
        "error": "Invalid Credentials"
    }
    ```

 - fail reponse 2: 400 bad request
    ```
    {
        "success": false,
        "error": "Missing fields"
    }
    ```

