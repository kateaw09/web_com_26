import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Box, User, PlusCircle } from 'lucide-react'; // นำเข้าไอคอนสวยๆ จาก lucide-react

const Navbar = () => {
  // ดึงข้อมูล user และฟังก์ชัน logout จาก Context
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        {/* โลโก้ของแอป */}
        <Link to="/" className="navbar-brand">
          <Box size={28} color="#6366f1" />
          <span>MERN App</span>
        </Link>

        {/* เมนูต่างๆ */}
        <div className="nav-links">
          {/* ถ้า user มีค่า (ล็อกอินอยู่) ให้แสดงเมนูเหล่านี้ */}
          {user ? (
            <>
              <Link to="/create-item" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                <PlusCircle size={18} />
                New Item
              </Link>
              <div className="nav-user">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <User size={18} />
                  {user.name} {/* แสดงชื่อผู้ใช้งาน */}
                </span>
                {/* ปุ่ม Logout พร้อมผูกฟังก์ชัน logout จาก Context */}
                <button onClick={logout} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            /* ถ้ายังไม่ล็อกอิน ให้แสดงปุ่ม Login และ Register */
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
