const client = require("./client");
const bcrypt = require("bcrypt");
// database functions

// user functions
async function createUser({ username, password }) {
  try {
    console.log("Creating USERS to use")
  } catch (error) {

  }
}

async function getUserById(userId) {
  try {
    console.log("Getting User By ID")
    const { rows: [ user ]} = await client.query(`
    SELECT *
    FROM users
    WHERE id=${id}
    `);

  if (!user) {
    return null
  } else {
    delete user.password;
    return user;
  }
} catch (error) {
  console.log("Error Getting User by ID")
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
  console.log("Error Getting User by Username")
  throw error;
  }

}

async function getUser({ username, password }) {
  try {
    getUserById;
    const checkUser = await getUserByUsername(username);
    const hashedPassword = checkUser.password;
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (isValid) {
      const {
        rows: [user],
      } = await client.query(`
      SELECT id, username
      FROM users
      WHERE username=$1 AND password=$2;
      `, [username, hashedPassword]);

      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error getting user");
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
