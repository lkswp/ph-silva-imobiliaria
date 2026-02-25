'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedTextProps {
    text: string | string[]
    className?: string
    once?: boolean
    el?: keyof JSX.IntrinsicElements
    delay?: number
}

const defaultAnimations = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.1,
        },
    },
}

export function AnimatedText({
    text,
    className,
    once = true,
    el: Wrapper = 'p',
    delay = 0,
}: AnimatedTextProps) {
    const textArray = Array.isArray(text) ? text : [text]

    return (
        <Wrapper className={className}>
            <motion.span
                initial="hidden"
                whileInView="visible"
                viewport={{ once, margin: '-50px' }}
                transition={{ staggerChildren: 0.05, delayChildren: delay }}
                className="inline-block"
            >
                {textArray.map((line, lineIndex) => (
                    <span key={`${line}-${lineIndex}`} className="block">
                        {line.split(' ').map((word, wordIndex) => (
                            <span className="inline-block" key={`${word}-${wordIndex}`}>
                                {word.split('').map((char, charIndex) => (
                                    <motion.span
                                        key={`${char}-${charIndex}`}
                                        className="inline-block"
                                        variants={defaultAnimations}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                                <span className="inline-block">&nbsp;</span>
                            </span>
                        ))}
                    </span>
                ))}
            </motion.span>
        </Wrapper>
    )
}
