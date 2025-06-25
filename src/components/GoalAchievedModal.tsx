import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface GoalAchievedModalProps {
  onClose: () => void;
}

export default function GoalAchievedModal({ onClose }: GoalAchievedModalProps) {
  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });

      if (Date.now() > animationEnd) {
        clearInterval(interval);
      }
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow-xl"
      >
        <h2 className="mb-4 text-2xl font-bold text-teal-600">Parabéns! 🎉</h2>
        <p className="mb-4 text-gray-700">
          Você alcançou sua meta com sucesso.
        </p>

        <button
          onClick={onClose}
          className="mt-2 rounded bg-teal-600 px-4 py-2 font-semibold text-white transition hover:bg-teal-700"
        >
          Fechar
        </button>
      </motion.div>
    </div>
  );
}
