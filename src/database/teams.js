import { pool } from "./db.js";
import { getTeamCode } from "../utils/coder.js";

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

async function getClient() {
  return await pool.connect();
}

// returns  {success, error?, teamID?}
export async function createTeam(userID, teamName) {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const nameCheck = await client.query(
      `SELECT id FROM teams WHERE LOWER(name) = LOWER($1)`,
      [teamName]
    );

    if (nameCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return {success: false, error:"Team Name Taken"};
    }

    const teamCheck = await client.query(
      `SELECT id FROM team_members WHERE user_id = $1`,
      [userID]
    );

    if (teamCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return {success: false, error:"Already in a Team"}
    }

    const teamRes = await client.query(
      `INSERT INTO teams (name, leader_id) VALUES ($1, $2) RETURNING id`,
      [teamName, userID]
    );

    const teamID = teamRes.rows[0].id;

    await client.query(
      `INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)`,
      [teamID, userID]
    );

    await client.query("COMMIT");
    return {success: true, teamID};
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// return {succes, error?}
// checks for these rules: 1 user 1 team and a team max 4 users.
// uses lock. to prevent race condition
export async function joinTeam(userID, teamID) {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    // lock
    const teamRes = await client.query(
      `SELECT id FROM teams WHERE id = $1 FOR UPDATE`,
      [teamID]
    );

    if (teamRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return {success: false, error: "Team Doesn't Exist"};
    }

    const userCheck = await client.query(
      `SELECT id FROM team_members WHERE user_id = $1`,
      [userID]
    );

    if (userCheck.rows.length > 0) {
      await client.query("ROLLBACK");
      return {success: false, error: "Already in a Team"}
    }

    // count members with lock
    const countRes = await client.query(
      `SELECT COUNT(*) FROM team_members WHERE team_id = $1`,
      [teamID]
    );

    const count = parseInt(countRes.rows[0].count, 10);

    if (count >= 4) {
      await client.query("ROLLBACK");
      return {success: false, error: "Team Full"}
    }

    await client.query(
      `INSERT INTO team_members (team_id, user_id) VALUES ($1, $2)`,
      [teamID, userID]
    );

    await client.query("COMMIT");
    return {success: true};
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// returns undefined if not found
export async function getTeamDetails(teamID) {
  const res = await pool.query(
    `SELECT 
        t.id AS team_id,
        t.name AS team_name,
        t.leader_id,
        t.created_at,

        u.id AS user_id,
        u.username,
        u.email,
        u.college,
        u.department,
        u.year

     FROM teams t
     LEFT JOIN team_members tm ON t.id = tm.team_id
     LEFT JOIN users u ON tm.user_id = u.id
     WHERE t.id = $1`,
    [teamID]
  );

  if (res.rows.length === 0) return undefined;

  const team = {
    id: res.rows[0].team_id,
    name: res.rows[0].team_name,
    code: getTeamCode( res.rows[0].team_id),
    leader_id: res.rows[0].leader_id,
    created_at: res.rows[0].created_at,
    members: res.rows
      .filter(r => r.user_id !== null)
      .map(r => ({
        id: r.user_id,
        username: r.username,
        email: r.email,
        college: r.college,
        department: r.department,
        year: r.year
      })),
  };

  return team;
}


// returns undefined if not found
export async function getTeamOf(userID) {
  const res = await pool.query(
    `SELECT 
        t.id AS team_id,
        t.name AS team_name,
        t.leader_id,
        t.created_at,

        u.id AS user_id,
        u.username,
        u.email,
        u.college,
        u.department,
        u.year

     FROM teams t
     JOIN team_members tm ON t.id = tm.team_id
     JOIN users u ON tm.user_id = u.id
     WHERE t.id = (
        SELECT team_id FROM team_members WHERE user_id = $1
     )`,
    [userID]
  );

  if (res.rows.length === 0) return undefined;

  const team = {
    id: res.rows[0].team_id,
    name: res.rows[0].team_name,
    code: getTeamCode( res.rows[0].team_id),
    leader_id: res.rows[0].leader_id,
    created_at: res.rows[0].created_at,
    members: res.rows.map(r => ({
      id: r.user_id,
      username: r.username,
      email: r.email,
      college: r.college,
      department: r.department,
      year: r.year
    })),
  };

  return team;
}


// can remove only if userID belongs to leaderIDs team. also returns true if success
export async function removeFromTeam(userID, leaderID) {
  const client = await getClient();

  try {
    await client.query("BEGIN");

    const teamRes = await client.query(
      `SELECT id FROM teams WHERE leader_id = $1`,
      [leaderID]
    );

    if (teamRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return {success: false, error: "You are not a leader"};
    }

    const teamID = teamRes.rows[0].id;

    if (userID === leaderID) {
      await client.query("ROLLBACK");
      return {success: false, error: "Leader cannot leave team."}
    }

    const deleteRes = await client.query(
      `DELETE FROM team_members
       WHERE team_id = $1 AND user_id = $2`,
      [teamID, userID]
    );

    await client.query("COMMIT");

    if (deleteRes.rowCount)
      return {success: true}
    else
      return {success: false, error: "Not part of the Team"}

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}