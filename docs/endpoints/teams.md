1. /team/create , method: POST
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
        "error": "Team name missing"
    }
    ```

- fail response 2: 400 - short team namee
    ```
    {
        "error": "Team name too short"
    }
    ```

- fail response 3: 400 - team name taken
    ```
    {
        "error": "Team Name Taken"
    }
    ```


- fail response 2: 400 - already in a team
    ```
    {
        "error": "Already in a Team"
    }
    ```

- fail response 2: 500 - internal server error
    ```
    {
        "success": false,
        "error": "Internal Server Error"
    }
    ```


    

1. /team/join , method: POST
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
        "error": "Already in a Team" | "Team Doesn't Exist"| "Team full"
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
    



1. /team/details , method: GET
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
            "year": 3
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

- fail response 2: 400 - invalid token. clear token and redirect to login
    ```
    {
        "error": "Unauthorized"
    }
    ```

- fail response 3: 401 - no token (not logged in). redirect to login
    ```
    {
        "error": "Token missing"
    }
    ```

- fail response 4: 500 - internal server error
    ```
    {
    "success": false,
    "error": "Internal Server Error"
    }
    ```


    