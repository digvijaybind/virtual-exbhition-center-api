const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/C-Category');



router.get('',CategoryController.get_all_category);

router.post('',CategoryController.allowIfLoggedin,CategoryController.grantAccess('createAny','category'),CategoryController.create_category);

router.delete('/:categoryID',CategoryController.allowIfLoggedin,CategoryController.grantAccess('deleteAny','category'),CategoryController.deleate_single_category);

router.patch('/:categoryID',CategoryController.allowIfLoggedin,CategoryController.grantAccess('updateAny','category'),CategoryController.update_category);


module.exports = router;