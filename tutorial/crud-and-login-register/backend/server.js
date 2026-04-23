// นำเข้าไลบรารีที่จำเป็น
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // นำเข้าไฟล์เชื่อมต่อ Database

// โหลดค่าตัวแปรจากไฟล์ .env
dotenv.config();

// เรียกใช้ฟังก์ชันเชื่อมต่อ Database
connectDB();

const app = express();

// เปิดใช้งาน CORS เพื่อให้ Frontend (ที่อาจอยู่คนละ Port) สามารถเรียก API ของเราได้
app.use(cors());

// อนุญาตให้ Express สามารถอ่านข้อมูลที่ส่งมาเป็น JSON ได้ (ใน req.body)
app.use(express.json());

// อนุญาตให้อ่านข้อมูลจาก x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// นำเข้า Routes และกำหนด URL เริ่มต้น
// ตัวอย่าง: ถ้าเรียก /api/auth/login จะวิ่งเข้าไปใน authRoutes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));

// กำหนด Port โดยใช้จากไฟล์ .env หรือถ้าไม่มีให้ใช้ 5000
const PORT = process.env.PORT || 5000;

// สั่งให้ Server เริ่มทำงานที่ Port ที่กำหนด
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
