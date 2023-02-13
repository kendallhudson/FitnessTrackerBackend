const express = require('express');
const router = express.Router();

const { 
    createActivity,
    getAllActivities
 } = require("../db");

function requireUser(req, res, next) {
    if (!req.user) {
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
      });
    }
  
    next();
  }
  
  module.exports = {
    requireUser
  }


// GET /api/activities/:activityId/routines

// GET /api/activities
router.use((req, res, next) => {
    console.log("A request is being made to /activities");
  
    next(); 
  });
  
router.get("/", async (req, res) => {
    const activities = await getAllActivities();
   
    res.send({
      activities,
    });
  });
// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
