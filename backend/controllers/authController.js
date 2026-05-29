const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Cari user berdasarkan username
        const user = await User.findOne({ 
            where: { username },
            include: [{ model: Role }]
        });

        if (!user) {
            return res.status(401).json({ message: 'Username atau password salah!' });
        }

        // Cek password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Username atau password salah!' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                role: user.Role.name,
                role_id: user.role_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token berlaku 1 hari
        );

        res.json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.Role.name
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};
