'use client'

import { motion } from 'framer-motion'

interface ScrollRevealProps {
    children: React.ReactNode
    className?: string
    width?: 'fit-content' | '100%'
    delay?: number
}

export function ScrollReveal({ children, className, width = '100%', delay = 0 }: ScrollRevealProps) {
    return (
        <div style={{ width }} className={className}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay, ease: 'easeOut' }}
            >
                {children}
            </motion.div>
        </div>
    )
}
