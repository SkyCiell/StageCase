import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../utils';
import { EventBadge } from '../ticket';

/**
 * Premium Ticket Category Selection Card
 */
export default function TicketCategoryCard({ 
  category, 
  quantity, 
  onChange, 
  accentColor = '#2D6F73' 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = quantity > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`boarding-pass-card transition-all duration-300 ${
        isSelected ? 'ring-2' : ''
      }`}
      style={{ ringColor: isSelected ? accentColor : 'transparent' }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-display font-black text-xl text-ivory">
                {category.name}
              </h3>
              {category.name.includes('VIP') && (
                <EventBadge variant="vip" className="text-[7px]">VIP</EventBadge>
              )}
            </div>

            <p className="text-sm text-text-secondary mb-3">
              {category.description}
            </p>

            {/* Availability */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-text-muted font-mono">Available:</span>
              <span className={`font-bold ${
                category.available < 50 ? 'text-warning' : 'text-success'
              }`}>
                {category.available} / {category.quota}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-[9px] font-mono text-text-muted uppercase tracking-wider mb-1">
              Price
            </div>
            <div className="font-display font-black text-2xl text-amber">
              {formatCurrency(category.price)}
            </div>
          </div>
        </div>

        {/* Benefits (Expandable) */}
        {category.benefits && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-text-muted hover:text-ivory transition-colors mb-4 flex items-center gap-2"
          >
            <span className="font-mono uppercase tracking-wider">
              {isExpanded ? '▼' : '▶'} View Benefits
            </span>
          </button>
        )}

        <AnimatePresence>
          {isExpanded && category.benefits && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <ul className="space-y-1 text-xs text-text-secondary pl-4">
                {category.benefits.map((benefit, i) => (
                  <li key={i} className="list-disc">{benefit}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
            Quantity
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onChange(Math.max(0, quantity - 1))}
              disabled={quantity === 0}
              className="w-8 h-8 border border-white/20 flex items-center justify-center font-bold text-ivory disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
            >
              −
            </button>

            <span className="w-12 text-center font-display font-black text-lg text-ivory">
              {quantity}
            </span>

            <button
              onClick={() => onChange(quantity + 1)}
              disabled={quantity >= category.available || quantity >= 10}
              className="w-8 h-8 border flex items-center justify-center font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
              style={{ 
                borderColor: accentColor, 
                color: accentColor 
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Subtotal */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between"
          >
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
              Subtotal
            </span>
            <span className="font-mono font-black text-lg" style={{ color: accentColor }}>
              {formatCurrency(category.price * quantity)}
            </span>
          </motion.div>
        )}
      </div>

      {/* Bottom Accent Line */}
      {isSelected && (
        <div className="h-[3px] bg-current" style={{ color: accentColor }} />
      )}
    </motion.div>
  );
}
