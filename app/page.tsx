import BenefiteCard from '@/components/Home/BenefitCard';
import CategoriesCard from '@/components/Home/CategoriesCard';
import CustomerReviewCard from '@/components/Home/CustomerReviewCard';
import HeroSection from '@/components/Home/HeroSection';
import MealsCard from '@/components/Home/MealsCard';
export default function Home() {
  return (
    <>
      <HeroSection />
      <MealsCard />
      <CategoriesCard />
      <BenefiteCard />
      <CustomerReviewCard />
    </>
  );
}
