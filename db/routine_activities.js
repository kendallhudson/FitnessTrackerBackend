const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  console.log("Starting to Add Activity to Routine")
  try {
  const { rows: [ routine_activity ] } = await client.query(`
  INSERT INTO routines ("routineId", "activityId", count, duration)
  VALUES ($1, $2, $3, $4)
  ON CONFLICT ("routineId", "activityId") DO NOTHING
  RETURNING *;
  `, [ routineId, activityId, count, duration ])

  return routine_activity

  } catch (error) {
    console.log("Error Adding Activity", error)
    throw error;
  }
}

async function getRoutineActivityById(id) {
  console.log("Starting to Get Routine Activity By Id")

  try{ 
    const { rows: [ routine_activity ] } = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE id = $1;
    `, [ id ]);

    return routine_activity


  } catch (error) {
    console.log("Error Getting Routine Activity By Id", error)
    throw error
  }
}
  

  

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
