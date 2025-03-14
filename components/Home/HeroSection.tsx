import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative h-[750px] w-full overflow-visible">
      {/* Background Image with Overlay */}
      <Image
        src="/images/backgrounds/bg.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover brightness-50"
        fill
        priority
      />

      {/* Hero Content */}
      <div className="container absolute mx-auto inset-0 z-20 px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            GoMealsaver
            <br />
            <span className="text-amber-400">Solusi Cerdas</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
            GoMealsaver adalah penjualan makanan sisa dengan harga terjangkau
            untuk mengurangi pemborosan makanan.
          </p>

          {/* Search Form */}
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
            <input
              className="flex-1 rounded-full bg-black/80 py-4 px-8 text-lg text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              placeholder="Cari berdasarkan lokasi..."
            />
            <button
              type="submit"
              className="rounded-full bg-amber-500 hover:bg-amber-600 px-8 py-4 text-lg font-semibold whitespace-nowrap cursor-pointer transition-colors shadow-lg"
            >
              Jelajahi
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute -bottom-16 left-0 right-0 container mx-auto px-4">
        <div className="bg-black/90 rounded-xl p-6 text-white shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Stats Items */}
            {[
              { icon: 'house-2.svg', value: '382M', label: 'Makanan Tersedia' },
              {
                icon: 'profile-2user.svg',
                value: '9/10',
                label: 'Pelanggan Puas',
              },
              {
                icon: 'security-user.svg',
                value: '100%',
                label: 'Keamanan Tinggi',
              },
              { icon: 'global.svg', value: '183', label: 'Kota Terjangkau' },
            ].map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500">
                  <Image
                    src={`/images/icons/${stat.icon}`}
                    alt={stat.label}
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{stat.value}</h3>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
