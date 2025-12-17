import { ArrowLeft, Lock, Check } from 'lucide-react';

interface HeritagePassportProps {
  onNavigate: (screen: string) => void;
}

const heritageSites = [
  {
    id: 1,
    name: 'Rumah Penghulu',
    visited: true,
    date: '25 Oct 2025',
    color: '#B8860B',
  },
  {
    id: 2,
    name: 'Sultan Abdul Samad Building',
    visited: false,
    date: null,
    color: '#0A402F',
  },
  {
    id: 3,
    name: 'St. Mary\'s Cathedral',
    visited: false,
    date: null,
    color: '#0A402F',
  },
  {
    id: 4,
    name: 'Merdeka Square',
    visited: false,
    date: null,
    color: '#0A402F',
  },
  {
    id: 5,
    name: 'Batu Caves Temple',
    visited: false,
    date: null,
    color: '#0A402F',
  },
  {
    id: 6,
    name: 'A Famosa Fort',
    visited: false,
    date: null,
    color: '#0A402F',
  },
];

export function HeritagePassport({ onNavigate }: HeritagePassportProps) {
  const visitedCount = heritageSites.filter((site) => site.visited).length;
  const progress = (visitedCount / heritageSites.length) * 100;

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
                {visitedCount} of {heritageSites.length}
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B8860B] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {visitedCount === heritageSites.length && (
            <div className="mt-4 bg-[#B8860B]/10 border-2 border-[#B8860B] rounded-xl p-4">
              <p className="text-[#333333] text-center">
                🎉 Complete all sites to unlock 10% off membership renewal!
              </p>
            </div>
          )}
        </div>

        {/* Heritage Sites Grid */}
        <h4 className="text-[#333333] mb-4">Heritage Sites</h4>
        <div className="grid grid-cols-2 gap-4">
          {heritageSites.map((site) => (
            <div
              key={site.id}
              className={`rounded-2xl p-6 relative overflow-hidden ${
                site.visited ? 'bg-white shadow-lg' : 'bg-white opacity-60'
              }`}
              style={{
                borderColor: site.visited ? site.color : '#E5E7EB',
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
                  style={{ backgroundColor: site.color }}
                >
                  <Check className="text-white" size={16} />
                </div>
              )}

              {/* Site Icon/Illustration */}
              <div className="mb-4 flex items-center justify-center">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                    site.visited ? 'opacity-100' : 'opacity-30'
                  }`}
                  style={{
                    backgroundColor: site.visited ? `${site.color}20` : '#F3F4F6',
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={site.visited ? site.color : '#9CA3AF'}
                    strokeWidth="2"
                    className="w-8 h-8"
                  >
                    <path d="M3 21h18M5 21V7l8-4v18M13 9h6v12M13 13h6M13 17h6" />
                  </svg>
                </div>
              </div>

              {/* Site Name */}
              <p
                className={`text-center mb-1 ${
                  site.visited ? 'text-[#333333]' : 'text-gray-400'
                }`}
              >
                {site.name}
              </p>

              {/* Visit Date or Locked Status */}
              {site.visited ? (
                <p className="text-center text-[#B8860B]">
                  Visited: {site.date}
                </p>
              ) : (
                <p className="text-center text-gray-400">Locked</p>
              )}
            </div>
          ))}
        </div>

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
