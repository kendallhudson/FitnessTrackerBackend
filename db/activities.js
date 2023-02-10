const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  console.log("Starting to Create Activities")

  try {
    const { rows: [activity] } = await client.query(`
    INSERT INTO activities (name, description)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `, [name, description]);

    return activity

  } catch(error) {
    console.log("Error Creating Activity", error)
    throw error
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  console.log("Starting to Get All Activities")

  try {
    const { rows: activities } = await client.query(`
    
    SELECT *
    FROM activities;
    `);

    return activities;

  } catch(error) {
    console.log("Error Getting All Activities", error)
    throw error
  }
}

async function getActivityById(activityId) {
  console.log("Starting to Get Activity By Id")

  try {
    const { rows: [activity] } = await client.query(`
    SELECT * 
    FROM activities
    WHERE id=${ activityId };
    `)
   
    return activity;

  } catch(error) {
    console.log("Error Getting Activity By Id", error)
    throw error
  }
}

async function getActivityByName(name) {
  console.log("Starting to Get Activity By Name")

  try {
    const { rows:  [ activity ] } = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1;
    `, [ name ]);

    return activity
  } catch(error) {
    console.log("Error Getting Activity By Name", error)
    throw error
  }
} 

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities

  const routineArray = [...routines];

  const attach = routines.map((routine) => routine.id);

  if(routines.length === 0) {

    return;
  }
  console.log("Starting to Attach Activities to Routines")

  try{
    const { rows: [ activities ] } = await client.query(`
    SELECT activities.*, routine_activies.duration, routine_activies.count, routine_activies.id
    AS "routineActivityId", routine_activities."routineId"
    FROM activities
    JOIN routine_activies 
    ON routine_activies."activityId" = activities.id
    WHERE routine_activities."routineId"
    IN (${attach.map((routineId, index) => ('$' + (index + 1))).join(',')});
    `, attach);

    for (const routine of routineArray) {

      const addActivities = activities.filter((activity) => routine.id === activity.routineId);

      routine.activities = addActivities;
    }

    return routineArray;

  }catch (error){
    console.log("Error Attaching Activities to Routines", error)
    throw error
  }
}

async function updateActivity({ id, ...fields }) {
  console.log("Starting To Update Activity")
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`).join(`, `);

  try {

    if (setString.length > 0) {
      const { rows } = await client.query(`
      UPDATE activity
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `, Object.values(fields));

      return rows[0];
    }

  } catch (error) {
    console.log("Error Updating Activity", error)
    throw error
} 

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}}