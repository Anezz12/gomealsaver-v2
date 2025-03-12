import Image from 'next/image';
import Link from 'next/link';

export default function BenefiteCard() {
  return (
    <section className="mx-auto mt-[60px] md:mt-[100px] flex flex-col md:flex-row max-w-[1280px] justify-between px-4 sm:px-6 md:px-[75px] gap-8 md:gap-0">
      <div className="max-w-full md:max-w-[383px] space-y-[20px] md:space-y-[30px]">
        <h1 className="text-[22px] md:text-[28px] font-bold text-white">
          Huge Benefits That Make You Feel Happier
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
            Checking faster without depositing
          </li>
          <li className="flex items-center text-base md:text-lg font-semibold text-white">
            <Image
              src="/images/icons/tick-circle.svg"
              alt="Checkmark"
              width={24}
              height={24}
              className="mr-3"
            />
            24/7 security guarding your place
          </li>
          <li className="flex items-center text-base md:text-lg font-semibold text-white">
            <Image
              src="/images/icons/tick-circle.svg"
              alt="Checkmark"
              width={24}
              height={24}
              className="mr-3"
            />
            Fast-internet access without lagging
          </li>
          <li className="flex items-center text-base md:text-lg font-semibold text-white">
            <Image
              src="/images/icons/tick-circle.svg"
              alt="Checkmark"
              width={24}
              height={24}
              className="mr-3"
            />
            High standard of layout of houses
          </li>
          <li className="flex items-center text-base md:text-lg font-semibold text-white">
            <Image
              src="/images/icons/tick-circle.svg"
              alt="Checkmark"
              width={24}
              height={24}
              className="mr-3"
            />
            All other benefits, we promise
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
            Call Sales
          </Link>
          <Link
            href="#"
            className="w-full sm:w-auto flex items-center justify-center px-5 py-3 bg-transparent border border-white/20 hover:bg-white/10 text-white font-medium rounded-full transition-colors"
          >
            All Benefits
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-[30px] text-white mt-8 md:mt-0">
        <Link href="#">
          <div className="relative h-[200px] w-full md:w-[310px] overflow-hidden rounded-3xl text-white">
            <div className="absolute flex h-full w-full items-end space-y-[14px] bg-gradient-to-b from-white/10 from-[46%] to-[#050211] to-[86%] p-5">
              <div className="flex w-full items-center justify-between">
                <h1 className="w-[170px] text-lg md:text-xl font-bold">
                  House for Office and Living
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
              src="/images/thumbnails/cover-5.png"
              alt="House for Office and Living"
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
                  House Nearby with Mall
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
              src="/images/thumbnails/cover-6.png"
              alt="House Nearby with Mall"
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
                  House Historical Building
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
              src="/images/thumbnails/cover-7.png"
              alt="House Historical Building"
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
                  Landed House with Park
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
              src="/images/thumbnails/cover-8.png"
              alt="Landed House with Park"
              fill
              className="object-cover"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
