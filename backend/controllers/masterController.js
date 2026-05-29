const Supplier = require('../models/Supplier');
const Warehouse = require('../models/Warehouse');

// --- SUPPLIER CONTROLLER ---
exports.getAllSuppliers = async (req, res) => {
    try {
        const data = await Supplier.findAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createSupplier = async (req, res) => {
    try {
        const data = await Supplier.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// --- WAREHOUSE CONTROLLER ---
exports.getAllWarehouses = async (req, res) => {
    try {
        const data = await Warehouse.findAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createWarehouse = async (req, res) => {
    try {
        const data = await Warehouse.create(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
