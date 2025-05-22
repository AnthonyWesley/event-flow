// components/GoalAchievedModal.tsx
import { useEffect } from "react";
import { motion } from "framer-motion";

interface GoalAchievedModalProps {
  onClose: () => void;
}

export default function GoalAchievedModal({ onClose }: GoalAchievedModalProps) {
  useEffect(() => {
    const timeout = setTimeout(onClose, 5000); // fecha após 5 segundos
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl"
      >
        <h2 className="mb-4 text-2xl font-bold text-teal-600">Parabéns! 🎉</h2>
        <p className="text-gray-700">Você alcançou sua meta com sucesso.</p>
      </motion.div>
    </div>
  );
}
