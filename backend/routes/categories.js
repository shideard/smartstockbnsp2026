const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', verifyToken, categoryController.getAllCategories);
router.post('/', verifyToken, authorizeRoles('Admin', 'Manajer Gudang'), categoryController.createCategory);
router.delete('/:id', verifyToken, authorizeRoles('Admin'), categoryController.deleteCategory);

module.exports = router;
