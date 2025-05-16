
    import React, { useEffect } from 'react';
    import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import { Upload, History, Settings as SettingsIconLucide, ShoppingBag } from 'lucide-react';
    import PriceComparisonPage from '@/pages/PriceComparisonPage';
    import HistoryPage from '@/pages/HistoryPage';
    import SettingsPage from '@/pages/SettingsPage';
    import { motion } from 'framer-motion';

    function App() {
      useEffect(() => {
        // Default to light theme, remove dark class if present
        document.documentElement.classList.remove('dark');
      }, []);

      const navLinkClasses = ({ isActive }) =>
        `flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ease-in-out hover:bg-primary/10 hover:text-primary ${
          isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'
        }`;

      return (
        <Router>
          <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
            <header className="p-4 shadow-sm bg-card border-b border-border sticky top-0 z-50">
              <div className="container mx-auto flex justify-between items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center text-2xl font-bold text-primary"
                >
                  <ShoppingBag className="mr-2 h-7 w-7" />
                  Face Bela Cosméticos
                </motion.div>
                <nav className="flex space-x-1">
                  <NavLink to="/" className={navLinkClasses}>
                    <Upload size={18} />
                    <span>Comparar</span>
                  </NavLink>
                  <NavLink to="/history" className={navLinkClasses}>
                    <History size={18} />
                    <span>Histórico</span>
                  </NavLink>
                  <NavLink to="/settings" className={navLinkClasses}>
                    <SettingsIconLucide size={18} />
                    <span>Ajustes</span>
                  </NavLink>
                </nav>
              </div>
            </header>

            <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
              <Routes>
                <Route path="/" element={<PriceComparisonPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>

            <footer className="p-4 text-center text-sm text-muted-foreground bg-card border-t border-border">
              © {new Date().getFullYear()} Face Bela Cosméticos. Comparação de preços inteligente.
            </footer>
            <Toaster />
          </div>
        </Router>
      );
    }

    export default App;
  