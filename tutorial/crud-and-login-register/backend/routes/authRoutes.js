const express = require('express');
const router = express.Router(); // สร้าง Express Router
const { registerUser, loginUser } = require('../controllers/authController'); // นำเข้าฟังก์ชันจาก Controller

// เมื่อมีการส่งข้อมูลแบบ POST มาที่ /api/auth/register ให้เรียกใช้ registerUser
router.post('/register', registerUser);

// เมื่อมีการส่งข้อมูลแบบ POST มาที่ /api/auth/login ให้เรียกใช้ loginUser
router.post('/login', loginUser);

module.exports = router;
