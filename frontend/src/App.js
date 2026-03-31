import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';


const API_URL ='https://trading-backend-l44l.onrender.com/api/signals';

function App() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '', direction: 'BUY', entry_price: '', 
    stop_loss: '', target_price: '', entry_time: '', expiry_time: ''
  });

  // 1. Fetch Signals & Update Dashboard
  const fetchSignals = useCallback(async () => {
    try {
      const res = await axios.get(API_URL);
      setSignals(res.data);
    } catch (err) {
      console.error("Error fetching signals", err);
    }
  }, []);

  // 2. Auto-refresh every 15 seconds
  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 15000);
    return () => clearInterval(interval);
  }, [fetchSignals]);

  // 3. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_URL, formData);
      alert("Signal Created Successfully!");
      fetchSignals();
    } catch (err) {
      alert(err.response?.data?.message || "Validation Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Trading Signal Tracker</h1>

      {/* --- SIGNAL CREATION FORM --- */}
      <div className="bg-gray-100 p-6 rounded-lg mb-10 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Create New Signal</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="p-2 border rounded" placeholder="Symbol (e.g. BTCUSDT)" required
            onChange={e => setFormData({...formData, symbol: e.target.value.toUpperCase()})} />
          
          <select className="p-2 border rounded" value={formData.direction}
            onChange={e => setFormData({...formData, direction: e.target.value})}>
            <option value="BUY">BUY (Long)</option>
            <option value="SELL">SELL (Short)</option>
          </select>

          <input className="p-2 border rounded" type="number" step="any" placeholder="Entry Price" required
            onChange={e => setFormData({...formData, entry_price: e.target.value})} />

          <input className="p-2 border rounded" type="number" step="any" placeholder="Stop Loss" required
            onChange={e => setFormData({...formData, stop_loss: e.target.value})} />

          <input className="p-2 border rounded" type="number" step="any" placeholder="Target Price" required
            onChange={e => setFormData({...formData, target_price: e.target.value})} />

          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Entry Date & Time</label>
            <input className="p-2 border rounded" type="datetime-local" required
              onChange={e => setFormData({...formData, entry_time: e.target.value})} />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Expiry Date & Time</label>
            <input className="p-2 border rounded" type="datetime-local" required
              onChange={e => setFormData({...formData, expiry_time: e.target.value})} />
          </div>

          <button type="submit" disabled={loading}
            className="md:col-span-3 bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition">
            {loading ? 'Processing...' : 'CREATE SIGNAL'}
          </button>
        </form>
      </div>

      {/* --- DASHBOARD TABLE --- */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Live Dashboard (Refreshes every 15s)</h2>
        <table className="w-full text-left border-collapse bg-white shadow-lg">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-3">Symbol</th>
              <th className="p-3">Direction</th>
              <th className="p-3">Entry</th>
              <th className="p-3">Live Price</th>
              <th className="p-3">Target / SL</th>
              <th className="p-3">Status</th>
              <th className="p-3">ROI %</th>
            </tr>
          </thead>
          <tbody>
            {signals.length === 0 ? <tr><td colSpan="7" className="p-4 text-center">No signals found.</td></tr> : 
              signals.map(s => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-bold">{s.symbol}</td>
                <td className={`p-3 font-bold ${s.direction === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                  {s.direction}
                </td>
                <td className="p-3 font-mono">{s.entry_price}</td>
                <td className="p-3 font-mono text-blue-600">{s.currentPrice || '---'}</td>
                <td className="p-3 text-sm">
                  <div className="text-green-600">T: {s.target_price}</div>
                  <div className="text-red-600">S: {s.stop_loss}</div>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold text-white 
                    ${s.status === 'OPEN' ? 'bg-blue-500' : s.status === 'TARGET_HIT' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {s.status}
                  </span>
                </td>
                <td className={`p-3 font-bold ${s.realized_roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {s.realized_roi ? s.realized_roi.toFixed(2) + '%' : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
