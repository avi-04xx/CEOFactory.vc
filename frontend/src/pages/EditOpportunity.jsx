import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditOpportunity = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    requirement: '',
    estimatedValue: '',
    stage: 'New',
    priority: 'Medium',
    nextFollowUpDate: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:2000/api/opportunities/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data);
      } catch (err) {
        setError('Failed to load opportunity');
      }
    };
    fetchOpportunity();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:2000/api/opportunities/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Opportunity Updated Successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12" style={{background: 'linear-gradient(135deg, #0f172a, #1e40af)'}}>
      <div className="max-w-2xl mx-auto px-6">
        <div className="form-container fade-in-up" style={{background: 'white', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', padding: '40px'}}>
          
          <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <h1 style={{fontSize: '2.5rem', color: '#1e40af', fontWeight: '800'}}>Edit Opportunity</h1>
            <p style={{color: '#64748b', marginTop: '8px'}}>Update sales opportunity</p>
          </div>

          {error && <div style={{background: '#fee2e2', color: 'red', padding: '12px', borderRadius: '10px', marginBottom: '20px'}}>{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155'}}>Customer Name *</label>
                <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required className="input-field" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155'}}>Contact Person</label>
                <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="input-field" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0'}} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155'}}>Email</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="input-field" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155'}}>Phone</label>
                <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="input-field" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0'}} />
              </div>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155'}}>Requirement / Description *</label>
              <textarea name="requirement" value={formData.requirement} onChange={handleChange} required rows="4" className="input-field" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0', resize: 'vertical'}} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155'}}>Estimated Value (₹)</label>
                <input type="number" name="estimatedValue" value={formData.estimatedValue} onChange={handleChange} className="input-field" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155'}}>Stage</label>
                <select name="stage" value={formData.stage} onChange={handleChange} className="input-field" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0'}}>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155'}}>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="input-field" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0'}}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155'}}>Next Follow-up Date</label>
              <input type="date" name="nextFollowUpDate" value={formData.nextFollowUpDate} onChange={handleChange} className="input-field" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0'}} />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155'}}>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="input-field" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e2e8f0'}} />
            </div>

            <div className="flex gap-4 pt-6">
              <button type="button" onClick={() => navigate('/dashboard')} style={{flex: 1, padding: '16px', border: '2px solid #cbd5e1', borderRadius: '14px', fontWeight: '600', cursor: 'pointer'}}>
                Cancel
              </button>
              <button type="submit" disabled={loading} style={{flex: 1, padding: '16px', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer'}}>
                {loading ? 'Updating...' : 'Update Opportunity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOpportunity;