const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const { rows: [activity] } = await client.query(`
    INSERT INTO activities (name, description)
    VALUES ($1, $2)
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
  try {
    const { rows: activityIds } = await client.query(`
    
    SELECT id
    FROM activities;
    `);

    const activities = await Promise.all(activityIds.map(
      post => getActivityById(post.id)
    ));

    return activities

  } catch(error) {
    console.log("Error Getting All Activities", error)
    throw error
  }
}

async function getActivityById(id) {
  try {

  } catch(error) {
    console.log("Error Getting Activity By Id", error)
    throw error
  }
}

async function getActivityByName(name) {}

async function attachActivitiesToRoutines(routines) {
  // select and return an array of all activities
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
