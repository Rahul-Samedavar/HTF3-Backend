all these endpoints require bearer token in headers. get it from login/signup.

if no valid token is present. they will return this error:
401 
```
{
    "error": "Unauthorized" | 'Token missing' |  'Invalid auth header format'
}
```

you should redirect users to login page, if these error msg is received. 

## 1. /team/create , method: POST
- use for creating team. 

- request body 
    ```
    {
        "teamName": "DevBytes"
    }
    ```

 - success response:  200
    ```
    {
        "teamID": 1
    }
    ```

 - fail reponse 1: 400 Bad Request
    ```
    {
        "error": "Team name missing" | "Incomplete Profile" | "Team name too short" | "Team Name Taken" | "Already in a Team"
    }
    ```


 - fail reponse 2: 401 token related issues (not logged in ) -> redirect to login pageg
    ```
    {
        "error": "Unauthorized" | 'Token missing' |  'Invalid auth header format'
    }
    ```

- fail response 3: 500 - internal server error
    ```
    {
        "success": false,
        "error": "Internal Server Error"
    }
    ```


    
---
## 2. /team/join , method: POST
- use for joining a team
- return 200 if success


- request body 
    ```
    {
    "teamCode": "K70WMP"
    }
    ```

 - success response:  200
    ```
    {
        "teamID": 1
    }
    ```

 - fail reponse 1: 400 failed
    ```
    {
        "error": "Already in a Team" | "Team Doesn't Exist"| "Team full"  ||"Incomplete Profile"
    }
    ```
- 

- fail response 2: 401 -> invalid user -> clear token and redirect to login
    ```
    {
        "error": "Unauthorized" | 'Token missing' |  'Invalid auth header format'
    }
    ```

- fail response 4: 500 - internal server error
    ```
    {
    "success": false,
    "error": "Internal Server Error"
    }
    ```
    



## 3. /team/details , method: GET
- returns 200 and details if alreay in team. 
- returns 404 if not in team. so show the team create/join UI
- returns 500 if internal server error.
- returns 400 / 401 if not loggedin - > very imp -> redirect to loggin page

 - success response:  200
    ```
    {
        "id": 2,
        "name": "DevBytesa",
        "code": "K70WMP",
        "leader_id": 6,
        "created_at": "2026-04-03T08:02:43.026Z",
        "members": [
            {
            "id": 6,
            "username": "Rahul Samedavar",
            "email": "test@gmail.com",
            "college": "ABC College",
            "department": "CSE",
            "year": 3,
            "theme": "tanjiro",
            "shirt_size": "M"
            }
        ]
    }
    ```

 - fail reponse 1: 404 not in team
    ```
    {
        "error": "Not in any Team"
    }
    ```

- fail response 2: 401 - invalid token. clear token and redirect to login
    ```
    {
        "error": "Unauthorized"
    }
    ```

- fail response 3: 401 - no token (not logged in). redirect to login
    ```
    {
        "error": "Unauthorized" | 'Token missing' |  'Invalid auth header format'
    }
    ```

- fail response 4: 500 - internal server error
    ```
    {
    "success": false,
    "error": "Internal Server Error"
    }
    ```


    

---



## 4. /team/:teamCode , method: GET
- example /team/K70WMP
- fetch details of team from teamCode
- returns 200 and details if team exists. 
- returns 400 if no team exists with this code.
- returns 500 if internal server error.
- returns 401 if not loggedin - > very imp -> redirect to loggin page

 - success response:  200
    ```
    {
        "id": 2,
        "name": "DevBytesa",
        "code": "K70WMP",
        "leader_id": 6,
        "created_at": "2026-04-03T08:02:43.026Z",
        "members": [
            {
            "id": 6,
            "username": "Rahul Samedavar",
            "email": "test@gmail.com",
            "college": "ABC College",
            "department": "CSE",
            "year": 3,
            "theme": "tanjiro",
            "shirt_size": "M"
            }
        ]
    }
    ```

 - fail reponse 1: 400 not in team
    ```
    {
    "error": "Not a valid team Code"
    }
    ```

- fail response 2: 401 - invalid token. clear token and redirect to login
    ```
    {
        "error": "Unauthorized"
    }
    ```

- fail response 3: 401 - no token (not logged in). redirect to login
    ```
    {
        "error": "Unauthorized" | 'Token missing' |  'Invalid auth header format'
    }
    ```
    ```

- fail response 4: 500 - internal server error
    ```
    {
    "success": false,
    "error": "Internal Server Error"
    }
    ```



