import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tags, PackageSearch, ArrowLeftRight, LogOut, Box } from 'lucide-react';

export default function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isAdmin = user?.role === 'Admin' || user?.role === 'Manajer Gudang';

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, show: true },
        { name: 'Kategori', path: '/categories', icon: Tags, show: isAdmin },
        { name: 'Data Barang', path: '/items', icon: PackageSearch, show: isAdmin },
        { name: 'Transaksi', path: '/transactions', icon: ArrowLeftRight, show: true },
    ].filter(item => item.show);

    return (
        <div className="flex h-screen bg-bg-neutral">
            {/* Sidebar */}
            <aside className="w-[280px] bg-white border-r border-border-main flex flex-col shadow-sm z-10">
                <div className="p-6 border-b border-border-main flex items-center gap-3">
                    <div className="bg-accent-mint p-2 rounded-lg text-primary">
                        <Box size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-primary leading-tight">SmartStock</h2>
                        <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">Enterprise</p>
                    </div>
                </div>
                
                <div className="px-6 py-4">
                    <div className="bg-gray-50 rounded-lg p-3 border border-border-main">
                        <p className="text-[12px] text-text-secondary">Logged in as</p>
                        <p className="font-semibold text-[14px] text-text-primary">{user?.name}</p>
                        <span className="inline-block mt-1 bg-accent-rose text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            {user?.role}
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-2 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-[14px] font-medium ${
                                    isActive 
                                    ? 'bg-accent-mint text-primary' 
                                    : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                                }`}
                            >
                                <Icon size={18} className={isActive ? 'text-primary' : 'text-text-muted'} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-border-main">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full btn-ghost border-none hover:bg-red-50 hover:text-status-danger"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-bg-neutral p-8">
                <div className="max-w-[1440px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
