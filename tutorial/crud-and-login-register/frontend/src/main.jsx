import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // นำเข้าเครื่องมือสำหรับทำระบบเปลี่ยนหน้า
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // นำเข้า Context สำหรับเก็บสถานะผู้ใช้
import './index.css';

// สร้างจุดเริ่มต้นของ React App
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ครอบด้วย BrowserRouter เพื่อเปิดใช้งานระบบ Routing (เปลี่ยน URL) */}
    <BrowserRouter>
      {/* ครอบแอปด้วย AuthProvider เพื่อให้ทุกหน้าสามารถดึงข้อมูล User ได้ */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
