import MainContainerDashboard from '@/components/Dashboard/MainContainerDashboard';
import { ChefHat, Menu, ShoppingBag, BarChart3 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HomeDashboard() {
  return (
    <MainContainerDashboard>
      <main className="md:ml-72 lg:ml-80 pt-16 md:pt-6 min-h-screen ">
        <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
          <div className="text-center py-16">
            {/* Icon */}
            <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <ChefHat size={36} className="text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Selamat Datang di Dashboard Seller
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Kelola restoran dan menu makanan Anda melalui platform GoMealSaver
            </p>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Menu size={28} className="text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">
                  Kelola Menu
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Tambah, edit, dan atur menu makanan Anda dengan mudah
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag size={28} className="text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">
                  Pantau Pesanan
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Lihat dan kelola pesanan dari pelanggan secara real-time
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <BarChart3 size={28} className="text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">
                  Analisis Penjualan
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Lihat laporan dan statistik bisnis Anda secara detail
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Platform Food Rescue Terdepan
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  GoMealSaver membantu restaurant dan UMK mengurangi food waste
                  sekaligus memberikan kesempatan kepada konsumen untuk
                  mendapatkan makanan berkualitas dengan harga terjangkau.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MainContainerDashboard>
  );
}
