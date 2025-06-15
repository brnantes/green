
import { Users, Trophy, Utensils } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Trophy,
      title: "Torneios Profissionais",
      description: "Competições regulares com organização de alto nível e prêmios atrativos",
      image: "/lovable-uploads/a51d0bdb-8cb1-4dcb-80a0-90df1afb8b1b.png"
    },
    {
      icon: Users,
      title: "Ambiente Familiar",
      description: "Um espaço acolhedor onde toda a família se sente bem-vinda",
      image: "/lovable-uploads/db9017d8-ede2-437f-add1-7e81ad0032c9.png"
    },
    {
      icon: Utensils,
      title: "Gastronomia Premium",
      description: "Cardápio especial que eleva sua experiência gastronômica",
      image: "/lovable-uploads/2cce0e01-19bc-49eb-a1e8-9e3fac5e241b.png"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-gray-dark via-green-black to-green-gray-dark relative">
      {/* Efeitos decorativos */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-primary/5 via-transparent to-green-primary/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Mais que pôquer
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Uma experiência completa que une estratégia, gastronomia e convivência familiar
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl bg-green-gray-medium/50 backdrop-blur-sm border border-green-primary/20 hover:border-green-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-primary/20 animate-slide-in-left"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Imagem de fundo */}
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-black/90 via-green-black/60 to-green-black/30"></div>
              
              {/* Conteúdo */}
              <div className="relative z-10 p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-primary/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-primary/30 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-green-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-green-primary group-hover:text-green-light transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Efeito hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
