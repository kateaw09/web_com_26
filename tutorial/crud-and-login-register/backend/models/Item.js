// นำเข้าไลบรารี mongoose สำหรับการสร้าง Schema
const mongoose = require('mongoose');

// สร้างโครงสร้างข้อมูล (Schema) สำหรับ Item (รายการสินค้า/ข้อมูล)
const itemSchema = new mongoose.Schema({
  // เก็บ ID ของผู้ใช้ที่เป็นคนสร้างสินค้านี้ (เพื่อรู้ว่าสินค้านี้เป็นของใคร)
  // type: mongoose.Schema.Types.ObjectId คือการอ้างอิงไปยัง ID ของอีกเอกสารในฐานข้อมูล
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // อ้างอิงไปยัง Model ที่ชื่อ 'User'
  },
  // ชื่อของ Item เป็นข้อความและจำเป็นต้องกรอก
  name: {
    type: String,
    required: [true, 'Please add a name for the item'],
  },
  // รายละเอียดของ Item เป็นข้อความและจำเป็นต้องกรอก
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  // ราคาของ Item เป็นตัวเลขและจำเป็นต้องกรอก
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
}, {
  // บันทึกเวลาที่สร้างและอัปเดตข้อมูลอัตโนมัติ
  timestamps: true,
});

// นำ Schema มาสร้างเป็น Model ชื่อ 'Item' และส่งออกไปใช้งาน
module.exports = mongoose.model('Item', itemSchema);
