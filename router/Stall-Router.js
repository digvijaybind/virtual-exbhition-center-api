const express = require('express');
const router = express.Router();

const StallController=require('../controller/C-Stalls')



router.get('',StallController.allowIfLoggedin,StallController.grantAccess('readAny','Stall'),StallController.get_all_stall);



module.exports = router;