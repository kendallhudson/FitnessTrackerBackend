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

  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`).join(`, `);

  try {

    if (setString.length > 0) {
      const { rows } = await client.query(`
      UPDATE routine_activity
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `, Object.values(fields));

      return rows[0];
    }

  } catch (error) {
    console.log("Error Updating Routine Activity", error)
    throw error
}

async function destroyRoutineActivity(id) {
  console.log("Starting to Destroy Routine Activity ")

  try {
    const { rows } = await client.query(`
    DELETE routine_activity
    FROM routines
    WHERE id=${id}
    `)
    
    return rows;

  } catch (error) {
    console.log("Error Destroying Routine Activity", error)
    throw error
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  console.log("Starting To Edit Routine Activity")

  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`).join(`, `);

  try {

    if(routineActivityId !== userId) {
      console.log ("Error Editing Routine Activity. Not Authorized to Edit This Routine Activity. Try Another")
      return;
    } else {
      const { rows } = await client.query(`
      UPDATE routine_activity
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `, Object.values(fields));

      return rows[0];
    }

  } catch (error) {
    console.log("Error Editing Routine Activity", error)
    throw error
  }
  
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
}}