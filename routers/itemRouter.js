const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const validateLogging = require('../middleware/validateLogging');
const validateItem = require('../middleware/validateItem');
const validateRole = require('../middleware/validateRole');
const validateCat = require('../middleware/validateCat');


router.post('/',
    validateLogging.isLoggedIn,
    validateItem.validateItems(),
    validateItem.validateRequest,
    itemController.itemObj,
    itemController.itemAdd);

router.put('/image/:id',
    validateLogging.isLoggedIn,
    validateRole(['o']),
    itemController.addImage);

router.put('/:id',
    validateLogging.isLoggedIn,
    validateRole(['o']),
    itemController.itemUpdate);

router.get('/NearMe',
    validateLogging.isLoggedIn,
    itemController.itemNearME);


router.delete('/delete/:id', validateLogging.isLoggedIn, itemController.itemDelete);

router.get('/filterRange/:way/:min/:max',
    validateItem.identifyPriceWayAndValidate,
    itemController.filterByMinMax)

// the order between two endpoints matters
router.get('/:catId/list/search',itemController.searchItemByName);
router.get('/:catId/list/:idItem',itemController.getItemByIds);

router.get('/:catID/list/ava/:availability', validateItem.identifyAvailabilityAndValidate, itemController.filterItemsByAvailability);
router.get('/:catID/list', itemController.listItemsByLoyalty);

router.get('/rate/:itemId', itemController.getRateOfItem);
module.exports = router;
