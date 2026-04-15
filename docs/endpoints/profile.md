all these endpoints require bearer token in headers. get it from login/signup.

if no valid token is present. they will return this error:
401 
```
{
    "error": "Unauthorized" | 'Token missing' |  'Invalid auth header format'
}
```

you should redirect users to login page, if these error msg is received. 

## 1. /profile/data , method: Get
requires bearer token in headers.

 - use this to fetch profile data.

 - success response:  200
    ```
    {
        "success": true,
        "profile": {
            "id": 6,
            "email": "test@gmail.com",
            "username": "Rahul Samedavar",
            "phone": "9876543210",
            "gender": "male",
            "location": "Bangalore",
            "bio": "CS student",
            "college": "ABC College",
            "department": "CSE",
            "year": 3,
            "theme": "tanjiro",
            "shirt_size": "M",
            "created_at": "2026-04-02T08:45:40.021Z"
        }
    }
    ```

 - fail reponse 1: (400, 401, 404, 500)
    ```
    {
        "error": "Unautherized"
    }
    ```


    if 500 -> its server side error. so it has to be fixed in backend.

    400, 401, 404 -> no login or invalid login. -> redirect to login page.

---

## 2. /profile/update , Method Post
- Auth: Bearer Token required

- Update user profile details.
- Supports partial updates: only send fields you want to change.

- Request Body

```json
{
  "phone": "9876543210",
  "gender": "male",
  "location": "Bangalore",
  "bio": "CS student",
  "college": "ABC College",
  "department": "CSE",
  "year": 3,
  "shirt_size": "M",
  "theme": "Zenitsu"
}
```
   - All fields are optional.


- Success Response: 200
```json
{
  "success": true,
  "profile": {
    "id": 6,
    "email": "test@gmail.com",
    "username": "Rahul Samedavar",
    "phone": "9876543210",
    "gender": "male",
    "location": "Bangalore",
    "bio": "CS student",
    "college": "ABC College",
    "department": "CSE",
    "year": 3,
    "created_at": "2026-04-02T08:45:40.021Z"
  }
}
```

- Fail Response 1: 401 -> not logged in

```json
{
  "error": "Unauthorized"
}
```

- Fail Response 2: 404 -> user not found

```json
{
  "success": false,
  "message": "User not found"
}
```


- Fail Response 3: 500 -> server error

```json
{
  "success": false,
  "error": "Update failed"
}
```