import Image from 'next/image';
import Link from 'next/link';

// Customer review card component
interface review {
  id: number;
  content: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export default function CustomerReviewCard() {
  // Array of reviews with unique customer data
  const reviews: review[] = [
    {
      id: 1,
      content:
        'I was not so sure if there was a beautiful bedroom, but it was really great experience.',
      name: 'Evelin Bie',
      role: 'Full-Time Traveler',
      avatarUrl: '/images/photos/photo-1.png',
    },
    {
      id: 2,
      content: "It's just amazing, will be back.",
      name: 'Michael Wong',
      role: 'Food Blogger',
      avatarUrl: '/images/photos/photo-2.png',
    },
    {
      id: 3,
      content:
        'I was not so sure if there was a beautiful bedroom, but it was really great experience.',
      name: 'Diana Chen',
      role: 'Restaurant Owner',
      avatarUrl: '/images/photos/photo-3.png',
    },
    {
      id: 4,
      content: 'Price was too low yet luxury.',
      name: 'Ari Santoso',
      role: 'Student',
      avatarUrl: '/images/photos/photo-4.png',
    },
    {
      id: 5,
      content:
        'I was not so sure if there was a beautiful bedroom, but it was really great experience.',
      name: 'Jessica Kim',
      role: 'Office Worker',
      avatarUrl: '/images/photos/photo-5.png',
    },
    {
      id: 6,
      content:
        'During covid I was stayed here and I got a lot of full of supports that I need to keep my body healthy.',
      name: 'Rahmat Hidayat',
      role: 'Digital Nomad',
      avatarUrl: '/images/photos/photo-6.png',
    },
    {
      id: 7,
      content:
        'I was not so sure if there was a beautiful bedroom, but it was really great experience.',
      name: 'Sarah Johnson',
      role: 'Food Critic',
      avatarUrl: '/images/photos/photo-7.png',
    },
    {
      id: 8,
      content: "It's just amazing, will be back.",
      name: 'David Lee',
      role: 'Tech Entrepreneur',
      avatarUrl: '/images/photos/photo-8.png',
    },
    {
      id: 9,
      content:
        'I was not so sure if there was a beautiful bedroom, but it was really great experience.',
      name: 'Natasha Singh',
      role: 'Travel Influencer',
      avatarUrl: '/images/photos/photo-9.png',
    },
  ];

  // Reusable review card component
  const ReviewCard = ({ review }: { review: review }) => (
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
          Happy Customers
        </h1>
        <p className="text-base md:text-lg text-[#A8A8AB]">
          {"  We'd love to come back again soon"}
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
          View All Reviews
        </Link>
      </div>
    </section>
  );
}
