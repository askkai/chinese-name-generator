import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Stars, Brain, Languages, Search, Lightbulb, Check, Clock } from 'lucide-react';

interface GeneratingPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const stages = [
  {
    id: 1,
    icon: Search,
    title: "Analyzing your preferences",
    description: "Our AI is examining your name style preferences",
    color: "from-blue-500 to-sky-300",
    duration: 1500
  },
  {
    id: 2,
    icon: Brain,
    title: "Consulting cultural database",
    description: "Finding the perfect Chinese characters that match your style",
    color: "from-purple-500 to-pink-300",
    duration: 1800
  },
  {
    id: 3,
    icon: Languages,
    title: "Crafting pronunciation",
    description: "Ensuring your name sounds natural in Mandarin",
    color: "from-amber-500 to-yellow-300",
    duration: 1600
  },
  {
    id: 4,
    icon: Lightbulb,
    title: "Evaluating meanings",
    description: "Selecting characters with positive cultural significance",
    color: "from-green-500 to-emerald-300",
    duration: 1400
  },
  {
    id: 5,
    icon: Stars,
    title: "Creating final names",
    description: "Assembling your unique Chinese identity",
    color: "from-pink-500 to-rose-300",
    duration: 1700
  },
  {
    id: 6,
    icon: Check,
    title: "Almost done!",
    description: "Preparing your beautiful results",
    color: "from-indigo-500 to-violet-300",
    duration: 1000
  }
];

const GeneratingPopup = ({ isOpen, onClose }: GeneratingPopupProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [funFacts, setFunFacts] = useState<string[]>([
    "In Chinese culture, names are often chosen based on aspirations for the child's future.",
    "A good Chinese name balances how it sounds, what it means, and how it looks when written.",
    "Many Chinese names contain wishes for qualities like wisdom, strength, or beauty.",
    "Traditional Chinese names often follow the format: family name + generation name + personal name.",
    "Characters with positive meanings like 'prosperity', 'brightness', and 'elegance' are popular in names.",
    "The most common Chinese surname is Wang (王), meaning 'king'.",
    "Some Chinese choose names that reflect elements like water, wood, fire, earth, and metal.",
    "Chinese characters can have multiple meanings, making names rich with symbolism.",
    "Modern Chinese parents sometimes choose names that work well in both Chinese and English."
  ]);
  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStage(0);
      setProgress(0);
      return;
    }

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 0.5;
        return newProgress <= 100 ? newProgress : 100;
      });
    }, 120);

    // Stage progression
    let stageTimeout: NodeJS.Timeout;
    if (currentStage < stages.length) {
      stageTimeout = setTimeout(() => {
        setCurrentStage(prev => {
          const next = prev + 1;
          return next < stages.length ? next : prev;
        });
      }, stages[currentStage]?.duration || 1500);
    }

    // Rotate fun facts
    const factInterval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % funFacts.length);
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stageTimeout);
      clearInterval(factInterval);
    };
  }, [isOpen, currentStage, funFacts.length]);

  // Close popup when 100% complete
  useEffect(() => {
    if (progress === 100) {
      const closeTimeout = setTimeout(() => {
        onClose();
      }, 500);
      return () => clearTimeout(closeTimeout);
    }
  }, [progress, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-white/10"
          >
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  initial={{ 
                    x: `${Math.random() * 100}%`, 
                    y: `${Math.random() * 100}%`, 
                    opacity: Math.random() * 0.5 + 0.3 
                  }}
                  animate={{ 
                    x: `${Math.random() * 100}%`, 
                    y: `${Math.random() * 100}%`,
                    opacity: [Math.random() * 0.5 + 0.3, Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.3],
                  }}
                  transition={{ 
                    duration: Math.random() * 10 + 10, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ 
                    width: `${Math.random() * 6 + 2}px`, 
                    height: `${Math.random() * 6 + 2}px` 
                  }}
                />
              ))}
            </div>

            <div className="relative">
              {/* Header */}
              <div className="flex items-center justify-center mb-8">
                <Sparkles className="w-7 h-7 text-pink-400 mr-3" />
                <h2 className="text-2xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                  Creating Your Chinese Name
                </h2>
              </div>

              {/* Progress bar */}
              <div className="mb-8">
                <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                    style={{ width: `${progress}%` }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-400">
                  <span>Analyzing</span>
                  <span>{Math.round(progress)}%</span>
                  <span>Complete</span>
                </div>
              </div>

              {/* Stages */}
              <div className="space-y-6 mb-8">
                {stages.map((stage, index) => {
                  const Icon = stage.icon;
                  const isActive = index === currentStage;
                  const isComplete = index < currentStage;

                  return (
                    <motion.div
                      key={stage.id}
                      className={`flex items-start space-x-4 ${isActive ? 'opacity-100' : isComplete ? 'opacity-60' : 'opacity-30'}`}
                      initial={isActive ? { scale: 0.95 } : {}}
                      animate={isActive ? { scale: 1 } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`mt-0.5 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br ${isActive ? stage.color : 'from-gray-600 to-gray-500'} shadow-lg ${isActive ? 'shadow-' + stage.color.split('-')[1].split(' ')[0] + '/20' : ''}`}>
                        {isComplete ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <Icon className={`w-5 h-5 text-white ${isActive ? 'animate-pulse' : ''}`} />
                        )}
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
                          {stage.title}
                        </h3>
                        <p className="text-sm text-gray-400">{stage.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Fun fact section */}
              <motion.div
                key={currentFact}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-indigo-500/20 p-2 rounded-lg mr-3">
                    <Clock className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-indigo-300 mb-1">Did you know?</h4>
                    <p className="text-sm text-gray-300">{funFacts[currentFact]}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GeneratingPopup; 