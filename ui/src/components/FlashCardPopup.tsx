import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import axios from "axios";
import { X, ExternalLink, RotateCw, Brain, CheckCircle2 } from "lucide-react";
import { useUser } from "../context/UserContext";
import { SERVICE_API_BASE_URL } from "../../env";

interface Flashcard {
  id: number;
  title: string;
  frontText: string;
  backText: string;
  referenceLink: string;
  availableOn: string;
  topicLogoUrl: string;
}

export default function FlashCardPopup({ flashcard }: { flashcard: Flashcard }) {
  const { user } = useUser();
  const [show, setShow] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [viewed, setViewed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    if (flashcard.availableOn === today) setShow(true);
  }, [user, flashcard]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!show) return;
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        handleFlip();
      } else if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, flipped]);

  const markViewed = async () => {
    if (viewed) return;
    try {
      await axios.post(
        `${SERVICE_API_BASE_URL}/flashcard-views/view`,
        { flashcardId: flashcard.id },
        { withCredentials: true }
      );
      setViewed(true);
    } catch (err) {
      console.error("Error marking viewed:", err);
    }
  };

  const handleFlip = () => {
    setFlipped((prev) => !prev);
    if (!flipped) {
      markViewed();
    }
  };

  const handleClose = () => {
    setShow(false);
    markViewed();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (!show || !user) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-xl p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-lg"
            >
              {/* Close Button */}
              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -top-4 -right-4 z-20 bg-white rounded-full p-3 shadow-2xl hover:shadow-xl transition-all"
              >
                <X className="w-5 h-5 text-gray-800" />
              </motion.button>

              {/* Progress Indicator */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-2 mb-4">
                <motion.div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    !flipped ? "bg-white scale-125" : "bg-white/30"
                  }`}
                  animate={{ scale: !flipped ? 1.25 : 1 }}
                />
                <motion.div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    flipped ? "bg-white scale-125" : "bg-white/30"
                  }`}
                  animate={{ scale: flipped ? 1.25 : 1 }}
                />
              </div>

              {/* Card Container with 3D Tilt */}
              <motion.div
                ref={cardRef}
                className="relative cursor-pointer"
                style={{
                  perspective: "2000px",
                  rotateX,
                  rotateY,
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleFlip}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="relative w-full"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
                >
                  {/* FRONT SIDE */}
                  <div
                    className="relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
                    style={{ 
                      backfaceVisibility: "hidden",
                      boxShadow: "0 25px 80px -20px rgba(0, 0, 0, 0.3)",
                    }}
                  >

                    {/* Header with Logo */}
                    <div className="relative px-5 py-3.5 overflow-hidden" style={{ backgroundColor: '#0094ff' }}>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="relative flex items-center gap-4">
                        {flashcard.topicLogoUrl && (
                          <motion.div 
                            className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl flex items-center justify-center flex-shrink-0"
                          >
                            <img
                              src={flashcard.topicLogoUrl}
                              alt="Topic"
                              className="w-full h-full object-contain"
                            />
                          </motion.div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="w-4 h-4 text-white animate-pulse" />
                            <span className="text-white font-bold text-base tracking-wide">
                              Daily Facts
                            </span>
                          </div>
                          <h3 className="text-white/90 text-sm font-semibold">
                            {new Date(flashcard.availableOn).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-7 py-8">
                      <motion.h2 
                        className="text-2xl font-extrabold mb-4 leading-tight"
                        style={{ color: "#0094ff" }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {flashcard.title}
                      </motion.h2>
                      <motion.p 
                        className="text-gray-700 text-base leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {flashcard.frontText}
                      </motion.p>
                    </div>

                    {/* Footer */}
                    <div className="px-7 pb-7 flex justify-center">
                      <motion.div 
                        className="inline-flex flex-col items-center gap-2 text-white rounded-2xl px-6 py-3.5 shadow-lg hover:shadow-xl transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ backgroundColor: '#0094ff' }}
                      >
                        <div className="flex items-center gap-3">
                          <RotateCw className="w-5 h-5 animate-spin" style={{ animationDuration: "3s" }} />
                          <span className="font-bold text-base">
                            Reveal Answer
                          </span>
                        </div>
                        <kbd className="flex items-center gap-1.5 px-2 py-0.5 bg-white/20 rounded text-xs font-bold">
                          <span>Space</span>
                          <span className="text-[10px]">⎵</span>
                        </kbd>
                      </motion.div>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div
                    className="absolute top-0 left-0 w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      boxShadow: "0 25px 80px -20px rgba(0, 0, 0, 0.3)",
                    }}
                  >

                    {/* Header with Logo */}
                    <div className="relative bg-teal-600 px-5 py-3.5 overflow-hidden">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="relative flex items-center gap-4">
                        {flashcard.topicLogoUrl && (
                          <motion.div 
                            className="w-14 h-14 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl flex items-center justify-center flex-shrink-0"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5, type: "spring" }}
                          >
                            <img
                              src={flashcard.topicLogoUrl}
                              alt="Topic"
                              className="w-full h-full object-contain"
                            />
                          </motion.div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.6, type: "spring" }}
                            >
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            </motion.div>
                            <span className="text-white font-bold text-base tracking-wide">
                              Answer
                            </span>
                          </div>
                          <h3 className="text-white/90 text-sm font-semibold truncate">
                            {flashcard.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-7 py-8">
                      <motion.p 
                        className="text-gray-800 text-base leading-relaxed mb-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        {flashcard.backText}
                      </motion.p>
                      
                      {flashcard.referenceLink && (
                        <motion.a
                          href={flashcard.referenceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-bold text-sm group transition-colors"  
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span className="border-b-2 border-teal-300 group-hover:border-teal-600 transition-colors">
                            Learn more
                          </span>
                        </motion.a>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-7 pb-7 flex justify-center">
                      <motion.div 
                        className="inline-flex flex-col items-center gap-2 bg-teal-600 text-white rounded-2xl px-6 py-3.5 shadow-lg hover:shadow-xl transition-all"
                        whileHover={{ scale: 1.05}}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex items-center gap-3">
                          <RotateCw className="w-5 h-5 animate-spin" style={{ animationDuration: "3s" }} />
                          <span className="font-bold text-base">
                            Back to Question
                          </span>
                        </div>
                        <kbd className="flex items-center gap-1.5 px-2 py-0.5 bg-white/20 rounded text-xs font-bold">
                          <span>Space</span>
                          <span className="text-[10px]">⎵</span>
                        </kbd>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}