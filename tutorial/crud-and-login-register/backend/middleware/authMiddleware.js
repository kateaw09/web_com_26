const jwt = require('jsonwebtoken'); // นำเข้า jsonwebtoken
const User = require('../models/User'); // นำเข้า User Model เพื่อค้นหาข้อมูลผู้ใช้จากฐานข้อมูล

// ฟังก์ชัน Middleware (คนคั่นกลาง) สำหรับป้องกัน Route
const protect = async (req, res, next) => {
  let token;

  // ตรวจสอบว่าใน Header ที่ส่งมา มี Authorization และขึ้นต้นด้วยคำว่า 'Bearer' หรือไม่
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // ดึง Token ออกมาจาก String (แยกคำว่า Bearer กับตัว Token ด้วยช่องว่าง)
      token = req.headers.authorization.split(' ')[1];

      // ยืนยัน Token ด้วยคำลับ JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // หาข้อมูลผู้ใช้จาก ID ที่ถอดรหัสออกมาได้ (ไม่เอาฟิลด์ password มาด้วย) และเก็บไว้ใน req.user
      req.user = await User.findById(decoded.id).select('-password');

      // ไปยังฟังก์ชันถัดไป (เช่น ไปยัง Controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // ถ้าไม่มี Token แนบมาเลย
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
