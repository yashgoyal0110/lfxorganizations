import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { X, ExternalLink, RotateCw, Sparkles } from "lucide-react";
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

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    if (flashcard.availableOn === today) setShow(true);
  }, [user, flashcard]);

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
    if (!flipped) markViewed();
  };

  const handleClose = () => {
    setShow(false);
    markViewed();
  };

  if (!show || !user) return null;

 return (
    <AnimatePresence>
      {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={handleClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute -top-2 -right-2 z-20 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>

            {/* Card Container with 3D Flip */}
            <div
              className="relative cursor-pointer"
              style={{ perspective: "1500px" }}
              onClick={handleFlip}
            >
              <motion.div
                className="relative w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
              >
                {/* FRONT SIDE */}
                <div
                  className="relative w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* Header with Logo */}
                  <div className="relative bg-gradient-to-br from-blue-400 via-sky-400 to-cyan-400 px-5 py-4">
                    <div className="flex items-center gap-3">
                      {flashcard.topicLogoUrl && (
                        <div className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg flex items-center justify-center flex-shrink-0">
                          <img
                            src={flashcard.topicLogoUrl}
                            alt="Topic"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-white font-semibold text-sm">
                            Daily Facts
                          </span>
                        </div>
                        <h3 className="text-white/90 text-xs font-medium truncate">
                          {new Date(flashcard.availableOn).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-5 py-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      {flashcard.title}
                    </h2>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {flashcard.frontText}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="px-5 pb-5 flex justify-center">
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-100 transition-colors">
                      <RotateCw className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-blue-700 font-semibold text-xs">
                        Reveal Answer
                      </span>
                    </div>
                  </div>
                </div>

                {/* BACK SIDE */}
                <div
                  className="absolute top-0 left-0 w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {/* Header with Logo */}
                  <div className="relative bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-500 px-5 py-4">
                    <div className="flex items-center gap-3">
                      {flashcard.topicLogoUrl && (
                        <div className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg flex items-center justify-center flex-shrink-0">
                          <img
                            src={flashcard.topicLogoUrl}
                            alt="Topic"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div className="w-4 h-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <span className="text-white font-semibold text-sm">
                            Answer
                          </span>
                        </div>
                        <h3 className="text-white/90 text-xs font-medium truncate">
                          {flashcard.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-5 py-6">
                    <p className="text-gray-800 text-sm leading-relaxed mb-4">
                      {flashcard.backText}
                    </p>
                    
                    {flashcard.referenceLink && (
                      <a
                        href={flashcard.referenceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-xs group transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        <span className="border-b border-blue-300 group-hover:border-blue-500 transition-colors">
                          Learn more
                        </span>
                      </a>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-5 pb-5 flex justify-center">
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-100 transition-colors">
                      <RotateCw className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-blue-700 font-semibold text-xs">
                        Back to Question
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}