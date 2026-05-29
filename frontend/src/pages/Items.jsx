import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { Plus, Trash2 } from 'lucide-react';

export default function Items() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ name: '', sku: '', category_id: '', price: '' });
    const [image, setImage] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            const [itemsRes, catRes] = await Promise.all([
                api.get('/items'),
                api.get('/categories')
            ]);
            setItems(itemsRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('sku', formData.sku);
            data.append('name', formData.name);
            data.append('category_id', formData.category_id);
            data.append('price', formData.price);
            if (image) data.append('image', image);

            await api.post('/items', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ name: '', sku: '', category_id: '', price: '' });
            setImage(null);
            fetchData();
        } catch (error) {
            alert('Gagal menambah barang. Pastikan SKU unik.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Yakin ingin menghapus?')) {
            try {
                await api.delete(`/items/${id}`);
                fetchData();
            } catch (error) {
                alert('Gagal menghapus barang');
            }
        }
    };

    return (
        <Layout>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-[30px] font-bold text-text-primary mb-2">Data Barang</h1>
                    <p className="text-text-secondary text-[14px]">Kelola katalog barang inventaris Anda beserta fotonya.</p>
                </div>
                <input 
                    type="text" 
                    placeholder="Cari berdasarkan SKU atau Nama..." 
                    className="input-premium w-64"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <div className="bg-white rounded-card shadow-card p-6 mb-8 border border-border-main">
                <form onSubmit={handleSubmit} className="grid grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="input-label">SKU</label>
                        <input type="text" required value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="input-premium font-mono text-sm" placeholder="BRG-001" />
                    </div>
                    <div>
                        <label className="input-label">Nama Barang</label>
                        <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-premium" placeholder="Laptop Lenovo" />
                    </div>
                    <div>
                        <label className="input-label">Kategori</label>
                        <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="input-premium">
                            <option value="">Pilih...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="input-label">Harga (Rp)</label>
                        <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="input-premium" placeholder="10000000" />
                    </div>
                    <div>
                        <label className="input-label">Gambar (Opsional)</label>
                        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="input-premium py-2" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary lg:col-span-1 w-full flex items-center justify-center gap-2">
                        <Plus size={16} /> {loading ? '...' : 'Tambah'}
                    </button>
                </form>
            </div>

            <div className="table-container">
                <table className="w-full text-left">
                    <thead className="table-header">
                        <tr>
                            <th className="table-th w-16">Foto</th>
                            <th className="table-th">SKU</th>
                            <th className="table-th">Nama Barang</th>
                            <th className="table-th">Kategori</th>
                            <th className="table-th text-right">Stok</th>
                            <th className="table-th text-right">Harga</th>
                            <th className="table-th text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase())).map((item) => (
                            <tr key={item.id} className="table-row">
                                <td className="table-td">
                                    {item.image_url ? (
                                        <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="w-10 h-10 object-cover rounded-md border" />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">N/A</div>
                                    )}
                                </td>
                                <td className="table-td font-mono text-text-muted text-[13px]">{item.sku}</td>
                                <td className="table-td font-semibold text-text-primary">{item.name}</td>
                                <td className="table-td">
                                    <span className="bg-gray-100 text-text-secondary px-2 py-1 rounded text-[12px]">{item.Category?.name}</span>
                                </td>
                                <td className="table-td text-right">
                                    <span className={`px-2 py-1 rounded-full text-[12px] font-bold ${item.stock <= 5 ? 'bg-orange-100 text-status-warning' : 'bg-green-100 text-status-success'}`}>
                                        {item.stock}
                                    </span>
                                </td>
                                <td className="table-td text-right text-text-secondary">Rp {parseInt(item.price).toLocaleString('id-ID')}</td>
                                <td className="table-td text-right">
                                    <button onClick={() => handleDelete(item.id)} className="text-status-danger hover:text-red-700 bg-red-50 p-2 rounded-md transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr><td colSpan="7" className="p-8 text-center text-text-muted">Belum ada data barang.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
