const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunityController');

const router = express.Router();

router.post('/', protect, createOpportunity);
router.get('/', protect, getOpportunities);
router.get('/:id', protect, getOpportunityById);     // ← Critical for Edit
router.put('/:id', protect, updateOpportunity);
router.delete('/:id', protect, deleteOpportunity);

module.exports = router;