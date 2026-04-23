// นำเข้าไลบรารี mongoose สำหรับการสร้าง Schema
const mongoose = require('mongoose');

// สร้างโครงสร้างข้อมูล (Schema) สำหรับ User
const userSchema = new mongoose.Schema({
  // กำหนดให้มีฟิลด์ name (ชื่อ) เป็นแบบ String และจำเป็นต้องกรอก (required: true)
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  // กำหนดให้มีฟิลด์ email เป็นแบบ String, จำเป็นต้องกรอก, และต้องไม่ซ้ำกันในระบบ (unique: true)
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
  },
  // กำหนดให้มีฟิลด์ password (รหัสผ่าน) เป็นแบบ String และจำเป็นต้องกรอก
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
}, {
  // เปิดโหมด timestamps เพื่อให้ mongoose บันทึกเวลา createdAt และ updatedAt ให้อัตโนมัติ
  timestamps: true,
});

// นำ Schema มาสร้างเป็น Model ชื่อ 'User' และส่งออกไปใช้งาน
module.exports = mongoose.model('User', userSchema);
