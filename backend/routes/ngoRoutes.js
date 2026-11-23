const express = require('express');
const router = express.Router();
const {
  createOpportunity,
  getMyOpportunities,
  getOpportunityApplicants,
  updateApplicationStatus,
  getNgoDashboardStats,
} = require('../controllers/ngoController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All NGO routes require authentication & NGO role
router.use(protect);
router.use(authorize('ngo'));

router.post('/opportunities', createOpportunity);
router.get('/my-opportunities', getMyOpportunities);
router.get('/opportunities/:id/applicants', getOpportunityApplicants);
router.put('/applications/:id/status', updateApplicationStatus);
router.get('/dashboard-stats', getNgoDashboardStats);

module.exports = router;
