import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Heart, 
  ListMusic, 
  Maximize2, 
  X,
  Radio
} from "lucide-react";

const DEFAULT_PLAYLIST = [
  {
    id: "p1",
    title: "Gravits",
    artist: "Crayon Case",
    album: "Catch Twenty-three!! (2024)",
    cover: "https://f4.bcbits.com/img/a3253599809_10.jpg",
    duration: "4:15",
    bandColor: "#2D6F73"
  },
  {
    id: "p2",
    title: "Anything You Want",
    artist: "Reality Club",
    album: "Reality Club Presents... (2023)",
    cover: "https://i.scdn.co/image/ab67616d0000b273c607bcd8355681ab4fac2968",
    duration: "3:50",
    bandColor: "#5D4E89"
  },
  {
    id: "p3",
    title: "Malaikat",
    artist: "The Milo",
    album: "Let Me Begin (2003)",
    cover: "https://i.scdn.co/image/ab67616d0000b273df3a0ec97de41c2cfadf70c5",
    duration: "5:10",
    bandColor: "#6E8B6B"
  },
  {
    id: "p4",
    title: "bad",
    artist: "Wave to Earth",
    album: "0.1 flaws and all. (2023)",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOcuS9GbJkWZ3XG2ISFvtzV7EbPJzcVmKZ-X8Y5YqXx_ZdlxmgqANb-Nbb&s=10",
    duration: "4:23",
    bandColor: "#4F6D8C"
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);
  const [progress] = useState(35); // simulated 35% progress

  const currentTrack = DEFAULT_PLAYLIST[currentTrackIdx];

  const handleNext = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % DEFAULT_PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + DEFAULT_PLAYLIST.length) % DEFAULT_PLAYLIST.length);
  };

  return (
    <>
      {/* Floating Mini Player Bar */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40">
        <div className="bg-card border border-border rounded-card p-3 shadow-modal flex items-center justify-between gap-3">
          
          {/* Left: Artwork & Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div 
              onClick={() => setShowExpanded(true)}
              className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 group cursor-pointer border border-border"
            >
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTrack.bandColor }} />
                <p className="text-xs font-semibold text-text-primary truncate">{currentTrack.title}</p>
              </div>
              <p className="text-[11px] text-muted truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Center/Right: Transport Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsLiked(!isLiked)} 
              className={`p-1.5 rounded-md hover:bg-surface transition-colors cursor-pointer ${
                isLiked ? "text-danger" : "text-muted hover:text-text-primary"
              }`}
              title="Favorite"
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>

            <button 
              onClick={handlePrev}
              className="p-1.5 text-muted hover:text-text-primary hover:bg-surface rounded-md transition-colors cursor-pointer"
              title="Previous"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full bg-primary text-text-primary hover:bg-[#357E82] transition-colors flex items-center justify-center cursor-pointer shadow-sm"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button 
              onClick={handleNext}
              className="p-1.5 text-muted hover:text-text-primary hover:bg-surface rounded-md transition-colors cursor-pointer"
              title="Next"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setShowQueue(!showQueue)}
              className={`p-1.5 rounded-md hover:bg-surface transition-colors cursor-pointer ${
                showQueue ? "text-accent" : "text-muted hover:text-text-primary"
              }`}
              title="Queue & List"
            >
              <ListMusic className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-surface h-1 rounded-full mt-1 overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-200" 
            style={{ width: `${progress}%`, backgroundColor: currentTrack.bandColor }} 
          />
        </div>
      </div>

      {/* Queue Drawer Modal */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 w-80 bg-card border border-border rounded-modal shadow-modal p-4 z-50 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-accent" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-text-primary">
                  Player Queue
                </h4>
              </div>
              <button 
                onClick={() => setShowQueue(false)}
                className="text-muted hover:text-text-primary p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {DEFAULT_PLAYLIST.map((track, i) => (
                <div
                  key={track.id}
                  onClick={() => { setCurrentTrackIdx(i); setIsPlaying(true); }}
                  className={`flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer text-xs ${
                    i === currentTrackIdx ? "bg-surface border border-border font-semibold text-text-primary" : "hover:bg-surface/50 text-text-secondary"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={track.cover} alt={track.title} className="w-8 h-8 rounded object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-xs">{track.title}</p>
                      <p className="truncate text-[10px] text-muted">{track.artist}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-muted">{track.duration}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Artwork View Modal */}
      <AnimatePresence>
        {showExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="modal-premium max-w-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-mono uppercase text-muted tracking-wider">Now Playing</span>
                <button onClick={() => setShowExpanded(false)} className="text-muted hover:text-text-primary cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Large Artwork */}
              <div className="aspect-square w-full rounded-card overflow-hidden border border-border shadow-card">
                <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-1 text-center">
                <h3 className="text-lg font-bold text-text-primary">{currentTrack.title}</h3>
                <p className="text-xs text-accent font-medium">{currentTrack.artist}</p>
                <p className="text-[11px] text-muted font-mono">{currentTrack.album}</p>
              </div>

              {/* Transport */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button onClick={handlePrev} className="btn-secondary p-2.5 rounded-full">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button onClick={() => setIsPlaying(!isPlaying)} className="btn-primary p-3 rounded-full">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
                <button onClick={handleNext} className="btn-secondary p-2.5 rounded-full">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
