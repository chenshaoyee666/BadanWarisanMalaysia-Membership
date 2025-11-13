import { Bell, Home, DollarSign, Calendar, User } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import bwmLogo from 'figma:asset/0d1febf7746d940532ad6ebe58464b3c717cca4a.png';

interface DonateScreenProps {
  onNavigate: (screen: string) => void;
}

const campaigns = [
  {
    id: 1,
    title: 'Rumah Penghulu Restoration',
    description: 'Help us restore this beautiful traditional Malay house from the 1900s. Your donation will help preserve authentic craftsmanship and heritage architecture.',
    image: 'https://images.unsplash.com/photo-1610794267125-da22a00fca8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxheXNpYW4lMjBoZXJpdGFnZSUyMGJ1aWxkaW5nJTIwcmVzdG9yYXRpb258ZW58MXx8fHwxNzYyNDMzNjQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    raised: 15000,
    goal: 20000,
  },
  {
    id: 2,
    title: 'Heritage Education Programme',
    description: 'Fund educational workshops and school visits to inspire the next generation about Malaysian heritage and cultural preservation.',
    image: 'https://images.unsplash.com/photo-1716016761758-85ee3d6c3c01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJpdGFnZSUyMGVkdWNhdGlvbiUyMGNoaWxkcmVuJTIwbXVzZXVtfGVufDF8fHx8MTc2MjQzMzY0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    raised: 8500,
    goal: 12000,
  },
  {
    id: 3,
    title: 'Malacca Conservation Project',
    description: 'Support the conservation of historic buildings in Melaka. Protect UNESCO World Heritage Sites for future generations.',
    image: 'https://images.unsplash.com/photo-1745865636112-3269c9fc40b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpYyUyMGJ1aWxkaW5nJTIwY29uc2VydmF0aW9ufGVufDF8fHx8MTc2MjQzMzY0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    raised: 22000,
    goal: 30000,
  },
  {
    id: 4,
    title: 'General Heritage Fund',
    description: 'Contribute to our general fund to support all heritage preservation efforts across Malaysia, including urgent conservation needs.',
    image: 'https://images.unsplash.com/photo-1685710734950-2f0c1ab9c04d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMGhlcml0YWdlJTIwcHJlc2VydmF0aW9ufGVufDF8fHx8MTc2MjQzMzY0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    raised: 45000,
    goal: 50000,
  },
];

export function DonateScreen({ onNavigate }: DonateScreenProps) {
  return (
    <div className="min-h-screen bg-[#FFFBEA] flex flex-col">
      {/* TOP-LEVEL: Main App Header */}
      <header className="bg-[#0A402F] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={bwmLogo} alt="BWM Logo" className="w-10 h-10 rounded-xl" />
        </div>
        <button className="text-[#FFFBEA]">
          <Bell size={24} />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6 overflow-y-auto pb-24">
        {/* Main Title */}
        <h1 className="text-[#333333] font-['Lora'] mb-6">Support Our Heritage</h1>

        {/* Campaign Cards */}
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const progress = (campaign.raised / campaign.goal) * 100;
            
            return (
              <div key={campaign.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                {/* Campaign Image */}
                <ImageWithFallback 
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-48 object-cover"
                />
                
                {/* Campaign Content */}
                <div className="p-4">
                  <h3 className="text-[#333333] font-['Lora'] mb-2">{campaign.title}</h3>
                  <p className="text-[#333333] opacity-70 font-['Inter'] mb-4">
                    {campaign.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-[#333333] font-['Inter']">
                        RM{campaign.raised.toLocaleString()} raised
                      </span>
                      <span className="text-[#333333] opacity-70 font-['Inter']">
                        RM{campaign.goal.toLocaleString()} goal
                      </span>
                    </div>
                    <Progress value={progress} className="h-2 bg-gray-200">
                      <div 
                        className="h-full bg-[#B48F5E] rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </Progress>
                  </div>
                  
                  {/* Donate Button */}
                  <Button className="w-full bg-[#0A402F] hover:bg-[#0A402F]/90 text-[#FFFBEA] h-12 rounded-xl font-['Inter']">
                    Donate Now
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* TOP-LEVEL: Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
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
            className="flex flex-col items-center gap-1 text-[#0A402F]"
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
