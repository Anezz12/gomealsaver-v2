import Link from 'next/link';

export default function CategoriesCard() {
  return (
    <section className="mt-[100px] bg-[#141414] py-[30px] md:py-[50px]">
      <div className="mx-auto max-w-[1280px] space-y-[20px] md:space-y-[30px] px-4 sm:px-6 md:px-[75px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-[22px] md:text-[28px] font-bold text-white">
              Food Categories
            </h1>
            <p className="text-base md:text-lg text-[#A8A8AB]">
              Discover meals from every cuisine
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-block px-4 py-2 md:px-6 md:py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full transition-colors"
          >
            Browse All Categories
          </Link>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[30px]">
          <Link href="/categories/restaurants">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <div className="h-7 w-7 md:h-9 md:w-9 flex items-center justify-center">
                <svg
                  className="w-full h-full text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">
                  Restaurants
                </h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">
                  2,450+ meals
                </p>
              </div>
            </div>
          </Link>

          <Link href="/categories/bakery">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <div className="h-7 w-7 md:h-9 md:w-9 flex items-center justify-center">
                <svg
                  className="w-full h-full text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12,3A4,4 0 0,1 16,7A4,4 0 0,1 12,11A4,4 0 0,1 8,7A4,4 0 0,1 12,3M12,5A2,2 0 0,0 10,7A2,2 0 0,0 12,9A2,2 0 0,0 14,7A2,2 0 0,0 12,5M2,20V18C2,15.88 5.31,14.67 9.5,14.26C9.5,14.26 9.5,14.26 9.5,14.26C9.5,14.26 9.5,14.26 9.5,14.26C9.64,14.24 9.78,14.23 9.92,14.22C10.1,14.21 10.27,14.2 10.45,14.2C11.41,14.2 12.3,14.39 13.06,14.73C13.5,14.9 13.9,15.11 14.26,15.35C14.61,15.58 14.92,15.84 15.19,16.11C15.45,16.38 15.67,16.67 15.84,16.97C15.94,17.13 16.03,17.29 16.1,17.45C16.17,17.61 16.22,17.78 16.26,17.95C16.29,18.04 16.31,18.12 16.33,18.21C16.34,18.3 16.35,18.39 16.36,18.48C16.37,18.65 16.37,18.82 16.37,19V20H2Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">Bakery</h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">
                  1,820+ items
                </p>
              </div>
            </div>
          </Link>

          <Link href="/categories/cafe">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <div className="h-7 w-7 md:h-9 md:w-9 flex items-center justify-center">
                <svg
                  className="w-full h-full text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2,21V19H20V21H2M20,8V5L18,5V8A4,4 0 0,1 14,12A4,4 0 0,1 10,8V5H8V8A6,6 0 0,0 14,14A6,6 0 0,0 20,8M16,5V8A2,2 0 0,0 18,6V5H16Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">Café</h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">
                  950+ drinks
                </p>
              </div>
            </div>
          </Link>

          <Link href="/categories/grocery">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <div className="h-7 w-7 md:h-9 md:w-9 flex items-center justify-center">
                <svg
                  className="w-full h-full text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19,7H16V6A4,4 0 0,0 12,2A4,4 0 0,0 8,6V7H5A1,1 0 0,0 4,8V19A3,3 0 0,0 7,22H17A3,3 0 0,0 20,19V8A1,1 0 0,0 19,7M10,6A2,2 0 0,1 12,4A2,2 0 0,1 14,6V7H10V6M18,19A1,1 0 0,1 17,20H7A1,1 0 0,1 6,19V9H8V10A1,1 0 0,0 10,10A1,1 0 0,0 10,8V9H14V10A1,1 0 0,0 16,10A1,1 0 0,0 14,8V9H18V19Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">Grocery</h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">
                  3,200+ products
                </p>
              </div>
            </div>
          </Link>

          <Link href="/categories/fast-food">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <div className="h-7 w-7 md:h-9 md:w-9 flex items-center justify-center">
                <svg
                  className="w-full h-full text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22,13A9,9 0 0,1 13,22C7.57,22 3.1,18.14 2.18,13H22M12,2A9,9 0 0,1 21,11H3C3,6.04 6.94,2 12,2Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">Fast Food</h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">
                  1,650+ meals
                </p>
              </div>
            </div>
          </Link>

          <Link href="/categories/dessert">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <div className="h-7 w-7 md:h-9 md:w-9 flex items-center justify-center">
                <svg
                  className="w-full h-full text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12C21,7.83 18.21,4.24 14.39,3.29L12,12L9.61,3.29C8.51,3.56 7.48,4.02 6.58,4.63L12,12L5.05,8.8C4.41,9.76 4,10.86 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,8.78 18.28,5.94 15.68,4.26L12,12L15.68,4.26C14.93,3.83 14.1,3.5 13.22,3.32L12,12L10.78,3.32C11.18,3.24 11.59,3.2 12,3.2V3Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">Desserts</h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">
                  780+ sweets
                </p>
              </div>
            </div>
          </Link>

          <Link href="/categories/vegetarian">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <div className="h-7 w-7 md:h-9 md:w-9 flex items-center justify-center">
                <svg
                  className="w-full h-full text-green-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">Vegetarian</h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">
                  520+ options
                </p>
              </div>
            </div>
          </Link>

          <Link href="/categories/local-cuisine">
            <div className="flex items-center space-x-4 rounded-[20px] bg-[#202020] px-5 py-4 text-white hover:bg-[#2a2a2a] transition-colors">
              <div className="h-7 w-7 md:h-9 md:w-9 flex items-center justify-center">
                <svg
                  className="w-full h-full text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.5,1.5C10.73,1.5 9.17,2.67 8.42,4.37C8.34,4.16 8.24,3.96 8.11,3.78C7.32,2.5 5.97,1.5 4.39,1.5C1.97,1.5 0,3.5 0,6C0,8.5 1.97,10.5 4.39,10.5C5.97,10.5 7.32,9.5 8.11,8.22C8.24,8.04 8.34,7.84 8.42,7.63C9.17,9.33 10.73,10.5 12.5,10.5C15.54,10.5 18,8.04 18,5C18,2.96 15.54,1.5 12.5,1.5M12.5,15C12.5,15 21,11 21,6.5C21,4.57 19.43,3 17.5,3C16.04,3 14.8,3.91 14.2,5.18C13.9,4.24 13.23,3.5 12.5,3.5C10.57,3.5 9,5.07 9,7C9,11.5 12.5,15 12.5,15Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg md:text-[20px] font-bold">
                  Local Cuisine
                </h1>
                <p className="text-sm md:text-base text-[#A8A8AB]">
                  1,100+ dishes
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
