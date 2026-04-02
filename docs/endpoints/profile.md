1. /profile/data , method: Get
requires bearer token in headers.

 - use this to fetch profile data.

 - success response:  200
    ```
    {
    "success": true,
    "profile": {
        "username": "Rahul Samedavar",
        "phone": null,
        "gender": null,
        "location": null,
        "bio": null,
        "college": null,
        "department": null,
        "year": null,
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