const express = require('express');
const router = express.Router();
const {
  getAvailability,
  saveAvailability,
  getMatchingOpportunities,
  applyForOpportunity,
  getMyApplications,
} = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All volunteer routes require authentication & volunteer role
router.use(protect);
router.use(authorize('volunteer'));

router.get('/availability', getAvailability);
router.post('/availability', saveAvailability);
router.get('/opportunities', getMatchingOpportunities);
router.post('/apply/:opportunityId', applyForOpportunity);
router.get('/my-applications', getMyApplications);

module.exports = router;
