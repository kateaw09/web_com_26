const express = require('express');
const router = express.Router(); // สร้าง Express Router
const { getItems, createItem, updateItem, deleteItem } = require('../controllers/itemController'); // นำเข้าฟังก์ชันจาก Controller
const { protect } = require('../middleware/authMiddleware'); // นำเข้า Middleware ป้องกัน Route

// นำ protect มาวางไว้เพื่อบอกว่า Route เหล่านี้ต้องล็อกอินก่อนถึงจะใช้ได้
// router.route() ช่วยให้เขียนแบบรวบรัดได้ ถ้า URL เหมือนกันแต่ต่างแค่ Method
router.route('/').get(protect, getItems).post(protect, createItem);
router.route('/:id').put(protect, updateItem).delete(protect, deleteItem);

module.exports = router;
