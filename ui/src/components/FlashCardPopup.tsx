import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { X } from "lucide-react";
import { useUser } from  "../context/UserContext";
import { SERVICE_API_BASE_URL } from "../../env";

interface Flashcard {
  id: number;
  title: string;
  frontText: string;
  backText: string;
  referenceLink: string;
  availableOn: string;
}

export default function FlashCardPopup({ flashcard }: { flashcard: Flashcard }) {
  const { user } = useUser();
  const [show, setShow] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [viewed, setViewed] = useState(false);

  // Show popup only if logged in + flashcard available today
  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    if (flashcard.availableOn === today) setShow(true);
  }, [user, flashcard]);

  // API call → mark flashcard viewed
  const markViewed = async () => {
    if (viewed) return;
    try {
      await axios.post(`${SERVICE_API_BASE_URL}/flashcard-views/view`, {
        flashcardId: flashcard.id,
      }, { withCredentials: true });
      setViewed(true);
    } catch (err) {
      console.error("Error marking viewed:", err);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
    markViewed();
  };

  if (!show || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShow(false)}
      >
        <motion.div
          className="relative w-[360px] h-[260px] md:w-[420px] md:h-[300px] cursor-pointer"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {/* Close Button */}
          <button
            className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 
                       rounded-full text-white border border-white/20 backdrop-blur-md"
            onClick={() => {
              setShow(false);
              markViewed();
            }}
          >
            <X size={20} />
          </button>

          {/* Card Container */}
          <motion.div
            className="w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
            animate={{ rotateY: flipped ? 180 : 0 }}
          >
            {/* FRONT SIDE */}
            <div className="absolute inset-0 bg-white rounded-2xl shadow-xl p-5
                            flex flex-col justify-center backface-hidden">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">
                {flashcard.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {flashcard.frontText}
              </p>

              <button
                onClick={handleFlip}
                className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r 
                           from-blue-500 to-purple-600 text-white shadow-md"
              >
                Flip →
              </button>
            </div>

            {/* BACK SIDE */}
            <div className="absolute inset-0 bg-gray-900 text-white rounded-2xl shadow-xl p-5 
                            flex flex-col justify-center [transform:rotateY(180deg)] backface-hidden">
              <h2 className="text-lg font-semibold mb-2">
                Answer
              </h2>
              <p className="text-sm leading-relaxed mb-3 text-gray-200 whitespace-pre-line">
                {flashcard.backText}
              </p>

              <a
                href={flashcard.referenceLink}
                target="_blank"
                className="underline text-blue-300 mb-3"
              >
                Reference Link
              </a>

              <button
                onClick={handleFlip}
                className="mt-2 px-4 py-2 rounded-xl bg-white/10 border
                           border-white/20 text-white hover:bg-white/20"
              >
                ← Go Back
              </button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
