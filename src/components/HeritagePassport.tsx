import { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Check, Loader2 } from 'lucide-react';
import { fetchHeritageSitesWithVisits } from '../services/heritageService';
import { HeritageSiteWithVisit } from '../types/heritage';
import { useAuth } from '../contexts/AuthContext';

interface HeritagePassportProps {
  onNavigate: (screen: string) => void;
}

export function HeritagePassport({ onNavigate }: HeritagePassportProps) {
  const { user } = useAuth();
  const [sites, setSites] = useState<HeritageSiteWithVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSites();
  }, [user]);

  const loadSites = async () => {
    setLoading(true);
    const { data } = await fetchHeritageSitesWithVisits(user?.id);
    if (data) {
      setSites(data);
    }
    setLoading(false);
  };

  const visitedCount = sites.filter((site) => site.visited).length;
  const progress = sites.length > 0 ? (visitedCount / sites.length) * 100 : 0;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
      {/* Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center">
        <button onClick={() => onNavigate('profile')} className="text-[#FEFDF5] mr-4">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-[#FEFDF5]">Heritage Passport</h2>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-6">
        {/* Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-[#333333] font-['Lora'] mb-2">Your Heritage Journey</h3>
          <p className="text-[#333333] opacity-70 mb-4">
            Collect stamps by visiting heritage sites during BWM events
          </p>

          <div className="bg-[#FEFDF5] rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#333333]">Progress</span>
              <span className="text-[#0A402F]">
                {visitedCount} of {sites.length}
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B8860B] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {visitedCount === sites.length && sites.length > 0 && (
            <div className="mt-4 bg-[#B8860B]/10 border-2 border-[#B8860B] rounded-xl p-4">
              <p className="text-[#333333] text-center">
                🎉 Complete all sites to unlock 10% off membership renewal!
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-[#0A402F]" size={32} />
          </div>
        )}

        {/* Heritage Sites Grid */}
        {!loading && (
          <>
            <h4 className="text-[#333333] mb-4">Heritage Sites</h4>
            <div className="grid grid-cols-2 gap-4">
              {sites.map((site) => {
                const color = site.visited ? '#B8860B' : '#0A402F';
                return (
                  <div
                    key={site.id}
                    className={`rounded-2xl p-6 relative overflow-hidden ${site.visited ? 'bg-white shadow-lg' : 'bg-white opacity-60'
                      }`}
                    style={{
                      borderColor: site.visited ? color : '#E5E7EB',
                      borderWidth: site.visited ? '3px' : '1px',
                      borderStyle: 'solid',
                    }}
                  >
                    {/* Lock Icon for Unvisited */}
                    {!site.visited && (
                      <div className="absolute top-3 right-3">
                        <Lock className="text-gray-400" size={20} />
                      </div>
                    )}

                    {/* Check Icon for Visited */}
                    {site.visited && (
                      <div
                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: color }}
                      >
                        <Check className="text-white" size={16} />
                      </div>
                    )}

                    {/* Site Icon/Illustration */}
                    <div className="mb-4 flex items-center justify-center">
                      <div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center ${site.visited ? 'opacity-100' : 'opacity-30'
                          }`}
                        style={{
                          backgroundColor: site.visited ? `${color}20` : '#F3F4F6',
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={site.visited ? color : '#9CA3AF'}
                          strokeWidth="2"
                          className="w-8 h-8"
                        >
                          <path d="M3 21h18M5 21V7l8-4v18M13 9h6v12M13 13h6M13 17h6" />
                        </svg>
                      </div>
                    </div>

                    {/* Site Name */}
                    <p
                      className={`text-center mb-1 text-sm ${site.visited ? 'text-[#333333]' : 'text-gray-400'
                        }`}
                    >
                      {site.name}
                    </p>

                    {/* Visit Date or Locked Status */}
                    {site.visited ? (
                      <p className="text-center text-[#B8860B] text-xs">
                        Visited: {formatDate(site.visit_date)}
                      </p>
                    ) : (
                      <p className="text-center text-gray-400 text-xs">Locked</p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* How It Works */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm">
          <h4 className="text-[#333333] font-['Lora'] mb-3">How It Works</h4>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-[#B8860B] mr-2">1.</span>
              <span className="text-[#333333] opacity-70">
                Attend a BWM event at a heritage site
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#B8860B] mr-2">2.</span>
              <span className="text-[#333333] opacity-70">
                Scan the QR code at the site to check in
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#B8860B] mr-2">3.</span>
              <span className="text-[#333333] opacity-70">
                Collect the digital stamp in your passport
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#B8860B] mr-2">4.</span>
              <span className="text-[#333333] opacity-70">
                Complete all 6 sites to earn rewards!
              </span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
