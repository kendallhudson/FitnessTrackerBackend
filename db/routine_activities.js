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
  INSERT INTO routine_activities ("routineId", "activityId", count, duration)
  VALUES ($1, $2, $3, $4)
  ON CONFLICT ("routineId", "activityId") DO NOTHING
  RETURNING *;
  `, [ routineId, activityId, count, duration ])

  return routine_activity

  } catch (error) {
    console.log("Error Adding Activity to Routine", error)
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

async function getRoutineActivitiesByRoutine({ id }) {
  console.log("Starting to Get Routine Activities By Routine")

  try{ 
    const { rows: [ routine_activity ] } = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE routineId = $1;
    `, [ id ]);

    return routine_activity

  } catch (error) {
    console.log("Error Getting Routine Activity By Routine", error)
    throw error
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  console.log("Starting To Update Routine Activity")

  const indexString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`).join(`, `);

  try {

      const { rows: [ routine_activity ] } = await client.query(`
      UPDATE routine_activities
      SET ${indexString}
      WHERE id=${id}
      RETURNING *;
      `, Object.values(fields));

      return routine_activity;

    } catch (error) {
      console.log("Error Updating Routine Activity", error)
      throw error
}

async function destroyRoutineActivity(id) {
  console.log("Starting to Destroy Routine Activity ")

  try {
    const { rows: [ routine_activity ] } = await client.query(`
    DELETE routine_activities
    WHERE id=$1
    RETURNING *;
    `, [ id ]);
    
    return routine_activity;

  } catch (error) {
    console.log("Error Destroying Routine Activity", error)
    throw error
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  console.log("Starting To Edit Routine Activity")

  try {

      const { rows: [ routine_activities ] } = await client.query(`
      SELECT *
      FROM routine_activities
      JOIN routines ON routine_activities."routineId" = routines.id
      WHERE "creatorId" =${userId}
      AND routine_activities.id = ${routineActivityId};
      `);

      return routine_activities;
    } catch (error) {
      console.log("Error Editing Routine Activity", error)
      throw error
    }
  }
}


module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};