import MainContainerDashboard from '@/components/Dashboard/MainContainerDashboard';
export default function HomeDashboard() {
  return (
    <MainContainerDashboard>
      <main className="md:ml-72 lg:ml-80 pt-16 md:pt-6 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Dashboard Overview
            </h1>
            <p className="text-gray-400 mt-1">
              Monitor your business performance and activities
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              {
                title: 'Total Sales',
                value: 'Rp24,780',
                change: '+12%',
              },
              {
                title: 'New Orders',
                value: '34',
                change: '+3.2%',
              },
              { title: 'Products', value: '48', change: '0%' },
              {
                title: 'Customers',
                value: '129',
                change: '+8.1%',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-black rounded-xl border border-gray-800 p-5 hover:border-gray-700 transition-colors"
              >
                <p className="text-gray-400 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-2 text-white">
                  {stat.value}
                </p>
                <div
                  className={`mt-1 ${
                    stat.change.startsWith('+')
                      ? 'text-amber-500'
                      : 'text-gray-400'
                  } text-xs font-medium`}
                >
                  {stat.change} this week
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-black rounded-xl border border-gray-800 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-white">
                Recent Activity
              </h2>
              <button className="text-amber-500 text-sm font-medium hover:text-amber-400 transition-colors px-4 py-2 bg-amber-900/30 rounded-lg self-start sm:self-auto">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  action: 'New order received',
                  time: '10 minutes ago',
                  amount: 'Rp350',
                },
                {
                  action: 'Payment confirmed',
                  time: '1 hour ago',
                  amount: 'Rp1,200',
                },
                {
                  action: 'Product added',
                  time: '3 hours ago',
                  amount: 'Vegetable Combo',
                },
                {
                  action: 'Customer message',
                  time: '6 hours ago',
                  amount: 'Support',
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-gray-900 rounded-lg transition-colors border border-gray-800"
                >
                  <div>
                    <p className="font-medium text-white">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                  <div className="text-amber-300 font-medium bg-amber-900/40 px-3 py-1 rounded-full text-sm">
                    {activity.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </MainContainerDashboard>
  );
}
