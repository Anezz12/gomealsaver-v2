'use client';

import { useState } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  EmailIcon,
  TelegramShareButton,
  TelegramIcon,
} from 'react-share';
import { FaShare } from 'react-icons/fa';

interface Meal {
  _id: string;
  name: string;
  cuisine: string;
}

interface ShareButtonProps {
  meal: Meal;
  isMobile?: boolean;
}

export default function ShareButton({
  meal,
  isMobile = false,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrl = `${
    process.env.NEXT_PUBLIC_DOMAIN || 'https://gomealsaver.com'
  }/meals/${meal._id}`;

  // Function to toggle share panel
  const toggleSharePanel = () => setIsOpen(!isOpen);

  // Share platforms with custom colors matching amber theme
  const platforms = [
    {
      name: 'Facebook',
      Button: FacebookShareButton,
      Icon: FacebookIcon,
      props: {
        url: shareUrl,
        title: meal.name,
        hashtag: `#${meal.cuisine.replace(/\s/g, '')}forBuy`,
      },
    },
    {
      name: 'Twitter',
      Button: TwitterShareButton,
      Icon: TwitterIcon,
      props: {
        url: shareUrl,
        title: meal.name,
        hashtags: [`${meal.cuisine.replace(/\s/g, '')}forBuy`],
      },
    },
    {
      name: 'WhatsApp',
      Button: WhatsappShareButton,
      Icon: WhatsappIcon,
      props: {
        url: shareUrl,
        title: meal.name,
        separator: ': ',
      },
    },
    {
      name: 'Email',
      Button: EmailShareButton,
      Icon: EmailIcon,
      props: {
        url: shareUrl,
        subject: meal.name,
        body: `Check out this meal I found on ${shareUrl}`,
      },
    },
    {
      name: 'Telegram',
      Button: TelegramShareButton,
      Icon: TelegramIcon,
      props: {
        url: shareUrl,
        title: meal.name,
      },
    },
  ];

  // Mobile share button style
  if (isMobile) {
    return (
      <button
        onClick={toggleSharePanel}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
      >
        <FaShare />
        <span className="font-medium">Share</span>
      </button>
    );
  }

  return (
    <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-4 transition-all">
      <button
        onClick={toggleSharePanel}
        className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center gap-2 transition-all"
      >
        <FaShare className="text-amber-500" />
        <span>{isOpen ? 'Hide Options' : 'Share This Meal'}</span>
      </button>

      {isOpen && (
        <div className="mt-4">
          <div className="text-center mb-3">
            <p className="text-gray-400 text-sm">Choose platform:</p>
          </div>

          <div className="grid grid-cols-5 gap-2 justify-items-center">
            {platforms.map((platform) => {
              const { Button, Icon, props, name } = platform;
              return (
                <div key={name} className="flex flex-col items-center">
                  <Button
                    {...props}
                    className="transition-transform hover:scale-110"
                  >
                    <Icon size={36} round bgStyle={{ fill: '#b45309' }} />
                  </Button>
                  <span className="text-xs text-gray-400 mt-1">{name}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <input
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
                value={shareUrl}
                className="flex-1 bg-black/30 text-gray-300 text-sm p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  alert('Link copied to clipboard!');
                }}
                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
