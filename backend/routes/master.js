const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const requireAdmin = authorizeRoles('Admin', 'Manajer Gudang');

// Supplier Routes
router.get('/suppliers', verifyToken, masterController.getAllSuppliers);
router.post('/suppliers', verifyToken, requireAdmin, masterController.createSupplier);

// Warehouse Routes
router.get('/warehouses', verifyToken, masterController.getAllWarehouses);
router.post('/warehouses', verifyToken, requireAdmin, masterController.createWarehouse);

module.exports = router;
