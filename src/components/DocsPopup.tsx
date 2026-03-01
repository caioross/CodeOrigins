import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DocsPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const docsPages = [
    { id: 'intro', title: 'Introduction', path: '/data/docs/intro.md' },
    { id: 'lore', title: 'Lore & Narrative', path: '/data/docs/lore.md' },
    { id: 'architecture', title: 'Architecture', path: '/data/docs/architecture.md' },
    { id: 'tech_stack', title: 'Tech Stack', path: '/data/docs/tech_stack.md' },
    { id: 'features', title: 'Features', path: '/data/docs/features.md' },
    { id: 'mechanics', title: 'Mechanics & Navigation', path: '/data/docs/mechanics.md' },
    { id: 'data_structure', title: 'Data Structure', path: '/data/docs/data_structure.md' },
    { id: 'components_guide', title: 'Components Guide', path: '/data/docs/components_guide.md' },
    { id: 'i18n', title: 'Internationalization (i18n)', path: '/data/docs/i18n.md' },
    { id: 'contributing', title: 'Contributing', path: '/data/docs/contributing.md' },
    { id: 'community', title: 'Community & License', path: '/data/docs/community.md' },
    { id: 'faq', title: 'FAQ', path: '/data/docs/faq.md' }
];

export function DocsPopup({ isOpen, onClose }: DocsPopupProps) {
    const [activePage, setActivePage] = useState(docsPages[0]);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(true);
        fetch(activePage.path)
            .then(res => res.text())
            .then(text => setContent(text))
            .catch(() => setContent('# Error\nFailed to load documentation.'))
            .finally(() => setIsLoading(false));
    }, [activePage, isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 pointer-events-auto"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex overflow-hidden relative"
                >
                    {/* Sidebar */}
                    <div className="w-64 bg-black/40 border-r border-white/10 flex flex-col hidden sm:flex">
                        <div className="p-4 border-b border-white/10 flex items-center gap-2 text-indigo-400 font-bold">
                            <Book size={20} />
                            Documentation
                        </div>
                        <div className="p-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1">
                            {docsPages.map(page => (
                                <button
                                    key={page.id}
                                    onClick={() => setActivePage(page)}
                                    className={`px-3 py-2 text-sm text-left rounded-lg transition-colors ${activePage.id === page.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {page.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col relative overflow-hidden">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors z-10"
                        >
                            <X size={20} />
                        </button>
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full text-indigo-400">Loading...</div>
                            ) : (
                                <div className="max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-6 mb-4 text-white" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-5 mb-3 text-indigo-300" {...props} />,
                                            h3: ({ node, ...props }) => <h3 className="text-xl font-medium mt-4 mb-2 text-indigo-200" {...props} />,
                                            p: ({ node, ...props }) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1" {...props} />,
                                            li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                                            a: ({ node, ...props }) => <a className="text-indigo-400 hover:underline" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 mb-4 text-gray-400 italic bg-white/5 rounded-r" {...props} />,
                                            code: ({ node, inline, className, children, ...props }: any) => {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return inline ?
                                                    <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-300" {...props}>{children}</code>
                                                    :
                                                    <div className="relative group mb-4">
                                                        <div className="absolute top-0 right-0 px-2 py-1 text-xs text-gray-500 bg-white/5 rounded-tr-xl rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {match?.[1]}
                                                        </div>
                                                        <code className="block bg-black/50 p-4 rounded-xl text-sm font-mono overflow-auto border border-white/5" {...props}>{children}</code>
                                                    </div>
                                            }
                                        }}
                                    >
                                        {content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
