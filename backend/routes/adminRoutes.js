const express = require('express');
const router = express.Router();
const {
  getAllNgos,
  verifyNgo,
  getAllOpportunities,
  deleteOpportunity,
  getPlatformUsers,
  getPlatformReports,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All Admin routes require authentication & superadmin role
router.use(protect);
router.use(authorize('superadmin'));

router.get('/ngos', getAllNgos);
router.put('/ngos/:id/verify', verifyNgo);
router.get('/opportunities', getAllOpportunities);
router.delete('/opportunities/:id', deleteOpportunity);
router.get('/users', getPlatformUsers);
router.get('/reports', getPlatformReports);

module.exports = router;
