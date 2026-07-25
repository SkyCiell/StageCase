import { motion } from 'framer-motion';

/**
 * Editorial Hero Section
 * Large-scale, cinematic hero with asymmetric layout
 * Inspired by music festival posters and album artwork
 */
export default function EditorialHero({ 
  title, 
  subtitle, 
  description, 
  primaryAction, 
  secondaryAction,
  backgroundImage,
  overlayPattern = 'stage',
  children 
}) {
  const overlayClass = overlayPattern === 'stage' ? 'backdrop-stage' : 'backdrop-editorial';

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Ken Burns effect */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <div className="image-cinematic w-full h-full">
            <img 
              src={backgroundImage} 
              alt="" 
              className="w-full h-full object-cover animate-ken-burns"
            />
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className={`absolute inset-0 ${overlayClass}`} />
        </div>
      )}

      {/* Content */}
      <div className="container-editorial relative z-10">
        <div className="editorial-grid">
          {/* Main content - asymmetric positioning */}
          <motion.div 
            className="col-span-12 lg:col-span-7 lg:col-start-2 space-y-8 py-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {/* Subtitle/Label */}
            {subtitle && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-label text-bronze">{subtitle}</span>
              </motion.div>
            )}

            {/* Hero Title */}
            <motion.h1 
              className="headline-hero"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {title}
            </motion.h1>

            {/* Description */}
            {description && (
              <motion.p 
                className="text-body-large max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {description}
              </motion.p>
            )}

            {/* Actions */}
            {(primaryAction || secondaryAction) && (
              <motion.div 
                className="flex flex-wrap gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                {primaryAction}
                {secondaryAction}
              </motion.div>
            )}

            {/* Custom children */}
            {children && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 1.2,
          repeat: Infinity,
          repeatType: 'reverse',
          repeatDelay: 0.5
        }}
      >
        <div className="flex flex-col items-center gap-2 text-text-muted">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <svg 
            width="12" 
            height="20" 
            viewBox="0 0 12 20" 
            fill="none" 
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 2V18M6 18L2 14M6 18L10 14" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
