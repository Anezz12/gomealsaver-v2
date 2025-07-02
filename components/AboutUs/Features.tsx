'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Tab {
  id: string;
  label: string;
}

const Features: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('simple');

  const tabs: Tab[] = [
    { id: 'simple', label: 'Cheapest Price' },
    { id: 'speedy', label: 'Quality Guaranteed' },
    { id: 'easy', label: 'Easy to Order' },
  ];

  const handleTabClick = (tabId: string): void => {
    setActiveTab(tabId);
  };

  return (
    <>
      {/* Features heading */}
      <section id="features">
        <div className="container mx-auto mt-8 px-6 pt-20">
          <h2 className="mb-4 text-4xl font-semibold text-center text-amber-500">
            Delicious Leftovers at a Great Price
          </h2>
          <p className="max-w-md mx-auto text-center text-gray-400">
            Enjoy delicious quality food at a very affordable price. Save up to
            70% off the original price without compromising on enjoyment.
            Delicious Leftovers at a Great Price
          </p>
        </div>
      </section>

      {/* Features Tabs */}
      <section id="tabs">
        <div className="container relative mx-auto my-6 mb-32 mt-8 px-6">
          <div className="bg-tabs"></div>
          <div className="flex flex-col justify-center max-w-xl mx-auto mb-6 border-b border-amber-500 md:flex-row">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex-1 text-center cursor-pointer border-b-4 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-500'
                    : 'border-transparent text-amber-500 hover:text-amber-500'
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                <div className="py-5">{tab.label}</div>
              </div>
            ))}
          </div>

          {/* Tab Panels */}
          <div id="panels" className="container mx-auto">
            {/* Panel 1 */}
            <div className={`panel ${activeTab === 'simple' ? '' : 'hidden'}`}>
              <div className="flex flex-col py-5 md:flex-row md:space-x-7">
                <div className="flex justify-center md:w-1/2">
                  <Image
                    width={600}
                    height={200}
                    src="/images/abouts/harga-2.png"
                    alt="Cheapest Price"
                    className="relative z-10"
                  />
                </div>
                <div className="flex flex-col space-y-8 md:w-1/2">
                  <h3 className="mt-32 text-3xl font-semibold text-center md:mt-0 md:text-left text-amber-500">
                    Cheapest Price
                  </h3>
                  <p className="max-w-md text-center text-grayishBlue md:text-left">
                    Get quality food at up to 70%. We offer smart solutions to
                    reduce food wastage while providing very affordable. Despite
                    being leftovers, we guarantee quality and freshness. Each
                    dish goes through a rigorous checking process to ensure
                    palatability and deliciousness.
                  </p>
                  <div className="mx-auto md:mx-0">
                    <Link
                      href="/"
                      className="px-6 py-3 mt-4 font-semibold text-amber-500 border-2 border-amber-500 rounded-lg md:inline-flex bg-fern-green-500 hover:bg-white hover:text-black  hover:border-0"
                    >
                      See Promo
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 2 */}
            <div className={`panel ${activeTab === 'speedy' ? '' : 'hidden'}`}>
              <div className="flex flex-col py-5 md:flex-row md:space-x-7">
                <div className="flex justify-center md:w-1/2">
                  <Image
                    width={600}
                    height={500}
                    src="/images/abouts/kualitas-2.png"
                    alt="Quality Guaranteed"
                    className="relative z-10"
                  />
                </div>
                <div className="flex flex-col space-y-8 md:w-1/2">
                  <h3 className="mt-14 text-3xl font-semibold text-center md:mt-0 md:text-left text-amber-500">
                    Quality Guaranteed
                  </h3>
                  <p className="max-w-md text-center text-grayishBlue md:text-left">
                    Although it is leftover food, we guarantee its quality and
                    freshness. Each dish goes through a rigorous inspection
                    process to ensure its deliciousness and palatability.
                  </p>
                  <div className="mx-auto md:mx-0">
                    <Link
                      href="/"
                      className="px-6 py-3 mt-4 font-semibold text-amber-500 border-2 border-amber-500 rounded-lg md:inline-flex bg-fern-green-500 hover:bg-white hover:text-black  hover:border-0"
                    >
                      Quality Assurance
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 3 */}
            <div className={`panel ${activeTab === 'easy' ? '' : 'hidden'}`}>
              <div className="flex flex-col py-5 md:flex-row md:space-x-7">
                <div className="flex justify-center md:w-1/2">
                  <Image
                    width={400}
                    height={200}
                    src="/images/abouts/pesan-2.png"
                    alt="Order with Ease"
                    className="relative z-10"
                  />
                </div>
                <div className="flex flex-col space-y-8 md:w-1/2">
                  <h3 className="mt-14 text-3xl font-semibold text-center md:mt-0 md:text-left text-amber-500">
                    Order with Ease
                  </h3>
                  <p className="max-w-md text-center text-grayishBlue md:text-left">
                    The ordering process is quick and simple. Choose, order and
                    enjoy quality leftovers in minutes through our app or
                    website.
                  </p>
                  <div className="mx-auto md:mx-0">
                    <Link
                      href="/"
                      className="px-6 py-3 mt-4 font-semibold text-amber-500 border-2 border-amber-500 rounded-lg md:inline-flex bg-fern-green-500 hover:bg-white hover:text-black  hover:border-0"
                    >
                      Start Order
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
