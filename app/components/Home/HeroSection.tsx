import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative h-[750px] w-full md:h-[600px]">
      <Image
        src="/images/backgrounds/bg.png"
        alt=""
        className="absolute -z-10 h-full w-full object-cover object-center filter brightness-50"
        width={1920}
        height={1080}
        priority
      />
      <div className="z-50 mx-auto grid h-full w-full max-w-[1280px] items-center px-4 md:px-[75px]">
        <div>
          <div className="space-y-[10px] text-white">
            <h1 className="text-[40px] font-bold md:text-[55px] ">
              GoMealsaver
              <br />
              Solusi Cerdas
            </h1>
            <p className="w-full max-w-[80%] md:mx-0 md:w-1/3 text-base leading-loose text-white">
              GoMealsaver adalah penjualan makanan sisa dengan harga terjangkau
              untuk mengurangi pemborosan makanan.
            </p>
          </div>
          <form className="mt-[30px] flex flex-col items-center gap-4 md:mt-[50px] md:flex-row">
            <input
              className="w-full max-w-[400px] rounded-full bg-[#141414] py-4 px-6 text-[18px] text-[#A8A8A8] focus:outline-none md:py-5 md:text-[20px]"
              placeholder="Cari berdasarkan lokasi..."
            />
            <button
              type="submit"
              className="w-full max-w-[200px] rounded-full bg-amber-500 px-6 py-4 text-lg font-semibold md:w-auto md:px-10 md:py-5 md:text-[20px] cursor-pointer"
            >
              Jelajahi
            </button>
          </form>
        </div>
      </div>

      {/* Statistik Section */}
      <div className="md:absolute bottom-0 left-0 right-0 md:inset-x-0 md:-bottom-16 md:mx-auto md:max-w-[1280px] md:px-[75px]">
        <div className="mx-4 rounded-2xl bg-[#141414] px-4 py-6 text-white md:mx-0 md:px-[50px]">
          {/* Stats container - 2 rows on mobile */}
          <div className="grid grid-cols-2 gap-4 md:flex md:flex-nowrap md:justify-between md:gap-0">
            {/* Kos Available */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-amber-500 md:h-[60px] md:w-[60px] lg:h-[70px] lg:w-[70px]">
                <Image
                  src="/images/icons/house-2.svg"
                  alt="Makanan Tersedia Icon"
                  width={32}
                  height={32}
                  className="h-[30px] w-[30px] md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px]"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold md:text-xl lg:text-2xl">
                  382M
                </h1>
                <p className="text-xs font-normal text-[#A8A8AB] md:text-sm lg:text-base">
                  Makanan Tersedia
                </p>
              </div>
            </div>

            {/* People Happy */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-amber-500 md:h-[60px] md:w-[60px] lg:h-[70px] lg:w-[70px]">
                <Image
                  src="/images/icons/profile-2user.svg"
                  alt="Pelanggan Puas Icon"
                  width={32}
                  height={32}
                  className="h-[30px] w-[30px] md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px]"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold md:text-xl lg:text-2xl">
                  9/10
                </h1>
                <p className="text-xs font-normal text-[#A8A8AB] md:text-sm lg:text-base">
                  Pelanggan Puas
                </p>
              </div>
            </div>

            {/* High Security */}
            <section className="flex items-center space-x-2 md:space-x-4">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-amber-500 md:h-[60px] md:w-[60px] lg:h-[70px] lg:w-[70px]">
                <Image
                  src="/images/icons/security-user.svg"
                  alt="Keamanan Tinggi Icon"
                  width={32}
                  height={32}
                  className="h-[30px] w-[30px] md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px]"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold md:text-xl lg:text-2xl">
                  100%
                </h1>
                <p className="text-xs font-normal text-[#A8A8AB] md:text-sm lg:text-base">
                  Keamanan Tinggi
                </p>
              </div>
            </section>

            {/* Cities */}
            <section className="flex items-center space-x-2 md:space-x-4">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-amber-500 md:h-[60px] md:w-[60px] lg:h-[70px] lg:w-[70px]">
                <Image
                  src="/images/icons/global.svg"
                  alt="Kota Icon"
                  width={32}
                  height={32}
                  className="h-[30px] w-[30px] md:h-[40px] md:w-[40px] lg:h-[50px] lg:w-[50px]"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold md:text-xl lg:text-2xl">
                  183
                </h1>
                <p className="text-xs font-normal text-[#A8A8AB] md:text-sm lg:text-base">
                  Kota Terjangkau
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
