const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, transactionController.getAllTransactions);
router.post('/', verifyToken, transactionController.createTransaction);
router.post('/transfer', verifyToken, transactionController.transferStock);

module.exports = router;
