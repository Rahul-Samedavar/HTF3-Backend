import { pool } from "./db.js";


// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     email TEXT UNIQUE NOT NULL,
//     password_hash TEXT NOT NULL,
//     username TEXT NOT NULL,
//     phone TEXT,
//     gender TEXT,
//     location TEXT,
//     bio TEXT,
//     college TEXT,
//     department TEXT,
//     year INTEGER,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- TEAMS
// CREATE TABLE teams (
//     id SERIAL PRIMARY KEY,
//     name TEXT NOT NULL,
//     leader_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- TEAM MEMBERS
// CREATE TABLE team_members (
//     id SERIAL PRIMARY KEY,
//     team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//     UNIQUE(team_id, user_id)
// );


// CREATE TABLE submissions (
//     id SERIAL PRIMARY KEY,
//     team_id INTEGER UNIQUE REFERENCES teams(id) ON DELETE CASCADE,
//     track_id INTEGER CHECK (track_id BETWEEN 1 AND 3),
//     problem_statement_id INTEGER CHECK (problem_statement_id BETWEEN 1 AND 4),
//     ppt_drive_link TEXT,
//     demo_link TEXT,
//     idea_title TEXT NOT NULL,
//     description TEXT,
//     submitted_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

export async function addSubmission(team_id, track_id, problem_statement_id, ppt_drive_link, demo_link, idea_title, description) {
    try {


        if (!demo_link) demo_link = "not uploaded";

        if (track_id < 1 || track_id > 3)  return { success: false, error: "Invalid track"};
        if (problem_statement_id < 1 || problem_statement_id > 4)  return { success: false, error: "Invalid problem statement"};

        const query = `
            INSERT INTO submissions 
            (team_id, track_id, problem_statement_id, ppt_drive_link, demo_link, idea_title, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const values = [
            team_id,
            track_id,
            problem_statement_id,
            ppt_drive_link,
            demo_link, 
            idea_title,
            description
        ];

        const { rows } = await pool.query(query, values);

        return { success: true, submission: rows[0] };

    } catch (err) {

        if (err.code === "23505") {
            return { success: false, error: "Submission already exists for this team" };
        }
        console.error("Error saving submission..", err);

        return { success: false, error: "internal server error" };
    }
}


export async function getSubmissions(team_id) {
    try {
        const query = `
            SELECT * FROM submissions
            WHERE team_id = $1;
        `;

        const { rows } = await pool.query(query, [team_id]);

        if (rows.length === 0) {
            return { success: false, error: "No submission found" };
        }

        return { success: true, submission: rows[0] };

    } catch (err) {
        console.error("Error fetching submission..", err);
        return { success: false, error: "internal server error" };
    }
}


export async function updateSubmission(team_id, update) {
    try {
        const fields = [];
        const values = [];
        let index = 1;

        for (const key in update) {
            if(update[key]){
                fields.push(`${key} = $${index}`);
                values.push(update[key]);
                index++;
            }
        }

        if (fields.length === 0) {
            return { success: false, error: "No fields to update" };
        }

        const query = `
            UPDATE submissions
            SET ${fields.join(", ")}
            WHERE team_id = $${index}
            RETURNING *;
        `;

        values.push(team_id);

        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return { success: false, error: "Submission not found" };
        }

        return { success: true, submission: rows[0] };

    } catch (err) {
        console.error("Error updating submission..", err);
        return { success: false, error: "internal server error" };
    }
}


export async function getAllSubmissions() {
    try {
        const query = `
            SELECT 
                s.*,
                t.name AS team_name,
                t.leader_id
            FROM submissions s
            JOIN teams t ON s.team_id = t.id
            ORDER BY s.submitted_on DESC;
        `;

        const { rows } = await pool.query(query);

        return { success: true, submissions: rows };

    } catch (err) {
        console.error("Error fetching all submissions..", err);
        return { success: false, error: "internal server error" };
    }
}




export async function deleteSubmission(teamID) {
  try{
    const result = await pool.query(
        "DELETE FROM submissions WHERE  team_id =$1;",
        [teamID]
    );

    return {success: true, count: result.rowCount}

    }
    catch(err){
        console.error("Error Deleting Submission", err);
        return {"success": false, error: `Internal Server Errror: ${err}`}
    }
}


