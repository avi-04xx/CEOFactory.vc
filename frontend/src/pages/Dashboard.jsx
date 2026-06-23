import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const STAGES = ['All', 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];

const stageStyle = (stage) => {
  const map = {
    Won: { bg: '#f0fdf4', color: '#15803d' },
    Lost: { bg: '#fff1f2', color: '#be123c' },
    Qualified: { bg: '#f0fdf4', color: '#15803d' },
    Contacted: { bg: '#eff6ff', color: '#1d4ed8' },
    New: { bg: '#faf5ff', color: '#6d28d9' },
    'Proposal Sent': { bg: '#fffbeb', color: '#b45309' },
  };
  return map[stage] || { bg: '#f1f5f9', color: '#475569' };
};

const priorityStyle = (p) =>
  p === 'High' ? { bg: '#fff1f2', color: '#dc2626' } :
  p === 'Medium' ? { bg: '#fffbeb', color: '#d97706' } :
  { bg: '#f0fdf4', color: '#16a34a' };

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const avatarColor = (name = '') => {
  const colors = ['#eff6ff,#2563eb', '#faf5ff,#7c3aed', '#f0fdf4,#15803d', '#fffbeb,#b45309', '#fff1f2,#be123c'];
  const idx = name.charCodeAt(0) % colors.length;
  const [bg, color] = colors[idx].split(',');
  return { bg, color };
};

const statConfig = [
  { label: 'Total', icon: '📋', accent: '#2563eb', lightBg: '#eff6ff' },
  { label: 'New', icon: '✨', accent: '#7c3aed', lightBg: '#faf5ff' },
  { label: 'Qualified', icon: '✅', accent: '#d97706', lightBg: '#fffbeb' },
  { label: 'Won', icon: '🏆', accent: '#16a34a', lightBg: '#f0fdf4' },
];

const Dashboard = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();

  const fetchOpportunities = async () => {
    try {
      const res = await api.get('/api/opportunities');
      setOpportunities(res.data);
      
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(decoded.id || decoded.userId);
      }
    } catch (err) {
      setError('Failed to load opportunities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this opportunity?')) return;
    try {
      await api.delete(`/api/opportunities/${id}`);
      fetchOpportunities();
    } catch {
      alert('Delete failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const filteredOpps = filter === 'All' 
    ? opportunities 
    : opportunities.filter((o) => o.stage === filter);

  const getCount = (label) =>
    label === 'Total' ? opportunities.length : opportunities.filter((o) => o.stage === label).length;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
          <p style={{ color: '#64748b', fontSize: 16 }}>Loading opportunities…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* NAV - Your Original Style */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏢</div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>CEO Factory</h1>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Opportunity Tracker</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => navigate('/new-opportunity')}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span style={{ fontSize: 16 }}>+</span> New Opportunity
            </button>
            <button
              onClick={handleLogout}
              style={{ background: 'transparent', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px' }}>

        {error && <div style={{ background: '#fee2e2', color: '#be123c', padding: '12px', borderRadius: 8, marginBottom: 20 }}>⚠️ {error}</div>}

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {statConfig.map(({ label, icon, accent, lightBg }) => (
            <div
              key={label}
              style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '20px 24px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => setFilter(label === 'Total' ? 'All' : label)}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: accent, borderRadius: '12px 0 0 12px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500, margin: 0 }}>{label} Opportunities</p>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: lightBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{icon}</div>
              </div>
              <p style={{ fontSize: 36, fontWeight: 700, color: '#0f172a', margin: 0 }}>{getCount(label)}</p>
            </div>
          ))}
        </div>

        {/* FILTER PILLS */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {STAGES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '7px 18px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                border: filter === s ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                background: filter === s ? '#2563eb' : '#fff',
                color: filter === s ? '#fff' : '#475569',
                transition: 'all 0.15s',
              }}
            >
              {s}
              {s !== 'All' && (
                <span style={{ marginLeft: 6, background: filter === s ? 'rgba(255,255,255,0.25)' : '#f1f5f9', borderRadius: 20, padding: '1px 7px', fontSize: 11 }}>
                  {opportunities.filter((o) => o.stage === s).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0f172a' }}>
              {filteredOpps.length} {filter === 'All' ? 'total' : filter.toLowerCase()} opportunities
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Customer', 'Requirement', 'Value', 'Stage', 'Priority', 'Follow-up', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOpps.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', fontSize: 15 }}>
                      <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                      No opportunities found
                    </td>
                  </tr>
                ) : (
                  filteredOpps.map((opp) => {
                    const av = avatarColor(opp.customerName);
                    const sg = stageStyle(opp.stage);
                    const pg = priorityStyle(opp.priority);
                    const isOwner = opp.owner?._id === currentUserId || opp.owner === currentUserId;
                    return (
                      <tr key={opp._id} style={{ borderBottom: '1px solid #f1f5f9' }} onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: av.bg, color: av.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                              {initials(opp.customerName)}
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 500, color: '#0f172a' }}>{opp.customerName}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 14, color: '#475569', maxWidth: 280 }}>
                          <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{opp.requirement}</span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#15803d' }}>₹{opp.estimatedValue?.toLocaleString('en-IN') || 0}</td>
                        <td style={{ padding: '14px 16px' }}><span style={{ background: sg.bg, color: sg.color, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>{opp.stage}</span></td>
                        <td style={{ padding: '14px 16px' }}><span style={{ background: pg.bg, color: pg.color, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>{opp.priority}</span></td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: '#64748b' }}>{opp.nextFollowUpDate ? new Date(opp.nextFollowUpDate).toLocaleDateString('en-IN') : '—'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          {isOwner ? (
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => navigate(`/edit/${opp._id}`)} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>✏️ Edit</button>
                              <button onClick={() => handleDelete(opp._id)} style={{ background: '#fff1f2', color: '#be123c', border: 'none', borderRadius: 7, padding: '6px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>🗑️ Delete</button>
                            </div>
                          ) : (
                            <span style={{ fontSize: 12, color: '#cbd5e1' }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;