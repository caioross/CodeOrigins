import { useState } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, BookOpen, Globe, Search, Github } from 'lucide-react';
import { allLanguages as languages } from '../data';
import { Minimap } from './Minimap';

export function UI() {
  const { selectedLanguage, setSelectedLanguage } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredLanguages = languages.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4">
      {/* Header / Title & Minimap */}
      <div className="absolute top-6 left-6 text-white flex flex-col pointer-events-none">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Code Origins</h1>
          <p className="text-sm text-gray-400 mt-1">A visual history of programming languages</p>
        </div>
        <Minimap />
      </div>

      {/* Search Bar */}
      <div className="absolute top-6 right-6 pointer-events-auto w-64">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-black/50 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-black/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm backdrop-blur-md transition-all"
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          />
        </div>
        
        {/* Search Results Dropdown */}
        <AnimatePresence>
          {isSearchFocused && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute mt-2 w-full bg-black/80 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden max-h-60 overflow-y-auto z-50"
            >
              {filteredLanguages.length > 0 ? (
                filteredLanguages.map(lang => (
                  <button
                    key={lang.id}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors flex justify-between items-center"
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                  >
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-xs opacity-60">{lang.year}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">No languages found.</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions & Footer */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-gray-400 text-sm pointer-events-none">
        <p>Click and drag to rotate • Scroll to zoom • Click a planet to explore</p>
        <a 
          href="https://github.com/caioross/CodeOrigins" 
          target="_blank" 
          rel="noopener noreferrer"
          className="pointer-events-auto flex items-center gap-2 hover:text-white transition-colors"
        >
          <Github size={20} />
          <span>View on GitHub</span>
        </a>
      </div>

      <AnimatePresence>
        {selectedLanguage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-2xl bg-black/80 p-6 text-white shadow-2xl backdrop-blur-xl border border-white/10"
          >
            <button
              onClick={() => setSelectedLanguage(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold shadow-lg">
                {selectedLanguage.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedLanguage.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{selectedLanguage.year}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Globe size={14} />
                    {selectedLanguage.origin}
                  </span>
                  <span>•</span>
                  <span className="capitalize text-indigo-300">
                    {selectedLanguage.category || 'programing and scripts'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-1">About</h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  {selectedLanguage.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-1">Connections</h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  {selectedLanguage.connectionsExplanation}
                </p>
              </div>

              {selectedLanguage.parents.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-1">Evolved From</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLanguage.parents.map(parentId => (
                      <span key={parentId} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                        {parentId.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedLanguage.moons.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-400 mb-1">Ecosystem (Moons)</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLanguage.moons.map(moon => (
                      <span key={moon.name} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                        {moon.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-3 border-t border-white/10">
                {selectedLanguage.docsUrl && (
                  <a
                    href={selectedLanguage.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium hover:bg-indigo-500 transition-colors"
                  >
                    <BookOpen size={16} />
                    Docs
                  </a>
                )}
                {selectedLanguage.siteUrl && (
                  <a
                    href={selectedLanguage.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium hover:bg-white/20 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Website
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
