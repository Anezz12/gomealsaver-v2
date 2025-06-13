import SearchMeals from '@/components/meals/SearchMeals';
import MealsPromoPageRender from '@/components/Promo/MealsPromoRender';
import connectDB from '@/config/database';
import Meal from '@/models/Meals';
import Image from 'next/image';
import { convertToObject } from '@/utils/convertToObject';

export default async function PromoPage() {
  await connectDB();
  const meals = await Meal.find({}).sort({ createdAt: -1 }).lean();
  const serializedMeals = convertToObject(meals);

  return (
    <>
      <section className="relative bg-[#141414] py-24 md:py-32">
        {/* Background pattern/overlay */}
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/backgrounds/bg.png"
            alt="Background Pattern"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 flex flex-col items-center sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            {/* Promo Badge */}
            <div className="inline-flex items-center bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 animate-pulse">
              🔥 PROMO SPESIAL HARI INI
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Hemat Hingga <span className="text-amber-500">70%</span> Makanan
              Premium!
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Dapatkan makanan berkualitas tinggi dengan harga super hemat.
              Penawaran terbatas, buruan sebelum kehabisan!
            </p>
          </div>
          <SearchMeals />
        </div>
      </section>

      <section className="bg-[#0c0c0c] px-4 py-12 md:py-16">
        <div className="container-xl lg:container m-auto px-4">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-center">
              Promo Terbaik Hari Ini
            </h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto mb-4"></div>
            <p className="text-gray-400 text-center max-w-2xl mx-auto">
              Pilihan makanan dengan penawaran terbaik dan diskon menggiurkan.
              Stok terbatas, order sekarang juga!
            </p>
          </div>

          {serializedMeals.length === 0 ? (
            <div className="bg-[#141414] p-8 rounded-lg text-center">
              <div className="text-4xl mb-4">😔</div>
              <p className="text-gray-400 text-lg">
                Belum ada promo tersedia saat ini.
              </p>
              <p className="text-gray-500 mt-2">
                Pantau terus halaman ini untuk mendapatkan penawaran menarik!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {serializedMeals.map((meal: any) => (
                <MealsPromoPageRender key={meal._id} meal={meal} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
