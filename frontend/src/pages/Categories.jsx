import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { Plus, Trash2 } from 'lucide-react';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/categories', { name, description });
            setName('');
            setDescription('');
            fetchCategories(); 
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Gagal menambah kategori (Apakah Backend sudah di-restart?)');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Yakin ingin menghapus?')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (error) {
                alert('Gagal menghapus kategori');
            }
        }
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-[30px] font-bold text-text-primary mb-2">Manajemen Kategori</h1>
                <p className="text-text-secondary text-[14px]">Kelola pengelompokan barang inventaris Anda.</p>
            </div>
            
            <div className="bg-white rounded-card shadow-card p-6 mb-8 border border-border-main">
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="input-label">Nama Kategori</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input-premium" placeholder="e.g. Elektronik" />
                    </div>
                    <div className="flex-1">
                        <label className="input-label">Deskripsi</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="input-premium" placeholder="Deskripsi singkat" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                        <Plus size={16} /> {loading ? 'Menyimpan...' : 'Tambah Kategori'}
                    </button>
                </form>
            </div>

            <div className="table-container">
                <table className="w-full text-left">
                    <thead className="table-header">
                        <tr>
                            <th className="table-th">ID</th>
                            <th className="table-th">Nama Kategori</th>
                            <th className="table-th">Deskripsi</th>
                            <th className="table-th text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, index) => (
                            <tr key={cat.id} className="table-row">
                                <td className="table-td text-text-muted">#{index + 1}</td>
                                <td className="table-td font-semibold text-text-primary">{cat.name}</td>
                                <td className="table-td text-text-secondary">{cat.description}</td>
                                <td className="table-td text-right">
                                    <button onClick={() => handleDelete(cat.id)} className="text-status-danger hover:text-red-700 bg-red-50 p-2 rounded-md transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr><td colSpan="4" className="p-8 text-center text-text-muted">Belum ada data kategori.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
