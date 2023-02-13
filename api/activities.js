const express = require('express');
const router = express.Router();

const { requireUser } = require("./utils");

const { 
    createActivity,
    getAllActivities,
    getPublicRoutinesByActivity
 } = require("../db");


// GET /api/activities/:activityId/routines
router.use((req, res, next) => {
    console.log("A request is being made to /activities/:activityId/routines");
  
    next(); 
  });
  
router.get("/activities/:activityId/routines", async (req, res) => {
    const activities = await getPublicRoutinesByActivity();
   
    res.send({
      activities,
    });
  });

// GET /api/activities
router.use((req, res, next) => {
    console.log("A request is being made to /activities");
  
    next(); 
  });
  
router.get("/activities", async (req, res) => {
    const activities = await getAllActivities();
   
    res.send({
      activities,
    });
  });

// POST /api/activities
router.post("/activities", requireUser, async (req, res, next) => {

    const { name, description } = req.body;
  
    try {
      
      const activities = await createActivity(name, description);
      // this will create the activity for us
  
      if (activities) {
        res.send(activities);
        // if the activity comes back, res.send({ activity });
  
      } else {
        next({
          name: 'ActivityDataError',
          message: `Activity not created properly`
        });
        // otherwise, next an appropriate error object
      }
  
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

// PATCH /api/activities/:activityId

module.exports = router;
