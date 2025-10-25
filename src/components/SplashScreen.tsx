import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, TrendingUp } from "lucide-react";

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Auto-dismiss after 3.5 seconds
    const timer = setTimeout(() => {
      handleExit();
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      onClick={handleExit}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 cursor-pointer overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="text-center px-4 relative">
        {/* Decorative corner elements */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-20 left-10 sm:top-32 sm:left-20"
        >
          <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-white/30" />
        </motion.div>
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-20 right-10 sm:bottom-32 sm:right-20"
        >
          <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 text-white/30" />
        </motion.div>

        {/* Main Logo Container */}
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.1,
          }}
          className="relative"
        >
          {/* Animated glow rings */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 blur-3xl"
          >
            <div className="w-64 h-64 sm:w-96 sm:h-96 mx-auto bg-white/30 rounded-full" />
          </motion.div>

          {/* FNG Acronym with premium design */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Outer glow container */}
            <div className="relative inline-block">
              {/* Shadow layers for depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl sm:rounded-[3rem] blur-2xl transform translate-y-2" />
              
              {/* Main logo container */}
              <div className="relative inline-block bg-white rounded-3xl sm:rounded-[3rem] p-6 sm:p-10 md:p-14 shadow-2xl border-4 border-white/50">
                {/* Inner gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl sm:rounded-[3rem] opacity-50" />
                
                {/* FNG Text */}
                <h1 className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent"
                    style={{ 
                      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                      fontWeight: 900,
                      letterSpacing: '0.08em',
                      textShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                    }}>
                  FNG
                </h1>
              </div>
            </div>
          </motion.div>

          {/* Divider line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "60%", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-0.5 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-6 sm:mt-8"
          />

          {/* Full Company Name with staggered animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 sm:mt-8"
          >
            <div className="space-y-1">
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-white text-xl sm:text-2xl md:text-3xl tracking-widest font-light"
                style={{ letterSpacing: '0.2em' }}>
                FRESH
              </motion.p>
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-white text-xl sm:text-2xl md:text-3xl tracking-widest font-light"
                style={{ letterSpacing: '0.2em' }}>
                NOBLE
              </motion.p>
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-white text-xl sm:text-2xl md:text-3xl tracking-widest font-light"
                style={{ letterSpacing: '0.2em' }}>
                GRAND
              </motion.p>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-6 sm:mt-8"
          >
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-2.5 border border-white/20">
              <p className="text-white text-xs sm:text-sm md:text-base tracking-wide font-light">
                Save daily, grow steadily
              </p>
            </div>
          </motion.div>

          {/* Tap to continue hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{
              duration: 2,
              delay: 2,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
            className="mt-10 sm:mt-14"
          >
            <p className="text-white/50 text-xs sm:text-sm font-light">
              Tap anywhere to continue
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
