const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    console.log("Creating USERS to use")
    const { rows: [user] } = await client.query(`
      INSERT INTO users (username, password)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `, [username, password]);

    return user;

  } catch (error) {
    console.log("Error Creating USERS", error)
    throw error
  }
}

async function getUser({ username, password }) {

}

async function getUserById(id) {
  try {
    console.log("Getting User By Id")
    const { rows: [ user ] } = await client.query(`
      SELECT *
      FROM users
      WHERE id=${ id }
    `);

    if (!user) {
      return null
    } else {
      delete user.password;
      return user;
    }
    
  } catch (error) {
    console.log("Error Trying to Get User By Id")
    throw error;
  }

}

async function getUserByUsername(userName) {
  try {
    console.log("Getting User By Username")
    const { rows: [ user ] } = await client.query(`
      SELECT * 
      FROM username
      WHERE user=${ user }
    `)
  } catch (error) {
    console.log("Error Getting User By Username")
    throw error;
  }

  // MY ATTEMPT - START ----------------------------------------------->
  // try {
  //   console.log("Getting User By Username")
  //   const { rows: [ user ] } = await client.query(`
  //     SELECT * 
  //     FROM users
  //     WHERE username=$1
  //   `)
  // } catch (error) {
  //   console.log("Error Getting User By Username")
  //   throw error;
  // }
  // MY ATTEMPT - END ------------------------------------------------->
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
