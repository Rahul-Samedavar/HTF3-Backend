all these endpoints require bearer token in headers. get it from login/signup.

if no valid token is present. they will return this error:
401 
```
{
    "error": "Unauthorized" | 'Token missing' |  'Invalid auth header format'
}
```

you should redirect users to login page, if these error msg is received. 


### Rate limitingg

NOTE: /add and /update endpoints have rate limitter.
- For each of those you can send upto 10 requests per 10 minute.
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


## 1. submissions/add , method: POST
 - used for submission
 - request body
  ```
  {
      "track_id": 1,
      "ps_id": 2,
      "ppt_drive_link": "https://drive.google.com/file/d/1fnOKJilpNLt_N_QEND9_SU96ZyJaRzDu",
      "demo_link": "https://youtu.be/iik25wqIuFo?si=4uEsAWXNG2spDZSL",
      "title": "HackToFutureeeeeeeeeeeee",
      "description": "THis is very good project. Please shortlist me !!!!!!!!"
  }
  ```

 - success response:  200
    ```
    {
      "success": true,
      "submission": {
        "id": 5,
        "team_id": 2,
        "track_id": 1,
        "problem_statement_id": 2,
        "ppt_drive_link": "https://drive.google.com/file/d/1fnOKJilpNLt_N_QEND9_SU96ZyJaRzDu",
        "demo_link": "https://youtu.be/iik25wqIuFo?si=4uEsAWXNG2spDZSL",
        "idea_title": "HackToFutureeeeeeeeeeeee",
        "description": "THis is very good project. Please shortlist me !!!!",
        "submitted_on": "2026-04-05T03:05:59.885Z"
      }
    }
    ```

 - fail reponse 1: (401) -> redirect to login
    ```
    {
        "error":"Unauthorized" | 'Token missing' |  'Invalid auth header format'
    }
    ```
 - fail reponse 2: (400) -> missing fields
    ```
    {
        "error":"missing fields'
    }
    ```

 - fail reponse 3: (400) -> not in any team
    ```
    {
        "error":"User not in any Team"
    }
    ```

 - fail reponse 4: (400) -> already submites
    ```
    {
        "error":"Submission already exists for this team"
    }
    ```

    if 500 -> its server side error. so it has to be fixed in backend.

---


## 2. submissions/data , method: GET
 - used for viewing  submission

 - success response:  200
    ```
    {
      "success": true,
      "submission": {
        "id": 5,
        "team_id": 2,
        "track_id": 1,
        "problem_statement_id": 2,
        "ppt_drive_link": "https://drive.google.com/file/d/1fnOKJilpNLt_N_QEND9_SU96ZyJaRzDu/view?usp=sharing",
        "demo_link": "https://youtu.be/iik25wqIuFo?si=4uEsAWXNG2spDZSL",
        "idea_title": "HackToFutureeeeeeeeeeeee",
        "description": "THis is very good project. Please shortlist me !!!!!!!!!!!!!!!!!!!!!!!",
        "submitted_on": "2026-04-05T03:05:59.885Z"
      }
    }
    ```

 - fail reponse 1: (401) -> redirect to login
    ```
    {
        "error":"Unauthorized" | 'Token missing' |  'Invalid auth header format'
    }
    ```

 - fail reponse 2: (400) -> missing fields
    ```
    {
        "error":"missing fields'
    }
    ```

 - fail reponse 3: (400) -> not in any team
    ```
    {
        "error":"User not in any Team"
    }
    ```

 - fail reponse 4: (400) -> not yet submitted
    ```
    {
        "error":""No submission found""
    }
    ```

---


## 3. submissions/update , method: POST
 - used for updating  submission
 - supports partial update. send only the fields that can be updated.
 - only ppt_drive_link, demo_link, title and description supported
 - request body
 ```
  {
    "title": "HackToFuture",
    "description": "THis is very good project. May be"
  }

 ```
 - success response:  200
    ```
    {
      "success": true,
      "submission": {
        "id": 5,
        "team_id": 2,
        "track_id": 1,
        "problem_statement_id": 2,
        "ppt_drive_link": "https://drive.google.com/file/d/1fnOKJilpNLt_N_QEND9_SU96ZyJaRzDu/view?usp=sharing",
        "demo_link": "https://youtu.be/iik25wqIuFo?si=4uEsAWXNG2spDZSL",
        "idea_title": "HackToFuture",
        "description": "THis is very good project. May be",
        "submitted_on": "2026-04-05T03:05:59.885Z"
      }
    }
    ```

 - fail reponse 1: (401) -> redirect to login
    ```
    {
        "error":"Unauthorized" | 'Token missing' |  'Invalid auth header format'
    }
    ```

 - fail reponse 2: (400) -> missing fields
    ```
    {
        "error":"No fields to update"
    }
    ```

 - fail reponse 3: (400) -> not in any team
    ```
    {
        "error":"User not in any Team"
    }
    ```

 - fail reponse 4: (400) -> not yet submitted
    ```
    {
        "error":"Submission not found"
    }
    ```

---