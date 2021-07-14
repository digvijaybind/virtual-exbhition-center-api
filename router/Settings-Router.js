const express = require('express');
const router=express.Router();
const SettingsController=require('../controller/C-Settings');




router.get('',SettingsController.allowIfLoggedin,SettingsController.grantAccess("readAny","Settings"),SettingsController.get_all_private_settings);

router.patch('/update',SettingsController.allowIfLoggedin,SettingsController.grantAccess("updateAny","Settings"),SettingsController.updatesettings);

//loadbale settings 
router.get('/publicsettings',SettingsController.get_all_settings);

module.exports=router;