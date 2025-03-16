import Image from 'next/image';
import Link from 'next/link';

// Customer review card component
interface Review {
  id: number;
  content: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export default function CustomerReviewCard() {
  // Array of reviews with unique customer data focused on food experience
  const reviews: Review[] = [
    {
      id: 1,
      content:
        'Makanan dari GoMealSaver masih sangat segar dan lezat. Saya senang bisa membantu mengurangi limbah makanan sambil menikmati hidangan yang enak.',
      name: 'Putri Kartika',
      role: 'Mahasiswa',
      avatarUrl: '/profile.png',
    },
    {
      id: 2,
      content:
        'Harganya sangat terjangkau untuk makanan berkualitas. Saya pasti akan pesan lagi!',
      name: 'Budi Santoso',
      role: 'Food Blogger',
      avatarUrl: '/photos/photo-2.png',
    },
    {
      id: 3,
      content:
        'Sebagai pemilik restoran, saya sangat mendukung konsep GoMealSaver. Ini membantu bisnis kami mengurangi limbah dan menjangkau lebih banyak pelanggan.',
      name: 'Diana Chen',
      role: 'Pemilik Restoran',
      avatarUrl: '/profile.png',
    },
    {
      id: 4,
      content:
        'Harga terjangkau tapi kualitas tetap premium. Cocok untuk budget mahasiswa seperti saya.',
      name: 'Ari Santoso',
      role: 'Mahasiswa',
      avatarUrl: '/profile.png',
    },
    {
      id: 5,
      content:
        'Aplikasi yang mudah digunakan dan pengiriman cepat. Makanan masih hangat saat sampai di rumah.',
      name: 'Jessica Kim',
      role: 'Pegawai Kantor',
      avatarUrl: '/profile.png',
    },
    {
      id: 6,
      content:
        'Selama WFH, GoMealSaver menjadi andalan saya untuk makan siang. Hemat uang dan waktu, plus mendukung lingkungan.',
      name: 'Rahmat Hidayat',
      role: 'Digital Nomad',
      avatarUrl: '/profile.png',
    },
    {
      id: 7,
      content:
        'Sebagai kritikus makanan, saya sangat mengapresiasi kualitas hidangan dari GoMealSaver. Ini membuktikan bahwa makanan surplus tidak berarti kurang lezat.',
      name: 'Sarah Johnson',
      role: 'Kritikus Makanan',
      avatarUrl: '/profile.png',
    },
    {
      id: 8,
      content:
        'Konsep yang sangat inovatif dan dibutuhkan di era saat ini. Lezat, terjangkau, dan ramah lingkungan!',
      name: 'David Lee',
      role: 'Pengusaha Tech',
      avatarUrl: '/profile.png',
    },
    {
      id: 9,
      content:
        'Saya selalu mencari cara untuk mendukung bisnis berkelanjutan. GoMealSaver adalah solusi sempurna untuk menikmati makanan enak sambil berkontribusi positif.',
      name: 'Natasha Singh',
      role: 'Travel Influencer',
      avatarUrl: '/profile.png',
    },
  ];

  // Reusable review card component
  const ReviewCard = ({ review }: { review: Review }) => (
    <div className="mb-[30px] space-y-[20px] rounded-[20px] bg-[#141414] px-5 py-4">
      <Image
        src="/images/icons/stars.svg"
        alt="5-star rating"
        width={120}
        height={24}
      />
      <p className="text-base md:text-lg leading-7 md:leading-8">
        {review.content}
      </p>
      <div className="flex items-center space-x-3">
        <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
          <Image
            src={review.avatarUrl}
            alt={review.name}
            width={50}
            height={50}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-base font-semibold">{review.name}</h1>
          <p className="text-sm text-[#A8A8AB]">{review.role}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="mx-auto mt-[60px] md:mt-[100px] max-w-[1280px] space-y-[20px] md:space-y-[30px] px-4 sm:px-6 md:px-[75px]">
      <div className="text-center">
        <h1 className="text-[22px] md:text-[28px] font-bold text-white">
          Pelanggan Kami yang Puas
        </h1>
        <p className="text-base md:text-lg text-[#A8A8AB]">
          Bergabunglah dan rasakan manfaatnya
        </p>
      </div>

      {/* Mobile view: Single column grid */}
      <div className="grid grid-cols-1 gap-4 md:hidden text-white">
        {reviews.slice(0, 4).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Tablet view: Two columns grid */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-[20px] text-white">
        {reviews.slice(0, 6).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Desktop view: Three columns masonry */}
      <div className="hidden lg:block text-white">
        <div className="columns-1 xs:columns-2 md:columns-3 gap-[30px]">
          {reviews.map((review) => (
            <div key={review.id} className="break-inside-avoid">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-6 md:mt-8">
        <Link
          href="/reviews"
          className="inline-block px-4 py-2 md:px-6 md:py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-full transition-colors"
        >
          Lihat Semua Ulasan
        </Link>
      </div>
    </section>
  );
}
