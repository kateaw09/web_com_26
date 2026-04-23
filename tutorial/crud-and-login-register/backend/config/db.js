// นำเข้าไลบรารี mongoose สำหรับการจัดการฐานข้อมูล MongoDB
const mongoose = require('mongoose');

// สร้างฟังก์ชันแบบ Asynchronous สำหรับการเชื่อมต่อ Database
const connectDB = async () => {
  try {
    // ใช้ mongoose.connect เพื่อเชื่อมต่อ โดยใช้ URL จากไฟล์ .env (process.env.MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // ถ้าเชื่อมต่อสำเร็จ จะพิมพ์ข้อความบอกว่าเชื่อมต่อกับ Host ไหน
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // ถ้ามี Error เกิดขึ้นระหว่างการเชื่อมต่อ ให้พิมพ์ Error ออกมา
    console.error(`Error: ${error.message}`);
    // และหยุดการทำงานของโปรแกรม (exit(1) หมายถึงจบการทำงานแบบมีข้อผิดพลาด)
    process.exit(1);
  }
};

// ส่งออกฟังก์ชัน connectDB เพื่อให้ไฟล์อื่น (เช่น server.js) เรียกใช้งานได้
module.exports = connectDB;
