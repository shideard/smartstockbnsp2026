const Transaction = require('../models/Transaction');
const Item = require('../models/Item');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            include: [
                { model: Item, attributes: ['name', 'sku'] },
                { model: User, attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const { item_id, type, quantity, notes } = req.body;
        const user_id = req.user.id; // didapat dari verifyToken middleware

        // 1. Buat Transaksi
        const transaction = await Transaction.create({
            item_id,
            user_id,
            type,
            quantity,
            notes
        });

        // 2. Update Stok Barang (Impact Analysis)
        const item = await Item.findByPk(item_id);
        if (type === 'IN') {
            item.stock += parseInt(quantity);
        } else if (type === 'OUT') {
            if (item.stock < quantity) {
                // Rollback transaksi jika stok tidak cukup
                await transaction.destroy();
                return res.status(400).json({ message: 'Stok tidak mencukupi untuk transaksi OUT!' });
            }
            item.stock -= parseInt(quantity);
        }
        await item.save();

        // 3. Catat ke Audit Log (Pemenuhan Modul 1.e)
        await AuditLog.create({
            user_id: user_id,
            action: `CREATE_TRANSACTION_${type}`,
            description: `User mencatat transaksi ${type} sebanyak ${quantity} untuk barang ${item.name} (SKU: ${item.sku})`,
            ip_address: req.ip || '127.0.0.1'
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Fitur Transfer Antar Gudang dengan Pemrosesan Paralel (Modul 5.a)
exports.transferStock = async (req, res) => {
    try {
        const { item_id, quantity } = req.body;
        const user_id = req.user.id;

        const item = await Item.findByPk(item_id);
        if (!item || item.stock < quantity) {
            return res.status(400).json({ message: 'Stok tidak cukup untuk transfer!' });
        }

        // Jalankan transaksi OUT dan IN secara bersamaan (Paralel) tanpa bottleneck
        const [txOut, txIn] = await Promise.all([
            Transaction.create({ item_id, user_id, type: 'OUT', quantity, notes: `Transfer Paralel: OUT Gudang Asal` }),
            Transaction.create({ item_id, user_id, type: 'IN', quantity, notes: `Transfer Paralel: IN Gudang Tujuan` })
        ]);

        await AuditLog.create({
            user_id: user_id,
            action: `PARALLEL_TRANSFER`,
            description: `Transfer paralel ${quantity} unit barang ${item.name} berhasil dieksekusi secara konkuren.`,
            ip_address: req.ip || '127.0.0.1'
        });

        res.status(201).json({ message: 'Transfer Paralel Berhasil', txOut, txIn });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
