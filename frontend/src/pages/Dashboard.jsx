import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Download, Server, Cpu } from 'lucide-react';
import html2pdf from 'html2pdf.js';

// Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const reportRef = useRef(); // Untuk target PDF

    const [stats, setStats] = useState({
        totalItems: 0,
        totalIn: 0,
        totalOut: 0,
        lowStockItems: [],
        serverStats: { freemem: 0, totalmem: 0, loadavg: [0,0,0] }
    });

    const fetchDashboardStats = async () => {
        try {
            const res = await api.get('/dashboard');
            setStats(res.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
        const interval = setInterval(() => {
            fetchDashboardStats();
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const chartData = {
        labels: ['Masuk (IN)', 'Keluar (OUT)'],
        datasets: [
            {
                label: 'Kuantitas Transaksi',
                data: [stats.totalIn, stats.totalOut],
                backgroundColor: ['#3BB273', '#E88BA8'],
                borderRadius: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#E6E8EC' } },
            x: { grid: { display: false } }
        }
    };

    const handleExportPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin:       0.5,
            filename:     'Laporan_SmartStock.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
        html2pdf().from(element).set(opt).save();
    };

    return (
        <Layout>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-[30px] font-bold text-text-primary mb-2">Dashboard Overview</h1>
                    <p className="text-text-secondary text-[14px]">Monitor aktivitas inventaris Anda secara real-time.</p>
                </div>
                <button onClick={handleExportPDF} className="btn-secondary flex items-center gap-2">
                    <Download size={16} /> Laporan PDF
                </button>
            </div>

            <div ref={reportRef} className="p-2 bg-bg-neutral">
                {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-card shadow-card border border-border-main flex items-start gap-4">
                    <div className="p-3 bg-accent-mint text-primary rounded-xl"><Package size={24} /></div>
                    <div>
                        <h3 className="text-text-secondary text-[13px] font-semibold uppercase tracking-wider mb-1">Total Produk</h3>
                        <p className="text-3xl font-bold text-text-primary">{stats.totalItems}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-card shadow-card border border-border-main flex items-start gap-4">
                    <div className="p-3 bg-accent-mint text-status-success rounded-xl"><TrendingUp size={24} /></div>
                    <div>
                        <h3 className="text-text-secondary text-[13px] font-semibold uppercase tracking-wider mb-1">Total Masuk</h3>
                        <p className="text-3xl font-bold text-text-primary">{stats.totalIn}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-card shadow-card border border-border-main flex items-start gap-4">
                    <div className="p-3 bg-accent-rose text-secondary rounded-xl"><TrendingDown size={24} /></div>
                    <div>
                        <h3 className="text-text-secondary text-[13px] font-semibold uppercase tracking-wider mb-1">Total Keluar</h3>
                        <p className="text-3xl font-bold text-text-primary">{stats.totalOut}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-card shadow-card border border-status-warning flex items-start gap-4 relative overflow-hidden">
                    <div className="p-3 bg-orange-50 text-status-warning rounded-xl"><AlertTriangle size={24} /></div>
                    <div>
                        <h3 className="text-text-secondary text-[13px] font-semibold uppercase tracking-wider mb-1">Stok Menipis</h3>
                        <p className="text-3xl font-bold text-text-primary">{stats.lowStockItems.length}</p>
                    </div>
                    {stats.lowStockItems.length > 0 && (
                        <div className="absolute top-0 right-0 w-2 h-full bg-status-warning animate-pulse"></div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Realtime Alert & Chart (2/3 width) */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Chart.js */}
                    <div className="bg-white rounded-card shadow-card border border-border-main p-6">
                        <h3 className="text-[16px] font-bold text-text-primary mb-6">Tren Pergerakan Inventaris</h3>
                        <div className="h-[300px] flex items-center justify-center">
                            <Bar options={chartOptions} data={chartData} />
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="bg-white rounded-card shadow-card border border-border-main overflow-hidden">
                        <div className="px-6 py-4 border-b border-border-main bg-bg-header flex justify-between items-center">
                            <h3 className="text-[16px] font-bold text-text-primary">Notifikasi Stok Menipis</h3>
                            <span className="text-[12px] text-text-muted">Auto-sync 15s</span>
                        </div>
                        <div className="p-6">
                            {stats.lowStockItems.length > 0 ? (
                                <ul className="space-y-3">
                                    {stats.lowStockItems.map(item => (
                                        <li key={item.id} className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-text-primary text-[14px]">{item.name}</p>
                                                <p className="text-[12px] text-text-secondary">SKU: {item.sku}</p>
                                            </div>
                                            <span className="bg-status-warning text-white text-[12px] font-bold px-3 py-1 rounded-full">
                                                Sisa: {item.stock}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="inline-block p-4 bg-accent-mint text-primary rounded-full mb-3"><Package size={32}/></div>
                                    <p className="text-text-primary font-semibold">Semua stok aman!</p>
                                    <p className="text-[13px] text-text-muted mt-1">Tidak ada barang yang perlu di-restock saat ini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="xl:col-span-1 space-y-8">
                    {/* Server Monitoring */}
                    <div className="bg-white rounded-card shadow-card border border-border-main overflow-hidden">
                        <div className="px-6 py-4 border-b border-border-main bg-bg-header">
                            <h3 className="text-[16px] font-bold text-text-primary flex items-center gap-2"><Server size={18} /> Server Resource</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-text-secondary text-[12px] mb-1 font-semibold uppercase">Memory Usage</p>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.round(((stats.serverStats.totalmem - stats.serverStats.freemem)/stats.serverStats.totalmem)*100)}%` }}></div>
                                </div>
                                <p className="text-[11px] text-text-muted mt-1 text-right">
                                    {Math.round((stats.serverStats.totalmem - stats.serverStats.freemem)/1024/1024)} MB / {Math.round(stats.serverStats.totalmem/1024/1024)} MB
                                </p>
                            </div>
                            <div>
                                <p className="text-text-secondary text-[12px] mb-1 font-semibold uppercase">CPU Load Avg (1m)</p>
                                <p className="text-[20px] font-bold text-text-primary flex items-center gap-2">
                                    <Cpu size={20} className="text-secondary" /> {stats.serverStats.loadavg[0]?.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Leaflet Map (1/3 width) */}
                    <div className="bg-white rounded-card shadow-card border border-border-main overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-border-main bg-bg-header">
                            <h3 className="text-[16px] font-bold text-text-primary">Peta Gudang Pusat</h3>
                        </div>
                        <div className="flex-1" style={{ minHeight: '300px' }}>
                            <MapContainer center={[-6.200000, 106.816666]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[-6.200000, 106.816666]}>
                                    <Popup><b>Gudang SmartStock Pro</b><br/>Jakarta Pusat.</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </Layout>
    );
}
