const express = require('express');
const router = express.Router();

const TempStallController=require('../controller/C-Tempstalls')


//get all the stalls api
router.get('/',TempStallController.get_all_stall);



//get single stall for adim


router.get('/:SID',TempStallController.get_all_sinlge_admin)


//update any stall admin

router.post('/addnew',TempStallController.add_new_stall_admin)


//deleate any stall admin

router.delete("/:SID",TempStallController.delete_Any_stall)

//get all of users stalls



//users delete only his stalls

//user update only his stalls

//user create stalls only for him




//public api

router.get('/public-api/all-stall',TempStallController.get_all_stall_public)


//get a single stall for public apiu 


router.get('/public-api/all-stall/:SID',TempStallController.get_single_stall_public)

module.exports = router;