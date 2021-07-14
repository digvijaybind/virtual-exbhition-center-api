const express = require('express');
const router = express.Router();
const pollcontroller=require('../controller/C-Poll')



//add all the condition for the admin and api access


//for admin get all the polls
router.get('',pollcontroller.get_all_poll);

//for admin , organizer exhibitor   // get the user id from the jwt token and stall id from the params 
router.post('/:Stall_ID',pollcontroller.allowIfLoggedin,pollcontroller.create_poll)

//for admin get any polls
router.get('/:PollId',pollcontroller.get_single_poll)


//polls for the 






module.exports = router;