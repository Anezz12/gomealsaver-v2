import Image from 'next/image';

interface MealsHeaderImageProps {
  image: string;
}

export default function MealsHeaderImage({ image }: MealsHeaderImageProps) {
  return (
    <section className=" container-xl m-auto">
      <div className=" grid grid-cols-1">
        <Image
          src={image}
          alt=""
          className=" object-cover h-[500px] w-full"
          width={0}
          height={0}
          sizes="100vw"
        />
      </div>
    </section>
  );
}
