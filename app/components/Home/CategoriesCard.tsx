import Image from 'next/image';
import Link from 'next/link';

export default function CategoriesCard() {
  return (
    <section className="mt-[100px] bg-[#141414] py-[30px] md:py-[50px]">
      <div className="mx-auto max-w-[1280px] space-y-[20px] md:space-y-[30px] px-4 sm:px-6 md:px-[75px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-[22px] md:text-[28px] font-bold text-white">
              Categories
            </h1>
            <p className="text-base md:text-lg text-[#A8A8AB]">
              We provide everything
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-block px-4 py-2 md:px-6 md:py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full transition-colors"
          >
            Explore All
          </Link>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[30px]">
          <Link href="/categories/star-hills">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <Image
                src="/images/icons/microscope.svg"
                alt="Star Hills Icon"
                className="h-7 w-7 md:h-9 md:w-9"
                height={100}
                width={200}
              />
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">Star Hills</h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">18,394</p>
              </div>
            </div>
          </Link>

          <Link href="/categories/apartment">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <Image
                src="/images/icons/buildings.svg"
                alt="Apartment Icon"
                className="h-7 w-7 md:h-9 md:w-9"
                height={100}
                width={200}
              />
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">Apartment</h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">18,394</p>
              </div>
            </div>
          </Link>

          <Link href="/categories/nearby-city">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <Image
                src="/images/icons/house-2 copy.svg"
                alt="Nearby City Icon"
                className="h-7 w-7 md:h-9 md:w-9"
                height={100}
                width={200}
              />
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">
                  Nearby City
                </h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">18,394</p>
              </div>
            </div>
          </Link>

          <Link href="/categories/landed-house">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <Image
                src="/images/icons/building-4.svg"
                alt="Landed House Icon"
                className="h-7 w-7 md:h-9 md:w-9"
                height={100}
                width={200}
              />
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">
                  Landed House
                </h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">18,394</p>
              </div>
            </div>
          </Link>

          <Link href="/categories/airport">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <Image
                src="/images/icons/airplane.svg"
                alt="Airport Icon"
                className="h-7 w-7 md:h-9 md:w-9"
                height={100}
                width={200}
              />
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">Airport</h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">18,394</p>
              </div>
            </div>
          </Link>

          <Link href="/categories/awards">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <Image
                src="/images/icons/cup.svg"
                alt="Awards Icon"
                className="h-7 w-7 md:h-9 md:w-9"
                height={100}
                width={200}
              />
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">Awards</h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">18,394</p>
              </div>
            </div>
          </Link>

          <Link href="/categories/sunset">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <Image
                src="/images/icons/sun-fog.svg"
                alt="Sunset Icon"
                className="h-7 w-7 md:h-9 md:w-9"
                height={100}
                width={200}
              />
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">Sunset</h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">18,394</p>
              </div>
            </div>
          </Link>

          <Link href="/categories/others">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <Image
                src="/images/icons/element-equal.svg"
                alt="Others Icon"
                className="h-7 w-7 md:h-9 md:w-9"
                height={100}
                width={200}
              />
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">Others</h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">18,394</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
