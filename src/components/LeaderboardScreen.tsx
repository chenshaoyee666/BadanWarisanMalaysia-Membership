import { Trophy, Medal, Award, Bell, Home, DollarSign, Calendar, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';
import bwmLogo from '../assets/BWM logo.png';

interface LeaderboardScreenProps {
  onNavigate: (screen: string) => void;
}

const topDonors = [
  { rank: 1, name: 'Ahmad I.', amount: 'RM5,250' },
  { rank: 2, name: 'Siti N.', amount: 'RM4,800' },
  { rank: 3, name: 'Raj K.', amount: 'RM3,900' },
  { rank: 4, name: 'Chen', amount: 'RM2,500' },
  { rank: 5, name: 'Maria L.', amount: 'RM2,100' },
  { rank: 6, name: 'Hassan M.', amount: 'RM1,850' },
  { rank: 7, name: 'Priya S.', amount: 'RM1,600' },
  { rank: 8, name: 'Wong T.', amount: 'RM1,400' },
  { rank: 9, name: 'Aisha B.', amount: 'RM1,200' },
  { rank: 10, name: 'David C.', amount: 'RM1,050' },
];

const topVolunteers = [
  { rank: 1, name: 'Siti N.', hours: '45 hours' },
  { rank: 2, name: 'Hassan M.', hours: '38 hours' },
  { rank: 3, name: 'Priya S.', hours: '32 hours' },
  { rank: 4, name: 'Ahmad I.', hours: '28 hours' },
  { rank: 5, name: 'Wong T.', hours: '24 hours' },
  { rank: 6, name: 'Chen', hours: '20 hours' },
  { rank: 7, name: 'Maria L.', hours: '18 hours' },
  { rank: 8, name: 'Raj K.', hours: '15 hours' },
  { rank: 9, name: 'David C.', hours: '12 hours' },
  { rank: 10, name: 'Aisha B.', hours: '10 hours' },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="text-[#FFD700]" size={24} />;
    case 2:
      return <Medal className="text-[#C0C0C0]" size={24} />;
    case 3:
      return <Award className="text-[#CD7F32]" size={24} />;
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-[#0A402F]/10 flex items-center justify-center">
          <span className="text-[#333333] font-['Inter']">{rank}</span>
        </div>
      );
  }
};

const getRankBgColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-[#FFD700]/10 border-2 border-[#FFD700]';
    case 2:
      return 'bg-[#C0C0C0]/10 border-2 border-[#C0C0C0]';
    case 3:
      return 'bg-[#CD7F32]/10 border-2 border-[#CD7F32]';
    default:
      return 'bg-white';
  }
};

export function LeaderboardScreen({ onNavigate }: LeaderboardScreenProps) {
  const [activeTab, setActiveTab] = useState('donors');

  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* TOP-LEVEL: Main App Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={bwmLogo} alt="BWM Logo" className="w-10 h-10 rounded-xl" />
          <h2 className="text-[#FFFBEA] font-['Lora']">Community Champions</h2>
        </div>
        <button className="text-[#FFFBEA]">
          <Bell size={24} />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white rounded-xl">
            <TabsTrigger 
              value="donors" 
              className="data-[state=active]:bg-[#0A402F] data-[state=active]:text-[#FFFBEA] rounded-xl font-['Inter']"
            >
              Top Donors
            </TabsTrigger>
            <TabsTrigger 
              value="volunteers" 
              className="data-[state=active]:bg-[#0A402F] data-[state=active]:text-[#FFFBEA] rounded-xl font-['Inter']"
            >
              Top Volunteers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donors" className="space-y-3">
            {topDonors.map((donor) => (
              <div
                key={donor.rank}
                className={`rounded-xl p-4 flex items-center justify-between ${getRankBgColor(donor.rank)} shadow-sm`}
              >
                <div className="flex items-center gap-4">
                  {getRankIcon(donor.rank)}
                  <div>
                    <p className="text-[#333333] font-['Inter']">{donor.name}</p>
                    {donor.rank <= 3 && (
                      <p className="text-[#B48F5E] font-['Inter']">
                        {donor.rank === 1 ? '🏆 Gold Champion' : donor.rank === 2 ? '🥈 Silver Supporter' : '🥉 Bronze Patron'}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-[#0A402F] font-['Inter']">{donor.amount}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="volunteers" className="space-y-3">
            {topVolunteers.map((volunteer) => (
              <div
                key={volunteer.rank}
                className={`rounded-xl p-4 flex items-center justify-between ${getRankBgColor(volunteer.rank)} shadow-sm`}
              >
                <div className="flex items-center gap-4">
                  {getRankIcon(volunteer.rank)}
                  <div>
                    <p className="text-[#333333] font-['Inter']">{volunteer.name}</p>
                    {volunteer.rank <= 3 && (
                      <p className="text-[#B48F5E] font-['Inter']">
                        {volunteer.rank === 1 ? '🏆 Gold Volunteer' : volunteer.rank === 2 ? '🥈 Silver Helper' : '🥉 Bronze Supporter'}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-[#0A402F] font-['Inter']">{volunteer.hours}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Privacy Note */}
        <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-[#333333] opacity-70 text-center font-['Inter']">
            Donors can choose to remain anonymous in their profile settings.
          </p>
        </div>
      </main>

      {/* TOP-LEVEL: Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Home size={24} />
            <span className="text-xs font-['Inter']">Home</span>
          </button>
          
          <button 
            onClick={() => onNavigate('donate')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <DollarSign size={24} />
            <span className="text-xs font-['Inter']">Donate</span>
          </button>
          
          <button 
            onClick={() => onNavigate('events')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <Calendar size={24} />
            <span className="text-xs font-['Inter']">Events</span>
          </button>
          
          <button 
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <User size={24} />
            <span className="text-xs font-['Inter']">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
