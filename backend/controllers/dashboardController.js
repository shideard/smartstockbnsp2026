const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');
const os = require('os');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalItems = await Item.count();
        
        // Menghitung barang masuk dan keluar (sederhana)
        const totalIn = await Transaction.sum('quantity', { where: { type: 'IN' } }) || 0;
        const totalOut = await Transaction.sum('quantity', { where: { type: 'OUT' } }) || 0;

        // Mendapatkan barang dengan stok menipis (<= 5)
        const lowStockItems = await Item.findAll({
            where: { stock: { [Op.lte]: 5 } },
            attributes: ['id', 'sku', 'name', 'stock']
        });

        // Modul 2.e Server Resource Monitoring
        const serverStats = {
            freemem: os.freemem(),
            totalmem: os.totalmem(),
            loadavg: os.loadavg()
        };

        res.json({
            totalItems,
            totalIn,
            totalOut,
            lowStockItems,
            serverStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
