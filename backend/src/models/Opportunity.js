const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  
  // 1. Owner (Very Important for Authorization)
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // 2. Basic Opportunity Details
  customerName: { 
    type: String, 
    required: true 
  },
  
  contactName: { 
    type: String 
  },
  
  contactEmail: { 
    type: String 
  },
  
  contactPhone: { 
    type: String 
  },

  // 3. Requirement Details
  requirement: { 
    type: String, 
    required: true 
  },

  // 4. Deal Value
  estimatedValue: { 
    type: Number, 
    min: 0 
  },

  // 5. Stage (Dropdown options)
  stage: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
    default: 'New'
  },

  // 6. Priority
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },

  // 7. Follow-up
  nextFollowUpDate: { 
    type: Date 
  },

  // 8. Extra Notes
  notes: { 
    type: String 
  },

}, { timestamps: true });   // This automatically adds createdAt and updatedAt

module.exports = mongoose.model('Opportunity', opportunitySchema);