flow of auths:
1. Singup: 
    - call /signup/init with a email.  -> send otp .
    - call /signup with email, password, username and otp. -> acount created. returns token.

2. Signin:

    - call /signup with email, password ->  returns token.

3. forgot password:
    - call /reset-password/init with a email.  -> sends otp .
    - call /reset-password with email, new_password and otp. ->  resets password.


---



NOTE: All this endpoints have rate limitter.
- For each endpoint you can send rate upto 7 requests per 10 minute.
- this prevents someone from brute  forcing password..
- So if you send 8th request within 10 mins you recieve 429:
```
{
  "success": false,
  "error": "Too many attempts. Try again later."
}
```
- then wait for few mins and try again.
-  testers do test this.

---

### 1. /auth/signup/init , method: POST
- use during registration to generate OTP...

- request body 
    ```
    {
        "email": "test1@gmail.com",
    }
    ```


 - success response :  200
    ```
    {
        "success": true,
        "message": "OTP sent" | "OTP already sent. Please check your email"
    }
    ```
    - OTP is sent to the mail
    - Note: If a OTP was sent already before and if its still active you get "OTP already sent". so same otp can be reused
    - Also, OTPs are shared for signup and reset password. so if you signup with some otp, you can reset passoword with same otp before it expires.

 - fail reponse 1: 409 email already taken
    ```
    {
        "success": false,
        "error": "Email Taken"
    }
    ```

 - fail reponse 2: 400 Bad Request
    ```
    {
        "success": false,
        "error": "Missing fields"
    }
    ```

---

### 2. /auth/signup , method: POST
- use for registration , requires otp
- checks for strong password

- request body 
    ```
    {
        "email": "test1@gmail.com",
        "password": "12345678",
        "username": "test user"
        "otp: "12312"
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

 - fail reponse 4: 400 OTP expired. -> prompt to send new OTP
    ```
    {
        "success": false,
        "error": "OTP expired" | "No OTP found"
    }
    ```

 - fail reponse 5: 400 Wrong OTP
    ```
    {
        "success": false,
        "error": "Wrong OTP"
    }
    ```

---

### 3. /auth/signin , method: POST
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


### 4. /auth/reset-password/init , method: POST
- use when forgot password,  to generate OTP...

- request body 
    ```
    {
        "email": "test1@gmail.com",
    }
    ```


 - success response:  200
    ```
    {
        "success": true,
        "message": "OTP sent" | "OTP already sent. Please check your email"
    }
    ```

 - fail reponse 1: 404 user not found
    ```
    {
        "success": false,
        "error": "No account exists with this email!!"
    }
    ```

 - fail reponse 2: 400 Bad Request
    ```
    {
        "success": false,
        "error": "Missing fields"
    }
    ```

---



### 5. /auth/reset-password , method: POST
- use to change password.

- request body 
    ```
    {
        "email": "test1@gmail.com",
        "password": "newPassword",
        "otp": "12321"
    }
    ```
 - success response:  200
    ```
    {
        "success": true,
    }
    ```

 - fail reponse 1: 404 user not found
    ```
    {
        "success": false,
        "error": "No account exists with this email!!"
    }
    ```

 - fail reponse 2: 400 Bad Request
    ```
    {
        "success": false,
        "error": "Missing fields"
    }
    ```

- fail reponse 3: 400 OTP expired. -> prompt to send new OTP
    ```
    {
        "success": false,
        "error": "OTP expired" | "No OTP found"
    }
    ```

 - fail reponse 4: 400 Wrong OTP
    ```
    {
        "success": false,
        "error": "Wrong OTP"
    }


 - fail reponse 5: 400 weak password
    ```
    {
        "success": false,
        "error": "Wrong OTP"
    }

---






### 6. /auth/delete , method: POST
- works only for testers emails
- delete your email, so that you can use it to create new account.

- request body 
    ```
    {
        "email": "test1@gmail.com",
    }
    ```
 - success response:  200
    ```
    {
        "success": true,
        "count": 1 | 0,
    }
    ```
    - 1 means , 1 user deleted. 0 means there was no account with this email

 - fail reponse 1: 400 non tester email
    ```
    {
        "success": false,
        "error": "Only testers emails are allowed"
    }
    ```


---



