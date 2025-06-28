'use client';

import { useState, useEffect } from 'react';

export default function Asked() {
  const [openTab, setOpenTab] = useState<number | null>(null);

  const handleTabClick = (tabIndex: number) => {
    setOpenTab(openTab === tabIndex ? null : tabIndex);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.tab-container')) {
      setOpenTab(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <section id="faq-accordion" className="w-full">
      <div className="w-full border-t border-amber-500" />
      {/* Title Section */}
      <div className="text-center mb-8 pt-8">
        <h2 className="text-3xl font-bold text-amber-500 mb-4">FAQ</h2>
        <p className="text-white max-w-2xl mx-auto px-6">
          Frequently Asked Questions About GoMealSaver
        </p>
      </div>

      <div className="container mx-auto px-6 mb-32">
        <div className="max-w-2xl m-8 mx-auto overflow-hidden tab-container">
          {[
            {
              question: "What's GoMealSaver?",
              answer:
                'GoMealSaver waste while saving money. Our app connects you with nearby restaurants and food stores that offer quality food at discounted prices before it goes to waste. With smart search features, real-time chat system, easy ordering, and secure transactions, GoMealSaver makes food rescue easier and more enjoyable.',
            },
            {
              question: 'How to find food in GoMealSaver?',
              answer:
                "Our search feature is super easy to use! Simply enter your location, and you'll see a list of food available nearby. You can filter by food type, region, etc.",
            },
            {
              question: 'How does the GomealSaver chat system work?',
              answer:
                'Our chat feature lets you communicate directly with seller to inquire about food details, pick-up times, or other customized information. Chat is available before and after order to ensure a smooth shopping experience.',
            },
            {
              question: 'How do I place an order and make payment?',
              answer:
                'Ordering on GomealSaver is super easy! Select the food you want, click the order button. Payment is made directly at store when picking up the order. Once the order is confirmed, you will receive a digital proof of order and pickup. All transactions are recorded in our system, and you can view your full order history on your profile.',
            },
          ].map((item, index) => (
            <div key={index} className="py-1 border-b outline-none group">
              <div
                className="flex items-center justify-between py-3 cursor-pointer group"
                onClick={() => handleTabClick(index + 1)}
              >
                <div
                  className={`transition duration-500 ease group-hover:text-white ${
                    openTab === index + 1 ? 'text-white' : 'text-amber-500'
                  }`}
                >
                  {item.question}
                </div>
                <div
                  className={`transition duration-500 ease ${
                    openTab === index + 1
                      ? 'rotate-180 text-fern-green-500'
                      : ''
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="12"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      d="M1 1l8 8 8-8"
                    />
                  </svg>
                </div>
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ease ${
                  openTab === index + 1 ? 'max-h-screen' : 'max-h-0'
                }`}
              >
                <p className="py-2 text-justify text-gray-400">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full border-b border-amber-500 mt-12" />
    </section>
  );
}
