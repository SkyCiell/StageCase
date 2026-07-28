/**
 * Booking Timeline Component
 * Concert pass inspired progress indicator
 */
export default function TicketTimeline({ currentStep, steps, accentColor = '#B89B5E' }) {
  return (
    <div className="relative">
      {/* Timeline Bar */}
      <div className="absolute top-4 left-0 right-0 h-[1px] bg-white/10" />
      <div 
        className="absolute top-4 left-0 h-[1px] transition-all duration-500"
        style={{ 
          width: `${(currentStep / (steps.length - 1)) * 100}%`,
          backgroundColor: accentColor
        }}
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              {/* Step Circle */}
              <div 
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'bg-current' : 'bg-graphite'
                }`}
                style={{ 
                  borderColor: isActive ? accentColor : 'rgba(255,255,255,0.1)',
                  color: accentColor
                }}
              >
                <span className={`text-xs font-black ${isActive ? 'text-graphite' : 'text-text-muted'}`}>
                  {index + 1}
                </span>
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center">
                <div className={`text-[10px] font-mono font-bold tracking-[0.15em] uppercase ${
                  isCurrent ? 'text-current' : isActive ? 'text-ivory' : 'text-text-muted'
                }`}
                     style={isCurrent ? { color: accentColor } : {}}>
                  {step.label}
                </div>
                {step.sublabel && (
                  <div className="text-[9px] text-text-muted mt-1">{step.sublabel}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative Perforations */}
      <div className="absolute -bottom-4 left-0 right-0 h-[1px] opacity-20"
           style={{
             backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 10px)',
           }}
      />
    </div>
  );
}
