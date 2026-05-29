import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { ArrowDownToLine, Save } from 'lucide-react';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({ item_id: '', type: 'IN', quantity: '', notes: '' });
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            const [txRes, itemsRes] = await Promise.all([
                api.get('/transactions'),
                api.get('/items')
            ]);
            setTransactions(txRes.data);
            setItems(itemsRes.data);
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
            await api.post('/transactions', formData);
            setFormData({ item_id: '', type: 'IN', quantity: '', notes: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Gagal menambah transaksi');
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        const headers = ['Tanggal,Barang,SKU,Jenis,Kuantitas,Oleh,Catatan'];
        const rows = transactions.map(tx => 
            `"${new Date(tx.createdAt).toLocaleString('id-ID')}","${tx.Item?.name}","${tx.Item?.sku}","${tx.type}","${tx.quantity}","${tx.User?.name}","${tx.notes || '-'}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "laporan_transaksi.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Layout>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-[30px] font-bold text-text-primary mb-2">Transaksi & Riwayat</h1>
                    <p className="text-text-secondary text-[14px]">Catat pergerakan barang masuk dan keluar.</p>
                </div>
                <button onClick={handleExportCSV} className="btn-secondary flex items-center gap-2">
                    <ArrowDownToLine size={16} /> Export CSV
                </button>
            </div>
            
            <div className="bg-bg-header rounded-card border border-border-main p-6 mb-8">
                <h3 className="text-[16px] font-bold text-text-primary mb-4 border-b border-border-main pb-2">Catat Transaksi Baru</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                    <div>
                        <label className="input-label">Pilih Barang</label>
                        <select required value={formData.item_id} onChange={e => setFormData({...formData, item_id: e.target.value})} className="input-premium">
                            <option value="">Pilih Barang...</option>
                            {items.map(item => (
                                <option key={item.id} value={item.id}>{item.sku} - {item.name} (Sisa: {item.stock})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="input-label">Jenis Transaksi</label>
                        <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input-premium font-semibold">
                            <option value="IN">IN (Barang Masuk)</option>
                            <option value="OUT">OUT (Barang Keluar)</option>
                        </select>
                    </div>
                    <div>
                        <label className="input-label">Kuantitas</label>
                        <input type="number" required min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="input-premium" placeholder="10" />
                    </div>
                    <div>
                        <label className="input-label">Catatan</label>
                        <input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="input-premium" placeholder="Opsional" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                        <Save size={16} /> {loading ? '...' : 'Simpan Transaksi'}
                    </button>
                </form>
            </div>

            <div className="table-container">
                <table className="w-full text-left">
                    <thead className="table-header">
                        <tr>
                            <th className="table-th">Waktu</th>
                            <th className="table-th">Barang (SKU)</th>
                            <th className="table-th">Jenis</th>
                            <th className="table-th text-right">Kuantitas</th>
                            <th className="table-th">Petugas</th>
                            <th className="table-th">Catatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="table-row">
                                <td className="table-td text-[13px] text-text-muted whitespace-nowrap">{new Date(tx.createdAt).toLocaleString('id-ID')}</td>
                                <td className="table-td">
                                    <div className="font-semibold text-text-primary">{tx.Item?.name}</div>
                                    <div className="text-[11px] font-mono text-text-muted">{tx.Item?.sku}</div>
                                </td>
                                <td className="table-td">
                                    <span className={`px-2 py-1 rounded text-[11px] font-bold tracking-wider ${tx.type === 'IN' ? 'bg-accent-mint text-primary' : 'bg-accent-rose text-secondary'}`}>
                                        {tx.type}
                                    </span>
                                </td>
                                <td className="table-td text-right font-bold text-[15px]">{tx.quantity}</td>
                                <td className="table-td text-[13px] text-text-secondary">{tx.User?.name}</td>
                                <td className="table-td text-[13px] text-text-muted">{tx.notes || '-'}</td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr><td colSpan="6" className="p-8 text-center text-text-muted">Belum ada riwayat transaksi.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
