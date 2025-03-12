import Image from 'next/image';
import Link from 'next/link';

export default function BenefiteCard() {
  return (
    <section className="mx-auto mt-[60px] md:mt-[100px] flex flex-col md:flex-row max-w-[1280px] justify-between px-4 sm:px-6 md:px-[75px] gap-8 md:gap-0">
      <div className="max-w-full md:max-w-[383px] space-y-[20px] md:space-y-[30px]">
        <h1 className="text-[22px] md:text-[28px] font-bold text-white">
          Solusi Cerdas untuk Mengurangi Limbah Makanan
        </h1>
        <ul className="space-y-3 md:space-y-5">
          <li className="flex items-center text-base md:text-lg font-semibold text-white">
            <Image
              src="/images/icons/tick-circle.svg"
              alt="Checkmark"
              width={24}
              height={24}
              className="mr-3"
            />
            Harga terjangkau untuk semua orang
          </li>
          <li className="flex items-center text-base md:text-lg font-semibold text-white">
            <Image
              src="/images/icons/tick-circle.svg"
              alt="Checkmark"
              width={24}
              height={24}
              className="mr-3"
            />
            Makanan berkualitas dari restoran terpercaya
          </li>
          <li className="flex items-center text-base md:text-lg font-semibold text-white">
            <Image
              src="/images/icons/tick-circle.svg"
              alt="Checkmark"
              width={24}
              height={24}
              className="mr-3"
            />
            Pengiriman cepat ke lokasi Anda
          </li>
          <li className="flex items-center text-base md:text-lg font-semibold text-white">
            <Image
              src="/images/icons/tick-circle.svg"
              alt="Checkmark"
              width={24}
              height={24}
              className="mr-3"
            />
            Membantu mengurangi limbah makanan
          </li>
          <li className="flex items-center text-base md:text-lg font-semibold text-white">
            <Image
              src="/images/icons/tick-circle.svg"
              alt="Checkmark"
              width={24}
              height={24}
              className="mr-3"
            />
            Mendukung keberlanjutan lingkungan
          </li>
        </ul>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:space-x-[14px]">
          <Link
            href="#"
            className="w-full sm:w-auto flex items-center justify-center px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full transition-colors"
          >
            <Image
              src="/images/icons/message-notif.svg"
              alt="Message"
              width={20}
              height={20}
              className="mr-[10px]"
            />
            Hubungi Kami
          </Link>
          <Link
            href="#"
            className="w-full sm:w-auto flex items-center justify-center px-5 py-3 bg-transparent border border-white/20 hover:bg-white/10 text-white font-medium rounded-full transition-colors"
          >
            Tentang GoMealSaver
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-[30px] text-white mt-8 md:mt-0">
        <Link href="#">
          <div className="relative h-[200px] w-full md:w-[310px] overflow-hidden rounded-3xl text-white">
            <div className="absolute flex h-full w-full items-end space-y-[14px] bg-gradient-to-b from-white/10 from-[46%] to-[#050211] to-[86%] p-5">
              <div className="flex w-full items-center justify-between">
                <h1 className="w-[170px] text-lg md:text-xl font-bold">
                  Hidangan Indonesia Tradisional
                </h1>
                <div className="flex items-center space-x-1">
                  <Image
                    src="/images/icons/profile-2user copy.svg"
                    alt="User Icon"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm md:text-base">18,309</p>
                </div>
              </div>
            </div>
            <Image
              src="/food/gado-gado.jpeg"
              alt="Gado-gado tradisional"
              fill
              className="object-cover"
            />
          </div>
        </Link>

        <Link href="#">
          <div className="relative h-[200px] w-full md:w-[310px] overflow-hidden rounded-3xl text-white">
            <div className="absolute flex h-full w-full items-end space-y-[14px] bg-gradient-to-b from-white/10 from-[46%] to-[#050211] to-[86%] p-5">
              <div className="flex w-full items-center justify-between">
                <h1 className="w-[170px] text-lg md:text-xl font-bold">
                  Hidangan Berkuah Lezat
                </h1>
                <div className="flex items-center space-x-1">
                  <Image
                    src="/images/icons/profile-2user copy.svg"
                    alt="User Icon"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm md:text-base">84,209</p>
                </div>
              </div>
            </div>
            <Image
              src="/food/bakso.jpg"
              alt="Bakso berkuah"
              fill
              className="object-cover"
            />
          </div>
        </Link>

        <Link href="#">
          <div className="relative h-[200px] w-full md:w-[310px] overflow-hidden rounded-3xl text-white">
            <div className="absolute flex h-full w-full items-end space-y-[14px] bg-gradient-to-b from-white/10 from-[46%] to-[#050211] to-[86%] p-5">
              <div className="flex w-full items-center justify-between">
                <h1 className="w-[170px] text-lg md:text-xl font-bold">
                  Hidangan Panggang Populer
                </h1>
                <div className="flex items-center space-x-1">
                  <Image
                    src="/images/icons/profile-2user copy.svg"
                    alt="User Icon"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm md:text-base">22,409</p>
                </div>
              </div>
            </div>
            <Image
              src="/food/ayam-bakar.jpg"
              alt="Ayam bakar spesial"
              fill
              className="object-cover"
            />
          </div>
        </Link>

        <Link href="#">
          <div className="relative h-[200px] w-full md:w-[310px] overflow-hidden rounded-3xl text-white">
            <div className="absolute flex h-full w-full items-end space-y-[14px] bg-gradient-to-b from-white/10 from-[46%] to-[#050211] to-[86%] p-5">
              <div className="flex w-full items-center justify-between">
                <h1 className="w-[170px] text-lg md:text-xl font-bold">
                  Sup Tradisional Indonesia
                </h1>
                <div className="flex items-center space-x-1">
                  <Image
                    src="/images/icons/profile-2user copy.svg"
                    alt="User Icon"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm md:text-base">47,583</p>
                </div>
              </div>
            </div>
            <Image
              src="/food/soto.jpg"
              alt="Soto ayam spesial"
              fill
              className="object-cover"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
