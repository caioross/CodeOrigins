import { useProgress } from '@react-three/drei';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LoadingScreen() {
    const { active, progress, errors, item, loaded, total } = useProgress();
    const isLoading = useStore(state => state.isLoading);
    const [show, setShow] = useState(true);

    const isCurrentlyLoading = active || isLoading;

    useEffect(() => {
        let timeoutId: number;
        if (isCurrentlyLoading) {
            setShow(true);
        } else {
            timeoutId = window.setTimeout(() => setShow(false), 50); // Snappier disappearance
        }
        return () => clearTimeout(timeoutId);
    }, [isCurrentlyLoading]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 p-4 w-72 rounded-xl bg-black/80 border border-white/10 shadow-2xl backdrop-blur-xl text-white pointer-events-none"
                >
                    <div className="flex items-center gap-3">
                        <Loader2 size={24} className="animate-spin text-indigo-500 shadow-indigo-500/50" />
                        <div className="flex-1 min-w-0">
                            <h2 className="text-sm font-bold tracking-tight">Code Origins</h2>
                            <p className="text-xs text-gray-400 truncate w-full">
                                {active ? `Carregando: ${item ? item.split('/').pop() : 'recursos'}...` : 'Processando dados...'}
                            </p>
                        </div>
                    </div>

                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: active ? `${progress}%` : (isLoading ? '100%' : '0%') }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>

                    {active && total > 0 && (
                        <div className="flex justify-between w-full text-[10px] text-gray-500 font-mono">
                            <span>{loaded} / {total} arquivos</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
