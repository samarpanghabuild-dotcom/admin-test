import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowLeft, Wallet, TrendingDown, CreditCard, Smartphone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Withdrawal = () => {
  const navigate = useNavigate();
  const { user, refreshBalance } = useAuth();
  const [withdrawalMethod, setWithdrawalMethod] = useState('upi');
  const [amount, setAmount] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Bank transfer fields
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  
  // UPI fields
  const [upiId, setUpiId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await axios.get(`${API}/withdrawal/history`);
      setWithdrawals(response.data);
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    
    if (!amount || Number(amount) < 100) {
      toast.error('Minimum withdrawal is ₹100');
      return;
    }

    if (Number(amount) > user?.balance) {
      toast.error('Insufficient balance');
      return;
    }

    // Validate fields based on method
    if (withdrawalMethod === 'bank') {
      if (!bankName || !accountHolder || !accountNumber || !ifscCode || !mobileNumber) {
        toast.error('Please fill all bank details');
        return;
      }
    } else {
      if (!upiId || !accountHolder || !mobileNumber) {
        toast.error('Please fill all UPI details');
        return;
      }
    }

    setLoading(true);
    try {
      await axios.post(`${API}/withdrawal/request`, {
        amount: Number(amount),
        method: withdrawalMethod,
        bank_name: bankName || null,
        account_holder: accountHolder,
        account_number: accountNumber || null,
        ifsc_code: ifscCode || null,
        upi_id: upiId || null,
        mobile_number: mobileNumber
      });
      
      toast.success('Withdrawal request submitted!');
      setAmount('');
      setBankName('');
      setAccountHolder('');
      setAccountNumber('');
      setIfscCode('');
      setUpiId('');
      setMobileNumber('');
      fetchWithdrawals();
      await refreshBalance();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Withdrawal request failed');
    } finally {
      setLoading(false);
    }
  };

  const wagerProgress = user?.wager_requirement > 0 
    ? Math.min((user.total_wagered / user.wager_requirement) * 100, 100)
    : 100;

  const remainingWager = Math.max(user?.wager_requirement - user?.total_wagered, 0);

  return (
    <div className="min-h-screen noise-bg" style={{ background: '#050505' }}>
      {/* Header */}
      <nav className="glass-panel border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            data-testid="back-btn"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:text-[#00FF94] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold" style={{ fontFamily: 'Unbounded' }}>
            <TrendingDown className="w-5 h-5 inline mr-2" />
            Withdrawal
          </h1>
          <div />
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Balance Card */}
        <div className="glass-panel p-4 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: '#FFD600' }}>
              <Wallet className="w-6 h-6" style={{ color: '#000' }} />
            </div>
            <div>
              <div className="text-xs" style={{ color: '#A1A1AA' }}>Balance</div>
              <div className="text-2xl font-bold mono neon-green">₹{user?.balance?.toFixed(2) || '0.00'}</div>
            </div>
          </div>
          
          {/* Wager Requirement Progress */}
          {user?.wager_requirement > 0 && (
            <div className="mt-4 p-3 rounded-lg" style={{ background: '#0A0A0B' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: '#A1A1AA' }}>Wager Requirement</span>
                <span className="text-xs font-bold" style={{ color: '#FFD600' }}>
                  {wagerProgress.toFixed(0)}%
                </span>
              </div>
              <Progress value={wagerProgress} className="h-2 mb-2" />
              {remainingWager > 0 && (
                <div className="flex items-center gap-2 text-xs" style={{ color: '#FF0055' }}>
                  <AlertCircle className="w-3 h-3" />
                  <span>Wager ₹{remainingWager.toFixed(2)} more to withdraw</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Withdrawal Amount */}
        <div className="glass-panel p-4 mb-4">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ fontFamily: 'Unbounded' }}>
            <span style={{ color: '#FFD600' }}>₹</span>
            Withdrawal Amount
          </h3>
          
          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className="py-3 rounded-lg font-bold transition-all"
                style={{
                  background: amount === amt.toString() ? '#FFD600' : 'rgba(255, 214, 0, 0.1)',
                  color: amount === amt.toString() ? '#000' : '#FFD600',
                  border: '1px solid rgba(255, 214, 0, 0.3)'
                }}
              >
                ₹{amt >= 1000 ? `${amt / 1000}K` : amt}
              </button>
            ))}
          </div>

          {/* Manual Amount Input */}
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="₹100.00 - ₹50,000.00"
              className="w-full px-4 py-3 rounded-lg outline-none mono text-lg"
              style={{
                background: '#0A0A0B',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#FFFFFF'
              }}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs" style={{ color: '#A1A1AA' }}>
              Min: ₹100
            </div>
          </div>
        </div>

        {/* Withdrawal Method */}
        <div className="glass-panel p-4 mb-4">
          <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Unbounded' }}>
            Select Channel
          </h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setWithdrawalMethod('upi')}
              className="p-4 rounded-lg transition-all flex flex-col items-center gap-2"
              style={{
                background: withdrawalMethod === 'upi' ? 'rgba(0, 255, 148, 0.1)' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${withdrawalMethod === 'upi' ? '#00FF94' : 'rgba(255,255,255,0.1)'}`
              }}
            >
              <Smartphone className="w-8 h-8" style={{ color: withdrawalMethod === 'upi' ? '#00FF94' : '#A1A1AA' }} />
              <span className="text-sm font-bold">UPI</span>
              <span className="text-xs" style={{ color: '#00FF94' }}>+3% bonus</span>
            </button>
            
            <button
              onClick={() => setWithdrawalMethod('bank')}
              className="p-4 rounded-lg transition-all flex flex-col items-center gap-2"
              style={{
                background: withdrawalMethod === 'bank' ? 'rgba(0, 224, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${withdrawalMethod === 'bank' ? '#00E0FF' : 'rgba(255,255,255,0.1)'}`
              }}
            >
              <CreditCard className="w-8 h-8" style={{ color: withdrawalMethod === 'bank' ? '#00E0FF' : '#A1A1AA' }} />
              <span className="text-sm font-bold">Bank Transfer</span>
            </button>
          </div>

          {/* UPI Form */}
          {withdrawalMethod === 'upi' && (
            <div className="space-y-3">
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="UPI ID (e.g., username@upi)"
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  background: '#0A0A0B',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FFFFFF'
                }}
              />
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="Account Holder Name"
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  background: '#0A0A0B',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FFFFFF'
                }}
              />
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Registered Mobile Number"
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  background: '#0A0A0B',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FFFFFF'
                }}
              />
            </div>
          )}

          {/* Bank Form */}
          {withdrawalMethod === 'bank' && (
            <div className="space-y-3">
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="Account Holder Name"
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  background: '#0A0A0B',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FFFFFF'
                }}
              />
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank Name"
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  background: '#0A0A0B',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FFFFFF'
                }}
              />
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Account Number"
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  background: '#0A0A0B',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FFFFFF'
                }}
              />
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                placeholder="IFSC Code"
                className="w-full px-4 py-3 rounded-lg outline-none uppercase"
                style={{
                  background: '#0A0A0B',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FFFFFF'
                }}
              />
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Mobile Number"
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{
                  background: '#0A0A0B',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FFFFFF'
                }}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleWithdrawal}
            disabled={loading || remainingWager > 0 || !amount}
            className="w-full mt-4 py-4 font-bold uppercase tracking-wider transition-all"
            style={{
              background: loading || remainingWager > 0 || !amount ? '#555' : '#FF0055',
              color: '#FFF',
              opacity: loading || remainingWager > 0 || !amount ? 0.5 : 1,
              cursor: loading || remainingWager > 0 || !amount ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing...' : 'Withdraw'}
          </button>
        </div>

        {/* Withdrawal Instructions */}
        <div className="glass-panel p-4 mb-4">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ fontFamily: 'Unbounded', color: '#FFD600' }}>
            <AlertCircle className="w-4 h-4" />
            Withdrawal Instructions
          </h3>
          <ul className="space-y-2 text-xs" style={{ color: '#A1A1AA' }}>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#00FF94' }} />
              <span>Processing time: 24-48 hours on working days</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#00FF94' }} />
              <span>Minimum withdrawal: ₹100</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#00FF94' }} />
              <span>You must complete 2× wager requirement before withdrawal</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#00FF94' }} />
              <span>Ensure your account details are correct to avoid delays</span>
            </li>
          </ul>
        </div>

        {/* Withdrawal History */}
        {withdrawals.length > 0 && (
          <div className="glass-panel p-4">
            <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'Unbounded' }}>
              Withdrawal History
            </h3>
            <div className="space-y-3">
              {withdrawals.slice(0, 10).map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="p-3 rounded-lg"
                  style={{ background: '#0A0A0B', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-bold mono">₹{withdrawal.amount.toFixed(2)}</div>
                      <div className="text-xs" style={{ color: '#A1A1AA' }}>
                        {new Date(withdrawal.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div
                      className="px-3 py-1 rounded text-xs font-bold uppercase"
                      style={{
                        background: withdrawal.status === 'approved' ? '#00FF9420' : 
                                   withdrawal.status === 'rejected' ? '#FF005520' : '#FFD60020',
                        color: withdrawal.status === 'approved' ? '#00FF94' : 
                              withdrawal.status === 'rejected' ? '#FF0055' : '#FFD600'
                      }}
                    >
                      {withdrawal.status}
                    </div>
                  </div>
                  {withdrawal.rejection_reason && (
                    <div className="text-xs p-2 rounded" style={{ background: '#FF005510', color: '#FF0055' }}>
                      Reason: {withdrawal.rejection_reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Withdrawal;