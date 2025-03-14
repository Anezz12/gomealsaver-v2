'use client';
import { FormEvent, useState } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function SearchMeals() {
  const [location, setLocation] = useState('');
  const [mealType, setMealType] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (location === '' && mealType === 'All') {
      router.push('/meals');
    } else {
      const query = `?location=${location}&mealType=${mealType}`;
      router.push(`/meals/search-results${query}`);
    }
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 mx-auto max-w-2xl w-full p-4 sm:p-5 bg-[#141414]/90 backdrop-blur-md rounded-xl shadow-xl border border-white/10"
    >
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-3/5 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FiMapPin className="h-5 w-5 text-amber-500" />
          </div>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Masukkan lokasi..."
            className="w-full pl-10 pr-4 py-3 rounded-full bg-[#202020] text-white placeholder-gray-400
                     border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 
                     transition-all duration-300"
          />
        </div>

        <div className="w-full md:w-2/5 relative">
          <select
            id="meal-type"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full px-5 py-3 rounded-full appearance-none bg-[#202020] text-white
                     border border-gray-700 focus:outline-none focus:ring-2 
                     focus:ring-amber-500 transition-all duration-300"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f59e0b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.5em 1.5em',
            }}
          >
            <option value="All">Semua Makanan</option>
            <option value="Asian Cuisine">Masakan Asia</option>
            <option value="Indonesian Cuisine">Masakan Indonesia</option>
            <option value="Western Cuisine">Masakan Barat</option>
            <option value="Local Delights">Hidangan Lokal</option>
            <option value="Other">Lainnya</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-6 py-3 rounded-full bg-amber-500 text-white font-medium
                   hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 
                   transition-all duration-300 flex items-center justify-center gap-2
                   disabled:bg-amber-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <FiSearch className="h-5 w-5" />
              <span>Cari</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
