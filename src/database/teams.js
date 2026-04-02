import { pool } from "./db";

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