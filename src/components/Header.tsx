
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Início', href: '/' },
    { name: 'Torneios', href: '#tournaments' },
    { name: 'Hall da Fama', href: '#hall-of-fame' },
    { name: 'Cardápio', href: '/menu' },
    { name: 'Contato', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-green-black/90 backdrop-blur-md border-b border-green-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/196cfcf0-bff1-44e2-befb-600b276767fd.png" 
              alt="Green Table Logo" 
              className="h-12 w-auto"
            />
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white hover:text-green-primary transition-colors duration-300"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Botões de login e cadastro removidos conforme solicitado */}

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-green-gray-dark border-t border-green-primary/20">
            <nav className="flex flex-col space-y-4 p-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-green-primary transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {/* Botões de login e cadastro removidos conforme solicitado */}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
