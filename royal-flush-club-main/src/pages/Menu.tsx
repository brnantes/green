
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { useMenuItems } from '@/hooks/useMenuItems';

const Menu = () => {
  const { menuItems, loading } = useMenuItems();

  if (loading) {
    return (
      <div className="min-h-screen bg-poker-black text-white">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
                Green Table
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                Carregando cardápio...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-poker-black text-white">
      <Header />
      
      <main className="pt-20">
        <section className="py-20 bg-gradient-to-br from-poker-black via-poker-gray-dark to-poker-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
                Green Table
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Sabores que combinam com grandes jogadas. Desfrute de nossa seleção gastronômica enquanto joga.
              </p>
            </div>
            
            {menuItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Cardápio em atualização...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {menuItems.map((item, index) => (
                  <Card 
                    key={item.id} 
                    className="bg-poker-gray-medium border-poker-gold/20 card-hover animate-slide-in-left overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                        <div className="text-poker-gold font-bold text-lg">{item.price}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{item.category}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="mt-12 text-center">
              <img 
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3" 
                alt="Ambiente gastronômico do clube" 
                className="rounded-lg shadow-2xl shadow-poker-gold/20 mx-auto max-w-4xl w-full"
              />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
