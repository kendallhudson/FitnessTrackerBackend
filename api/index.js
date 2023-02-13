const express = require('express');
const router = express.Router();

const { getUserById } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// GET /api/health
router.get('/health', async (req, res, next) => {
    console.log("Port is healthy and running on Port 3000")
});

router.use(async (req, res, next) => {
    const prefix = 'Bearer';

    const auth = req.header('Authorization');

    if (!auth) {
    next(); 
    } else if (auth.startsWith(prefix)) {

      const token = auth.slice(prefix.length);

      try {

        const parsedToken = jwt.verify(token, JWT_SECRET);

        const id = parsedToken && parsedToken.id

        if (id) {

          req.user = await getUserById(id);
          next();
        }

      } catch (error) {

        next(error);
      }

    } else {

      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${ prefix }`
      });

    }
    
  });

  router.use((req, res, next) => {
    if (req.user) {
        // console.log("User is set:", req.user);
        console.log("User is set");
    }

    next();
});

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

module.exports = router;
