1. /auth/signup , method: POST
- use for registration
- checks for strong password

- request body 
    ```
    {
        "email": "test1@gmail.com",
        "password": "12345678",
        "username": "test user"
    }
    ```


 - success response:  200
    ```
    {
        "success": true,
        "token": "qweqq........."
    }
    ```
    - Save this token in cookies and send it inn headers as bearer token.

 - fail reponse 1: 409 email already taken
    ```
    {
        "success": false,
        "error": "Email ID taken"
    }
    ```

 - fail reponse 2: 400 weak password
    ```
    {
        "success": false,
        "error": "Weak password"
    }
    ```

 - fail reponse 3: 400 Bad Request
    ```
    {
        "success": false,
        "error": "Missing fields"
    }
    ```

---

2. /auth/signin , method: POST
- use for login

- request body 
    ```
    {
        "email": "test@gmail.com",
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
    - Save this token in cookies and send it inn headers as bearer token.

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