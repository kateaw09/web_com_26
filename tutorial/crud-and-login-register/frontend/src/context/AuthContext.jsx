import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// สร้าง Context เพื่อให้ Component อื่นๆ สามารถดึงข้อมูลได้โดยไม่ต้องส่ง props ลงไปลึกๆ
const AuthContext = createContext();

// สร้าง Provider ที่จะเป็นตัวครอบแอปของเรา
export const AuthProvider = ({ children }) => {
  // สร้างตัวแปร state ไว้เก็บข้อมูลผู้ใช้ที่ล็อกอินอยู่
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนหน้าอัตโนมัติ

  // เมื่อแอปเริ่มทำงาน ให้เช็คว่ามี User อยู่ใน localStorage ไหม (เคยล็อกอินไว้ไหม)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // ถ้ามี ให้ดึงมาใส่ใน state user
    }
    setLoading(false); // เลิกโหลด
  }, []);

  // ฟังก์ชันสมัครสมาชิก
  const register = async (userData) => {
    try {
      // ยิง API ไปที่ Backend เพื่อสมัครสมาชิก
      const res = await axios.post('http://localhost:5000/api/auth/register', userData);
      if (res.data) {
        // ถ้าสำเร็จ ให้เก็บข้อมูลผู้ใช้และ Token ไว้ใน localStorage เครื่องลูกค้า
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data); // อัปเดต state
        navigate('/'); // เด้งไปหน้าแรก
      }
    } catch (error) {
      // โยน Error ออกไปให้ Component หน้าเว็บจัดการแสดงผล
      throw error.response.data.message || 'An error occurred';
    }
  };

  // ฟังก์ชันเข้าสู่ระบบ
  const login = async (userData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', userData);
      if (res.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
        setUser(res.data);
        navigate('/');
      }
    } catch (error) {
      throw error.response.data.message || 'An error occurred';
    }
  };

  // ฟังก์ชันออกจากระบบ
  const logout = () => {
    // ลบข้อมูลจาก localStorage
    localStorage.removeItem('user');
    setUser(null); // เคลียร์ state
    navigate('/login'); // เด้งไปหน้าล็อกอิน
  };

  // ส่งต่อข้อมูลและฟังก์ชันทั้งหมดเพื่อให้ Component ลูกนำไปใช้งานได้
  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// สร้าง Custom Hook เพื่อให้เรียกใช้ง่ายๆ เช่น const { user } = useAuth();
export const useAuth = () => useContext(AuthContext);
