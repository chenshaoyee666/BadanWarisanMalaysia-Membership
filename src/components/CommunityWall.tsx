import { ArrowLeft, Heart } from 'lucide-react';

interface CommunityWallProps {
  onNavigate: (screen: string) => void;
}

const communityMessages = [
  {
    id: 1,
    name: 'Ahmad I.',
    message: "So important to protect this piece of our history for our children!",
    date: '2 hours ago',
    likes: 24,
  },
  {
    id: 2,
    name: 'Siti N.',
    message: "Just donated to the Rumah Penghulu fund. Every ringgit counts in preserving our heritage!",
    date: '5 hours ago',
    likes: 18,
  },
  {
    id: 3,
    name: 'Chen',
    message: "Attended the heritage walk last week - it was amazing! So glad BWM is doing this work.",
    date: '1 day ago',
    likes: 31,
  },
  {
    id: 4,
    name: 'Raj K.',
    message: "Proud to support Malaysian heritage. These buildings tell our nation's story.",
    date: '1 day ago',
    likes: 15,
  },
  {
    id: 5,
    name: 'Maria L.',
    message: "My grandchildren need to see these beautiful buildings. Thank you BWM for your work!",
    date: '2 days ago',
    likes: 27,
  },
  {
    id: 6,
    name: 'Hassan M.',
    message: "Volunteered at the restoration project - incredibly rewarding experience!",
    date: '2 days ago',
    likes: 22,
  },
  {
    id: 7,
    name: 'Priya S.',
    message: "Just became a member! Looking forward to all the heritage walks and events.",
    date: '3 days ago',
    likes: 19,
  },
  {
    id: 8,
    name: 'Wong T.',
    message: "These heritage buildings are irreplaceable. We must preserve them for future generations.",
    date: '3 days ago',
    likes: 28,
  },
  {
    id: 9,
    name: 'Aisha B.',
    message: "Learned so much about traditional Malay architecture at the workshop. Highly recommend!",
    date: '4 days ago',
    likes: 16,
  },
  {
    id: 10,
    name: 'David C.',
    message: "BWM is doing such important work. Proud to be a supporter!",
    date: '5 days ago',
    likes: 21,
  },
];

export function CommunityWall({ onNavigate }: CommunityWallProps) {
  return (
    <div className="min-h-screen bg-[#FEFDF5] flex flex-col">
      {/* Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center">
        <button onClick={() => onNavigate('home')} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-white font-['Lora'] flex-1 text-center mr-6">Community Wall</h2>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-6">
        {/* Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-[#333333] font-['Lora'] mb-2">Voices of Our Community</h3>
          <p className="text-[#333333] opacity-70">
            Read messages from fellow heritage supporters and share your own story
          </p>
        </div>

        {/* Messages Feed */}
        <div className="space-y-4">
          {communityMessages.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm">
              {/* User Info */}
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-[#0A402F] rounded-full flex items-center justify-center mr-3">
                  <span className="text-[#FEFDF5]">
                    {post.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[#333333]">{post.name}</p>
                  <p className="text-[#333333] opacity-50">{post.date}</p>
                </div>
              </div>

              {/* Message */}
              <p className="text-[#333333] leading-relaxed mb-3">
                {post.message}
              </p>

              {/* Interaction */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                <button className="flex items-center gap-2 text-[#B8860B] hover:text-[#B8860B]/80 transition-colors">
                  <Heart size={18} />
                  <span>{post.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Message Prompt */}
        <div className="mt-6 bg-[#0A402F]/5 border-2 border-[#0A402F] rounded-2xl p-6 text-center">
          <h4 className="text-[#333333] font-['Lora'] mb-2">Share Your Story</h4>
          <p className="text-[#333333] opacity-70 mb-4">
            After making a donation, you can leave a message for the community
          </p>
          <button
            onClick={() => onNavigate('donate')}
            className="bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FEFDF5] px-6 py-2 rounded-lg transition-colors"
          >
            Donate Now
          </button>
        </div>
      </main>
    </div>
  );
}
