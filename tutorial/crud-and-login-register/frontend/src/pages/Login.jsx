import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  // สร้างตัวแปร state ไว้เก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(''); // เก็บข้อผิดพลาดเพื่อแสดงบนหน้าจอ
  const [isLoading, setIsLoading] = useState(false); // เช็คว่ากำลังโหลดอยู่ไหม

  // ดึงฟังก์ชัน login มาจาก Context
  const { login } = useAuth();

  // ฟังก์ชันอัปเดตค่าเมื่อผู้ใช้พิมพ์ลงในช่องต่างๆ
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ฟังก์ชันเมื่อกดปุ่ม Submit ฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บกระตุก (รีเฟรช) ตอนกดปุ่ม
    setIsLoading(true);
    setError('');

    try {
      // โยนข้อมูลให้ฟังก์ชัน login ใน Context จัดการต่อ
      await login(formData);
    } catch (err) {
      setError(err); // ถ้าผิดพลาด เอาข้อความ Error มาใส่ใน state
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <LogIn color="var(--primary-color)" /> Login
      </h2>
      
      {/* ถ้ามี Error เกิดขึ้น ให้แสดงกล่องข้อความสีแดงเตือน */}
      {error && (
        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger-color)', padding: '10px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(239,68,68,0.2)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={isLoading} style={{ marginTop: '10px' }}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Register here</Link>
      </p>
    </div>
  );
};

export default Login;
