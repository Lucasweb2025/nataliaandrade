import { motion } from 'framer-motion'

export default function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <header className="marble-bg relative overflow-hidden border-b border-gold/10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-gold/5 rounded-full blur-[80px]" />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 relative z-10 text-center">
        <motion.p
          className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="text-sm text-warm-gray max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            {subtitle}
          </motion.p>
        )}
        {children}
      </div>
    </header>
  )
}
