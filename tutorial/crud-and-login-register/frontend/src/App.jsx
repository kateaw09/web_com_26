import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // ดึง Hook ที่เราสร้างเองเพื่อใช้ดูว่าใครล็อกอินอยู่

// นำเข้า Components และ Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemForm from './pages/ItemForm';

function App() {
  const { user } = useAuth(); // ดึงตัวแปร user ออกมาดูว่ามีค่าไหม (ล็อกอินอยู่ไหม)

  return (
    <>
      {/* แสดง Navbar ด้านบนทุกหน้า */}
      <Navbar />
      
      <div className="container">
        {/* กำหนดเส้นทาง (Routes) */}
        <Routes>
          {/* ถ้าเข้าหน้าแรก (/) แล้วล็อกอินอยู่ ให้ไปหน้า Home, แต่ถ้ายังไม่ล็อกอินให้เด้งไปหน้า Login */}
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          
          {/* ถ้าเข้าหน้า login แต่ดันล็อกอินอยู่แล้ว ให้เด้งกลับไปหน้าแรก, ถ้ายังไม่ล็อกอินก็ให้เข้าได้ปกติ */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          {/* หน้าสร้าง/แก้ไข ต้องล็อกอินก่อนถึงเข้าได้ */}
          <Route path="/create-item" element={user ? <ItemForm /> : <Navigate to="/login" />} />
          <Route path="/edit-item/:id" element={user ? <ItemForm /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
