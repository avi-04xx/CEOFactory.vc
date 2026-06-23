const Opportunity = require('../models/Opportunity');

// Create Opportunity
const createOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.create({
      ...req.body,
      owner: req.user.id   // Important: Get owner from JWT
    });

    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Opportunities (Shared Pipeline)
const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate('owner', 'name email')   // Show owner name
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Opportunity
const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('owner', 'name email');

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Opportunity (Only Owner)
const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findOne({ 
      _id: req.params.id, 
      owner: req.user.id 
    });

    if (!opportunity) {
      return res.status(403).json({ message: 'Not authorized to update this opportunity' });
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );

    res.json(updatedOpportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Opportunity (Only Owner)
const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findOne({ 
      _id: req.params.id, 
      owner: req.user.id 
    });

    if (!opportunity) {
      return res.status(403).json({ message: 'Not authorized to delete this opportunity' });
    }

    await opportunity.deleteOne();
    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
};