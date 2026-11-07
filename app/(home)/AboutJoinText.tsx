"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

const text = "join vlonely&friends today!";

export default function AboutJoinText() {
    const textRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.fromTo("[data-wave-char]", { y: -3 }, {
                y: 3,
                duration: 0.9,
                ease: "sine.inOut",
                stagger: {
                    each: 0.06,
                    repeat: -1,
                    yoyo: true,
                },
            });
        }, textRef);

        return () => media.revert();
    }, []);

    return (
        <strong ref={textRef}>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">
                {text.split(" ").map((word, wordIndex) => (
                    <span key={wordIndex}>
                        {wordIndex > 0 && " "}
                        <span className="inline-block whitespace-nowrap">
                            {Array.from(word).map((character, characterIndex) => (
                                <span className="inline-block" data-wave-char key={characterIndex}>
                                    {character}
                                </span>
                            ))}
                        </span>
                    </span>
                ))}
            </span>
        </strong>
    );
}
