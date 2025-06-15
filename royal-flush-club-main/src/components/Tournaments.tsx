
import { Calendar, Clock, User, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTournaments } from '@/hooks/useTournaments';
import { Badge } from '@/components/ui/badge';

const Tournaments = () => {
  const { tournaments, loading } = useTournaments();

  console.log('🏆 Tournaments Component - Estado:');
  console.log('   📊 tournaments:', tournaments);
  console.log('   📊 tournaments.length:', tournaments.length);
  console.log('   ⏳ loading:', loading);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error, dateString);
      return dateString;
    }
  };

  const getDayOfWeek = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      return days[date.getDay()];
    } catch (error) {
      console.error('Erro ao obter dia da semana:', error, dateString);
      return 'Dia não identificado';
    }
  };

  const isToday = (dateString: string) => {
    try {
      const today = new Date();
      const tournamentDate = new Date(dateString);
      return today.toDateString() === tournamentDate.toDateString();
    } catch (error) {
      return false;
    }
  };

  const isUpcoming = (dateString: string) => {
    try {
      const today = new Date();
      const tournamentDate = new Date(dateString);
      return tournamentDate > today;
    } catch (error) {
      return false;
    }
  };

  if (loading) {
    return (
      <section id="tournaments" className="py-20 bg-poker-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Torneios emocionantes todas as semanas
            </h2>
            <p className="text-xl text-gray-300">
              Competições que elevam o nível do seu jogo
            </p>
          </div>
          <div className="text-center text-poker-gold">
            <div className="animate-pulse">Carregando torneios...</div>
            <p className="text-sm text-gray-400 mt-2">Buscando dados na base...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!tournaments || tournaments.length === 0) {
    console.log('⚠️ Tournaments Component: Nenhum torneio para exibir');
    return (
      <section id="tournaments" className="py-20 bg-poker-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Torneios emocionantes todas as semanas
            </h2>
            <p className="text-xl text-gray-300">
              Competições que elevam o nível do seu jogo
            </p>
          </div>
          
          <div className="text-center text-gray-400 py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-poker-gold/50" />
            <p className="text-xl mb-4">Nenhum torneio encontrado.</p>
            <p className="text-gray-500 mb-6">Os torneios estão sendo carregados ou não há eventos cadastrados no momento.</p>
            
            <div className="mt-6 p-6 bg-poker-gray-medium rounded-lg max-w-md mx-auto">
              <p className="text-sm text-poker-gold mb-2">
                📊 Debug Info:
              </p>
              <p className="text-xs text-gray-400 mb-1">Loading: {loading ? 'true' : 'false'}</p>
              <p className="text-xs text-gray-400 mb-1">Tournaments array: {tournaments ? 'exists' : 'null'}</p>
              <p className="text-xs text-gray-400">Count: {tournaments?.length || 0}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const sortedTournaments = tournaments.sort((a, b) => {
    try {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    } catch (error) {
      return 0;
    }
  });

  console.log('🎯 Tournaments Component: Renderizando', sortedTournaments.length, 'torneios');

  return (
    <section id="tournaments" className="py-20 bg-poker-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Torneios emocionantes todas as semanas
          </h2>
          <p className="text-xl text-gray-300">
            Competições que elevam o nível do seu jogo
          </p>
        </div>
        
        <div className="mb-8 text-center">
          <div className="bg-poker-gray-medium rounded-lg p-4 inline-block">
            <p className="text-poker-gold text-lg font-semibold">
              🎉 {tournaments.length} {tournaments.length === 1 ? 'torneio encontrado' : 'torneios encontrados'}!
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Confira nossa programação completa
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sortedTournaments.slice(0, 6).map((tournament, index) => {
            const todayTournament = isToday(tournament.date);
            const upcomingTournament = isUpcoming(tournament.date);
            
            console.log('🎯 Renderizando torneio:', tournament.name, {
              date: tournament.date,
              isToday: todayTournament,
              isUpcoming: upcomingTournament
            });
            
            return (
              <Card 
                key={tournament.id} 
                className={`bg-poker-gray-medium card-hover animate-slide-in-left relative overflow-hidden ${
                  todayTournament 
                    ? 'border-poker-gold border-2 shadow-lg shadow-poker-gold/20' 
                    : 'border-poker-gold/20'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {todayTournament && (
                  <div className="absolute top-0 right-0 bg-poker-gold text-poker-black px-3 py-1 text-sm font-bold rounded-bl-lg flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    HOJE
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className={`text-xl ${todayTournament ? 'text-poker-gold' : 'text-poker-gold'}`}>
                    {tournament.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${todayTournament ? 'text-poker-gold/80' : 'text-gray-400'}`}>
                      {getDayOfWeek(tournament.date)}
                    </p>
                    {upcomingTournament && (
                      <Badge variant="outline" className="text-xs border-poker-gold/50 text-poker-gold">
                        Em breve
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`flex items-center ${todayTournament ? 'text-white' : 'text-gray-300'}`}>
                    <Calendar className={`w-5 h-5 mr-2 ${todayTournament ? 'text-poker-gold' : 'text-poker-gold'}`} />
                    {formatDate(tournament.date)}
                  </div>
                  <div className={`flex items-center ${todayTournament ? 'text-white' : 'text-gray-300'}`}>
                    <Clock className={`w-5 h-5 mr-2 ${todayTournament ? 'text-poker-gold' : 'text-poker-gold'}`} />
                    {tournament.time}
                  </div>
                  <div className={`flex items-center ${todayTournament ? 'text-white' : 'text-gray-300'}`}>
                    <User className={`w-5 h-5 mr-2 ${todayTournament ? 'text-poker-gold' : 'text-poker-gold'}`} />
                    {tournament.max_players} jogadores
                  </div>
                  <div className={`border-t pt-4 ${todayTournament ? 'border-poker-gold/40' : 'border-poker-gold/20'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={todayTournament ? 'text-gray-200' : 'text-gray-400'}>Buy-in:</span>
                      <span className={`font-semibold ${todayTournament ? 'text-poker-gold' : 'text-poker-gold'}`}>
                        {tournament.buy_in}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={todayTournament ? 'text-gray-200' : 'text-gray-400'}>Prêmio:</span>
                      <span className={`font-semibold text-lg ${todayTournament ? 'text-poker-gold' : 'text-poker-gold'}`}>
                        {tournament.prize}
                      </span>
                    </div>
                  </div>
                  
                  {todayTournament && (
                    <div className="mt-4">
                      <Button 
                        className="w-full bg-poker-gold text-poker-black hover:bg-poker-gold-light font-semibold"
                      >
                        Inscreva-se Agora!
                      </Button>
                    </div>
                  )}
                  
                  {upcomingTournament && !todayTournament && (
                    <div className="mt-4">
                      <Button 
                        variant="outline"
                        className="w-full border-poker-gold/50 text-poker-gold hover:bg-poker-gold/10"
                      >
                        Reservar Vaga
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button 
            variant="outline" 
            className="border-poker-gold text-poker-gold hover:bg-poker-gold hover:text-poker-black px-8 py-3"
          >
            Ver programação completa
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Tournaments;
