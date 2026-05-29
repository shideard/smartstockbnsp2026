const Item = require('../models/Item');
const Category = require('../models/Category');

exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.findAll({ include: Category });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createItem = async (req, res) => {
    try {
        const itemData = { ...req.body };
        if (req.file) {
            itemData.image_url = `/uploads/${req.file.filename}`;
        }
        const item = await Item.create(itemData);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Fitur Batch Import CSV dengan Pemrosesan Paralel (Modul 5.b)
exports.batchImport = async (req, res) => {
    try {
        const { items } = req.body;
        // Insert secara konkuren untuk meminimalisir waktu tunggu
        const createdItems = await Promise.all(
            items.map(item => Item.create({
                sku: item.sku,
                name: item.name,
                category_id: item.category_id,
                price: item.price
            }))
        );
        res.status(201).json({ message: `${createdItems.length} barang berhasil diimport secara paralel!` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Barang tidak ditemukan' });
        
        await item.update(req.body);
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByPk(req.params.id);
        if (!item) return res.status(404).json({ message: 'Barang tidak ditemukan' });
        
        await item.destroy();
        res.json({ message: 'Barang berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
