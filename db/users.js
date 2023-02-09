const client = require("./client");
const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    console.log("Creating USERS to use")

    const { rows: [user] } = await client.query(`
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING id, username;
    `, [username, hashedPassword]);

    return user;

  } catch (error) {
    console.log("Error Creating User", error)
    throw error
  }
}

async function getUser({ username, password }) {
  if(!username || !password) return

  try {
    console.log("Getting Users to Use")

    const user = await getUserByUsername(username);

    const hashedPassword = user.password;

    const passwordsMatch = await bcrypt.compare(password, hashedPassword);

    if(passwordsMatch) {
      delete user.password

      return user;
    } else {

      return null;
    }

  } catch (error) {
    console.log("Error Getting Users or User", error)
    throw error
  }

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

async function getUserByUsername(username) {

  try {
    console.log("Getting User By Username")
    const { rows: [ user ] } = await client.query(`
      SELECT * 
      FROM users
      WHERE username=$1
    `, [ username ]);
    return user;
  } catch (error) {
    console.log("Error Getting User By Username")
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
