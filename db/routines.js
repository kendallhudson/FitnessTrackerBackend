const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  console.log("Starting to Create Routine")

  try {
    const { rows:  routine  } = await client.query(`
    INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (creatorId) DO NOTHING
    RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return routine

  } catch (error) {
    console.log("Error Creating Routine", error)
    throw error
  }
}

async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {}

async function getAllRoutines() {
  console.log("Starting to Get All Routines")

  try{
    const { rows: [ routines ] } = await client.query(`
      SELECT *
      FROM routines
    `)

    return routines

  } catch (error) {
    console.log("Error Getting All Routines", error)
    throw error
  }
}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

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
