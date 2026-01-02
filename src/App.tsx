import AdminPage from './component/adminPage'

import { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '88888888') {
      setIsAuthenticated(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <AdminPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2"
        >
          <Lock size={18} />
          Admin Access
        </button>
      ) : (
        <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
          <div className="relative">
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter 8-digit ID"
              maxLength={8}
              className={`px-6 py-3 rounded-xl border-2 outline-none text-center text-lg font-mono tracking-widest transition-all w-64 ${error
                  ? 'border-red-400 bg-red-50 text-red-900 placeholder-red-300'
                  : 'border-emerald-100 focus:border-emerald-500 bg-white'
                }`}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            disabled={password.length === 0}
          >
            Verify <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => { setShowInput(false); setError(false); setPassword(''); }}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
}

export default App