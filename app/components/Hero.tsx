import HeroSVG from './HeroSVG'
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="relative mx-auto my-[33vh] sm:my-[20vh] w-[min(94vw,1100px)] sm:w-[min(90vw,1100px)] animate-fade-in">
        <Image
        src="/SVG/vlonelyWhite.svg"
        alt="vlonely"
        width={1920}
        height={1080}
        sizes="(max-width: 640px) 94vw, (max-width: 1222px) 90vw, 1100px"
        priority
        />

        {/* Decorations */}
        <HeroSVG src="/SVG/pinkHeart.svg" top={40} left={9} scale={7} variant="float" duration={5} delay={0} distance={-12} />
        <HeroSVG src="/SVG/orangeStar.svg" top={34} left={18} scale={7} variant="spin-slow" duration={14} delay={-4} />
        <HeroSVG src="/SVG/lightPinkHeart.svg" top={20.5} left={39.5} scale={7} variant="float-2" duration={7} delay={-3} distance={-18} />
        <HeroSVG src="/SVG/blueStar.svg" top={12.5} left={47.5} scale={7} variant="wiggle" duration={4.5} delay={-1.5} />
        {/* Text */}
        <HeroSVG src="/SVG/andText.svg" top={70} left={66} scale={10} variant="float-rotate" duration={6} delay={-2} distance={-1} />
        <HeroSVG src="/SVG/friendsText.svg" top={77.5} left={54.2} scale={35} variant="float" duration={5.8} delay={-4.2} distance={12} />
    </div>
  );
}
