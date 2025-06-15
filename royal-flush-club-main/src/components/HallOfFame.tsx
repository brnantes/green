
import { Card, CardContent } from '@/components/ui/card';

const HallOfFame = () => {
  const champions = [
    {
      id: 1,
      name: 'Carlos Mendes',
      achievement: 'Campeão 2024',
      prize: 'R$ 15.000',
      image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3'
    },
    {
      id: 2,
      name: 'Ana Silva',
      achievement: 'Torneio Premium',
      prize: 'R$ 8.500',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3'
    },
    {
      id: 3,
      name: 'Roberto Santos',
      achievement: 'Championship',
      prize: 'R$ 12.000',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3'
    },
    {
      id: 4,
      name: 'Maria Costa',
      achievement: 'Hold\'em Master',
      prize: 'R$ 6.200',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3'
    }
  ];

  return (
    <section id="hall-of-fame" className="py-20 bg-green-gray-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Nossos campeões
          </h2>
          <p className="text-xl text-gray-300">
            Jogadores que marcaram história no Green Table
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {champions.map((champion, index) => (
            <Card 
              key={champion.id} 
              className="bg-green-gray-medium border-green-primary/20 card-hover animate-slide-in-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <img 
                    src={champion.image} 
                    alt={champion.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-green-primary"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-primary rounded-full flex items-center justify-center">
                    <span className="text-green-black font-bold text-sm">👑</span>
                  </div>
                </div>
                <h3 className="text-green-primary font-semibold text-lg mb-1">
                  {champion.name}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {champion.achievement}
                </p>
                <p className="text-green-primary font-bold text-xl">
                  {champion.prize}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HallOfFame;
