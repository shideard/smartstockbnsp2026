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
        const [adminRole] = await Role.findOrCreate({ where: { name: 'Admin' } });
        const [manajerRole] = await Role.findOrCreate({ where: { name: 'Manajer Gudang' } });
        const [stafRole] = await Role.findOrCreate({ where: { name: 'Staf Gudang' } });
        const [viewerRole] = await Role.findOrCreate({ where: { name: 'Viewer' } });

        console.log('Seeding default users...');
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        await User.findOrCreate({
            where: { username: 'admin' },
            defaults: { name: 'Super Admin', password: hashedPassword, role_id: adminRole.id }
        });

        await User.findOrCreate({
            where: { username: 'manajer' },
            defaults: { name: 'Manajer Gudang', password: hashedPassword, role_id: manajerRole.id }
        });

        await User.findOrCreate({
            where: { username: 'staf' },
            defaults: { name: 'Staf Gudang', password: hashedPassword, role_id: stafRole.id }
        });

        await User.findOrCreate({
            where: { username: 'viewer' },
            defaults: { name: 'Viewer Akses', password: hashedPassword, role_id: viewerRole.id }
        });

        console.log('Sync and Seed complete! You can now start the server.');
        process.exit();
    } catch (error) {
        console.error('Failed to sync and seed database:', error);
        process.exit(1);
    }
}

syncAndSeed();
