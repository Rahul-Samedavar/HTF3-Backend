### 1. /admin/signin , method: POST
- use for login

- request body 
    ```
    {
        "id": "xyz",
        "password": "12345678",
    }
    ```


 - success response:  200
    ```
    {
        "success": true,
        "message": "Login Success",
        "token": "qweqq........."
    }
    ```
    - Save this token in cookies and send it in headers as bearer token.

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

