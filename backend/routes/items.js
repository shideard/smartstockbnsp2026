const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', verifyToken, itemController.getAllItems);
router.post('/', verifyToken, authorizeRoles('Admin', 'Manajer Gudang'), upload.single('image'), itemController.createItem);
router.post('/batch-import', verifyToken, authorizeRoles('Admin', 'Manajer Gudang'), itemController.batchImport);
router.put('/:id', verifyToken, authorizeRoles('Admin', 'Manajer Gudang'), itemController.updateItem);
router.delete('/:id', verifyToken, authorizeRoles('Admin'), itemController.deleteItem);

module.exports = router;
