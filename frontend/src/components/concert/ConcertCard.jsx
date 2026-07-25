import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../services/api';
import { formatDateShort, formatCurrency } from '../../utils';
import userImg0 from '../../assets/images/images.jpg';

const ConcertCard = ({ concert, index = 0 }) => {
  const minPrice = concert.ticketCategories?.length
    ? Math.min(...concert.ticketCategories.map(c => parseFloat(c.price)))
    : null;

  const posterSrc = concert.poster ? getImageUrl(concert.poster, 'posters') : userImg0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link to={`/concerts/${concert.slug}`} className="block h-full group">
        {/* Ticket Stub Style Card */}
        <div className="relative bg-[#8DA7CC] border-2 border-[#343C4E] shadow-2xl h-full flex flex-col justify-between overflow-hidden transition-all duration-300 group-hover:border-[#2A629C] group-hover:-translate-y-1 text-[#343C4E]">
          
          {/* Side Semi-Circle Notches for Ticket Stub Shape */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#728EB7] border-r-2 border-[#343C4E] z-20 pointer-events-none" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#728EB7] border-l-2 border-[#343C4E] z-20 pointer-events-none" />

          {/* Top Ticket Header Banner */}
          <div className="bg-[#343C4E] text-[#F5F3F5] px-4 py-2 font-mono text-[10px] uppercase font-bold tracking-widest flex items-center justify-between border-b border-[#F5F3F5]/20">
            <span>STAGECASE PASS #{1000 + (index * 137)}</span>
            <span className="bg-[#2A629C] px-2 py-0.5 text-[9px]">CRAYON CASE</span>
          </div>

          {/* Poster Image Area */}
          <div className="relative aspect-video overflow-hidden bg-[#343C4E]">
            <img
              src={posterSrc}
              alt={concert.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
            />
            <div className="absolute top-2 left-2 bg-[#2A629C] text-[#F5F3F5] font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 border border-[#F5F3F5]/20">
              {formatDateShort(concert.date)}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-4 relative">
            <div>
              <p className="text-[10px] font-mono font-bold text-[#2A629C] uppercase tracking-widest mb-1">
                ADMIT ONE • LIVE CONCERT
              </p>
              <h3 className="font-display font-black text-lg text-[#343C4E] group-hover:text-[#2A629C] transition-colors line-clamp-2 uppercase">
                {concert.title}
              </h3>
              {concert.venue && (
                <p className="text-xs font-sans text-[#343C4E]/80 mt-1 flex items-center gap-1">
                  <span>📍</span> {concert.venue.name}, {concert.venue.city}
                </p>
              )}
            </div>

            {/* Dotted Perforated Tear Line */}
            <div className="border-t-2 border-dashed border-[#343C4E]/30 pt-3 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-mono text-[#343C4E]/60 uppercase font-bold">Starts From</p>
                <p className="font-mono font-black text-[#343C4E] text-base">
                  {minPrice ? formatCurrency(minPrice) : 'Rp 350.000'}
                </p>
              </div>

              <div className="bg-[#343C4E] text-[#F5F3F5] group-hover:bg-[#2A629C] font-mono text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 transition-colors border border-[#F5F3F5]/20">
                Book Pass →
              </div>
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
};

export default ConcertCard;
