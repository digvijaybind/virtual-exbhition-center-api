const express = require('express');
const router = express.Router();
const EventController = require('../controller/C-Event');

router.post('/new_event',EventController.allowIfLoggedin,EventController.grantAccess('createOwn','Event'),EventController.create_new_event );



//check referal link to decide if exhibitoor can register or not 
router.get('/org-ref-link/:tokenID',EventController.check_exhibitor_ref_link);



//allow the user to register

router.post('/org-ref-registor/:regtoken',EventController.reg_exb_link);



//get all the events for admins 
router.get('/allevents/:Page',EventController.getallevents);


//get any event details only for admin /-

router.get('/singleevent/:EventId',EventController.getanyeventdata);



//organizer can only read own events trought jwt token
router.get('/organizer-events',EventController.allowIfLoggedin,EventController.grantAccess('readOwn','Event'),EventController.get_organizer_event_list)


//organizer can only get details of itw own events



//bridge event data to show exhibitor list

router.get('/event-bridge/:EventId',EventController.bridgedeventexhibitordata)

module.exports = router;