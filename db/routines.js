const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  console.log("Starting to Create Routine")

  try {
    const { rows: [ routine ] } = await client.query(`
    INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `, [ creatorId, isPublic, name, goal ]);

    return routine

  } catch (error) {
    console.log("Error Creating Routine", error)
    throw error
  }
}

async function getRoutineById(id) {
  console.log("Starting to Get Routine By Id")

  try {
    const { rows:  routine  } = await client.query(`
    SELECT *
    FROM routines
    WHERE routines.id=$1
    `, [ id ]);

    return routine

  } catch (error) {
    console.log("Error Getting Routine By Id", error)
    throw error
  }
}

async function getRoutinesWithoutActivities() {

  console.log("Starting to Get Routines Without Activities")

  try {
    const { rows:  routines  } = await client.query(`
    SELECT *
    FROM routines
    `);

    return routines

  } catch (error) {
    console.log("Error Getting Routines Without Activities", error)
    throw error
  }
}

async function getAllRoutines() {
  console.log("Starting to Get All Routines")

  try{
    const { rows: [ routines ] } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId"=users.id
    `)

    return attachActivitiesToRoutines(routines)

  } catch (error) {
    console.log("Error Getting All Routines", error)
    throw error
  }
}

async function getAllPublicRoutines() {
  console.log("Starting to Get All Public Routines")

  try{
    const { rows: [ routines ] } = await client.query(`
      SELECT routines
      FROM routines
      WHERE isPublic = True
      RETURNING *;
    `)

    return routines;

  } catch (error) {
    console.log("Error Getting All Public Routines", error)
    throw error
  }
}

async function getAllRoutinesByUser({ username }) {
  console.log("Starting to Get All Routines By User")

  try {
    const { rows: routines } = await client.query(`
    SELECT *
    FROM routines
    WHERE routines.username=${username}
    `, [ username ]);

    return routines
    
  } catch (error) {
    console.log("Error Getting All Routines By User", error)
    throw error
  }
}

async function getPublicRoutinesByUser({ username }) {
  console.log("Starting to Get Public Routines By User")

  try {
    const { rows: routines } = await client.query(`
    SELECT *
    FROM routines
    WHERE isPublic = TRUE
    JOIN users ON routines."creatorId"=users.id
    `, [username])

    return routines

  } catch (error) {
    console.log("Error Getting Public Routines By User", error)
    throw error
  }
}

async function getPublicRoutinesByActivity({ id }) {
  console.log("Starting to Get Public Routines By Activity")

  try {
    const { rows: routines } = await client.query(`
    SELECT *
    FROM routines
    WHERE isPublic = TRUE
    JOIN users ON routines."creatorId"=users.id
    `, [id])

    return routines

  } catch (error) {
    console.log("Error Getting Public Routines By Activity", error)
    throw error
  }

}

async function updateRoutine({ id, ...fields }) {
  console.log("Starting to Update Routine ")

  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`).join(`, `);

  try {
    
    if (setString.length > 0) {
      const { rows } = await client.query(`
    UPDATE routine
    SET ${setString}
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields));

    return rows[0];
    }
    
  } catch (error) {
    console.log("Error Updating Routine", error)
    throw error
  }
}

async function destroyRoutine(id) {
  console.log("Starting to Destroy Routine ")

  try {
    const { rows } = await client.query(`
    DELETE routine, routine_activity
    FROM routines
    WHERE id=${id}
    `)
    
    return rows;

  } catch (error) {
    console.log("Error Destroying Routine", error)
    throw error
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
