const express = require('express');
const router = express.Router();
const userController = require('../controller/C-User');

router.post('/signup', userController.signup);

router.post('/login',userController.login);

//router.get('/alluser',userController.allowIfLoggedin,userController.grantAccess('readAny','profile'),userController.getallusers);

router.delete('/delete/:UserId',userController.deleteUser);

router.get('/alluser/:Page',userController.getallusers);


router.get('/verify_token',userController.verify_user_token);

module.exports = router;