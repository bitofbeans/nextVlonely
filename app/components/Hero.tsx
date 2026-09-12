import HeroSVG from '../(home)/HeroSVG'
import Image from 'next/image';

const heroWidths = {
  default: "w-[93.6vw] sm:w-[90vw] max-w-[1100px]",
  narrow: "w-[70vw] sm:w-[30vw] max-w-[1000px]",
};

export default function Hero({
  source, 
  children, 
  size = "default"
}: {
  source: string, 
  children?: React.ReactNode, 
  size?: keyof typeof heroWidths
}) {
  return (
    <div className={`relative mx-auto my-[33vh] sm:my-[20vh] ${heroWidths[size]} animate-fade-in`}>
        <Image
        src={source}
        alt="hero"
        width={1920}
        height={1080}
        sizes="(max-width: 640px) 94vw, (max-width: 1222px) 90vw, 1100px"
        priority
        />

        {children}
    </div>
  );
}
