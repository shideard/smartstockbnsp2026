const sequelize = require('./config/database');
const Role = require('./models/Role');
const User = require('./models/User');
const Category = require('./models/Category');
const Item = require('./models/Item');
const Transaction = require('./models/Transaction');
const AuditLog = require('./models/AuditLog');
const Supplier = require('./models/Supplier');
const Warehouse = require('./models/Warehouse');
const bcrypt = require('bcryptjs');

async function syncAndSeed() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Connection successful.');

        // Sync all models (alter: true updates tables to match models without dropping)
        console.log('Syncing models...');
        await sequelize.sync({ alter: true });
        
        console.log('Seeding default roles...');
        const adminRole = await Role.create({ name: 'Admin' });
        const staffRole = await Role.create({ name: 'Staff' });

        console.log('Seeding default admin user...');
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.create({
            name: 'Super Admin',
            username: 'admin',
            password: hashedPassword,
            role_id: adminRole.id
        });

        console.log('Seeding default staff user...');
        await User.create({
            name: 'Staff Gudang',
            username: 'staff',
            password: hashedPassword,
            role_id: staffRole.id
        });

        console.log('Sync and Seed complete! You can now start the server.');
        process.exit();
    } catch (error) {
        console.error('Failed to sync and seed database:', error);
        process.exit(1);
    }
}

syncAndSeed();
