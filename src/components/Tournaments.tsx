
import { Calendar, Clock, User, Trophy, Flame, Award, CreditCard, Zap, Star, CalendarDays, ChevronRight, Dices, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTournaments } from '@/hooks/useTournaments';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Tournaments = () => {
  const { tournaments, loading } = useTournaments();
  const [featuredTournament, setFeaturedTournament] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [highlightedTournament, setHighlightedTournament] = useState(null);
  const activeDay = useMemo(() => selectedDate.getDay(), [selectedDate]);

  console.log('🏆 Tournaments Component - Estado:');
  console.log('   📊 tournaments:', tournaments);
  console.log('   📊 tournaments.length:', tournaments.length);
  console.log('   ⏳ loading:', loading);
  
  // Agrupar torneios por dia da semana - criamos um array fixo de 7 posições (uma para cada dia)
  const tournamentsByDay = Array(7).fill(0).map(() => []);
  
  // Usar a data atual do sistema em vez de uma data fixa
  const today = new Date(); // Data atual do sistema
  
  // Para armazenar as datas que têm torneios (para destacar no calendário)
  const [tournamentDates, setTournamentDates] = useState([]);
  
  // Efeito para selecionar um torneio em destaque e agrupar os torneios por dia
  useEffect(() => {
    if (!tournaments || tournaments.length === 0) return;
    
    console.log('🔄 Tournaments Component: Processando', tournaments.length, 'torneios');
    
    // Resetar os arrays de agrupamento por dia
    for (let i = 0; i < 7; i++) {
      tournamentsByDay[i] = [];
    }
    
    // Armazenar todas as datas com torneios para destacar no calendário
    const dates = [];
    
    // Processar cada torneio e agrupá-los por dia da semana
    tournaments.forEach(tournament => {
      try {
        // Determinar o dia da semana do torneio
        let day;
        
        // Se o torneio tem uma data específica em formato ISO
        if (tournament.date && tournament.date.includes('-')) {
          const tournamentDate = new Date(tournament.date);
          day = tournamentDate.getDay();
          
          // Adicionar à lista de datas para o calendário
          dates.push(tournamentDate);
        } 
        // Se o torneio tem um dia fixo da semana como string (ex: "Segunda")
        else if (typeof tournament.date === 'string') {
          const dayLower = tournament.date.toLowerCase();
          if (dayLower.includes('domingo')) day = 0;
          else if (dayLower.includes('segunda')) day = 1;
          else if (dayLower.includes('terça')) day = 2;
          else if (dayLower.includes('quarta')) day = 3;
          else if (dayLower.includes('quinta')) day = 4;
          else if (dayLower.includes('sexta')) day = 5;
          else if (dayLower.includes('sábado') || dayLower.includes('sabado')) day = 6;
          else day = 0; // Padrão para domingo em caso de erro
        } else {
          // Se não conseguimos determinar o dia, vamos assumir domingo
          day = 0;
        }
        
        // Adicionar regras especiais para segunda e sexta
        const isFreeDay = day === 1 || day === 5; // Segunda ou Sexta
        
        const processedTournament = {
          ...tournament,
          special_features: isFreeDay
            ? (tournament.special_features || '') + 
              '\n⭐ Free com registro tardio até o final do nível 7\n' +
              '⭐ Entrada free até o final do nível 3'
            : tournament.special_features
        };
        
        // Adicionar ao array do dia correspondente
        tournamentsByDay[day].push(processedTournament);
        
        // Para debug
        console.log(`✅ Torneio "${tournament.name}" agrupado no dia ${day} (${weekDays[day]?.full})`);
      } catch (error) {
        console.error(`❌ Erro ao processar torneio: ${tournament.name}`, error);
      }
    });
    
    // Verificar distribuição dos torneios por dia
    console.log('📊 Distribuição de torneios por dia:');
    for (let i = 0; i < 7; i++) {
      console.log(`   ${weekDays[i].full}: ${tournamentsByDay[i].length} torneios`);
    }
    
    // Atualizar as datas com torneios para o calendário
    setTournamentDates(dates);
    
    // Encontrar um torneio para destacar (prioridade para o dia atual)
    const currentDayTournaments = tournamentsByDay[today.getDay()]; // Dia atual
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    if (currentDayTournaments && currentDayTournaments.length > 0) {
      // Destaque o primeiro torneio do dia atual
      setFeaturedTournament(currentDayTournaments[0]);
      console.log(`🌟 Destacando torneio de ${dias[today.getDay()]}:`, currentDayTournaments[0].name);
    } else if (tournaments.length > 0) {
      // Se não houver torneio para o dia atual, destaca o primeiro disponível
      setFeaturedTournament(tournaments[0]);
      console.log(`🌟 Não há torneios no ${dias[today.getDay()]}. Destacando:`, tournaments[0].name);
    }
    
  }, [tournaments]);

  const formatDate = (dateString: string) => {
    try {
      // Verificar se é uma data no formato ISO
      if (dateString && dateString.includes('-')) {
        const date = new Date(dateString);
        // Verificar se a data é válida
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });
        }
      }
      
      // Se não é formato ISO ou é inválida, retornar a data como está
      // Mas verificar se tem alguma data separada por /
      if (dateString && dateString.includes('/')) {
        return dateString; // Já está formatada
      }
      
      // Para strings como 'Segunda', 'Terça', etc
      if (typeof dateString === 'string' && !dateString.includes('-') && !dateString.includes('/')) {
        const hoje = new Date();
        return hoje.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
      
      return dateString;
    } catch (error) {
      console.error('Erro ao formatar data:', error, dateString);
      return dateString;
    }
  };
  
  const formatDayMonth = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
      });
    } catch (error) {
      console.error('Erro ao formatar data curta:', error, dateString);
      return dateString;
    }
  };

  const getDayOfWeek = (dateString: string) => {
    try {
      // Verificar se é uma data no formato ISO
      if (dateString && dateString.includes('-')) {
        const date = new Date(dateString);
        // Verificar se a data é válida
        if (!isNaN(date.getTime())) {
          const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
          return days[date.getDay()];
        }
      }
      
      // Se a string já contém o nome do dia
      const dayLower = dateString.toLowerCase();
      if (dayLower.includes('domingo')) return 'Domingo';
      if (dayLower.includes('segunda')) return 'Segunda-feira';
      if (dayLower.includes('terça') || dayLower.includes('terca')) return 'Terça-feira';
      if (dayLower.includes('quarta')) return 'Quarta-feira';
      if (dayLower.includes('quinta')) return 'Quinta-feira';
      if (dayLower.includes('sexta')) return 'Sexta-feira';
      if (dayLower.includes('sábado') || dayLower.includes('sabado')) return 'Sábado';
      
      return 'Hoje';
    } catch (error) {
      console.error('Erro ao obter dia da semana:', error, dateString);
      return 'Hoje';
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

  // Configurações de animação com tipagem correta para framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  } as const;
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  } as const;
  
  // Estado de carregamento
  if (loading) {
    return (
      <section id="tournaments" className="py-20 bg-poker-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/poker-table-bg.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Torneios emocionantes todas as semanas
            </h2>
            <p className="text-xl text-gray-300">
              Competições que elevam o nível do seu jogo
            </p>
          </div>
          <div className="flex flex-col items-center justify-center h-64">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-poker-gold/20 animate-ping"></div>
              <div className="absolute inset-2 rounded-full bg-poker-gold/30 animate-pulse"></div>
              <Trophy className="w-24 h-24 text-poker-gold/70 animate-bounce relative z-10" />
            </div>
            <div className="text-center text-poker-gold mt-8">
              <div className="text-2xl font-bold animate-pulse">Carregando torneios...</div>
              <p className="text-sm text-gray-400 mt-2">Preparando a melhor experiência para você</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!tournaments || tournaments.length === 0) {
    console.log('⚠️ Tournaments Component: Nenhum torneio para exibir');
    return (
      <section id="tournaments" className="py-20 bg-poker-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/poker-table-bg.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-poker-black/0 via-poker-black/80 to-poker-black"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Torneios emocionantes todas as semanas
            </h2>
            <p className="text-xl text-gray-300">
              Competições que elevam o nível do seu jogo
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-poker-gold/5 animate-pulse"></div>
              <div className="absolute -inset-4 rounded-full bg-poker-gold/10 animate-ping"></div>
              <Trophy className="w-24 h-24 text-poker-gold/70 relative z-10" />
            </div>
            
            <div className="mt-8 text-center max-w-2xl mx-auto">
              <h3 className="text-3xl font-bold text-poker-gold mb-4">Novos torneios em breve!</h3>
              <p className="text-xl text-gray-300 mb-6">Estamos preparando experiências únicas para os amantes de poker.</p>
              <p className="text-gray-400 mb-10">Fique atento às nossas redes sociais para ser o primeiro a saber quando novos torneios forem anunciados.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <Card className="bg-poker-gray-medium/50 border border-poker-gold/20 backdrop-blur-sm">
                  <CardContent className="pt-6 text-center">
                    <Flame className="w-12 h-12 mx-auto text-poker-gold mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Torneios Diários</h4>
                    <p className="text-gray-400">Em breve, torneios todos os dias da semana com prêmios incríveis</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-poker-gray-medium/50 border border-poker-gold/20 backdrop-blur-sm">
                  <CardContent className="pt-6 text-center">
                    <Award className="w-12 h-12 mx-auto text-poker-gold mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Campeonatos Mensais</h4>
                    <p className="text-gray-400">Grandes prêmios e reconhecimento para os melhores jogadores</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-poker-gray-medium/50 border border-poker-gold/20 backdrop-blur-sm">
                  <CardContent className="pt-6 text-center">
                    <Star className="w-12 h-12 mx-auto text-poker-gold mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Eventos VIP</h4>
                    <p className="text-gray-400">Experiências exclusivas para membros especiais do clube</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Ordenar torneios por data
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

  // Dias da semana para navegação
  const weekDays = [
    { day: 'Dom', full: 'Domingo' },
    { day: 'Seg', full: 'Segunda' },
    { day: 'Ter', full: 'Terça' },
    { day: 'Qua', full: 'Quarta' },
    { day: 'Qui', full: 'Quinta' },
    { day: 'Sex', full: 'Sexta' },
    { day: 'Sáb', full: 'Sábado' },
  ];

  return (
    <section id="tournaments" className="py-20 bg-poker-black relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-[url('/assets/poker-table-bg.jpg')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-poker-black/0 via-poker-black/80 to-poker-black"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-poker-gold/5 blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-64 h-64 rounded-full bg-poker-gold/10 blur-3xl"></div>
      
      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Torneios Exclusivos Royal Flush
          </h2>
          <p className="text-xl text-gray-300">
            Experiências premium para verdadeiros amantes do poker
          </p>
        </motion.div>
        
        {/* Torneio em destaque */}
        {featuredTournament && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-poker-gray-medium/90 to-poker-gray-dark/90 border-2 border-poker-gold/30 overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 bg-poker-gold text-poker-black px-4 py-2 text-sm font-bold rounded-bl-lg flex items-center gap-2 shadow-lg">
                <Flame className="w-4 h-4" />
                DESTAQUE
              </div>
              
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Lado esquerdo - Imagem/Visual */}
                  <div className="relative overflow-hidden h-full min-h-[300px] bg-poker-black/50">
                    <div className="absolute inset-0 bg-[url('/assets/tournament-featured.jpg')] bg-cover bg-center opacity-70 hover:scale-105 transition-transform duration-700"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-poker-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                      <div className="bg-poker-black/70 backdrop-blur-sm p-4 rounded-lg border border-poker-gold/20">
                        <h3 className="text-2xl font-bold text-poker-gold mb-2">{featuredTournament.name}</h3>
                        <p className="text-gray-300">{getDayOfWeek(featuredTournament.date)} | {formatDate(featuredTournament.date)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lado direito - Informações */}
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-poker-gold/20 p-2 rounded-full">
                          <Trophy className="w-6 h-6 text-poker-gold" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Prêmio Total</p>
                          <p className="text-xl font-bold text-white">{featuredTournament.prize}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="bg-poker-gold/20 p-2 rounded-full">
                          <Clock className="w-6 h-6 text-poker-gold" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Horário</p>
                          <p className="text-xl font-bold text-white">{featuredTournament.time}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-poker-gold/20 p-2 rounded-full">
                          <CreditCard className="w-6 h-6 text-poker-gold" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Buy-in</p>
                          <p className="text-xl font-bold text-white">{featuredTournament.buy_in}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="bg-poker-gold/20 p-2 rounded-full">
                          <User className="w-6 h-6 text-poker-gold" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Jogadores</p>
                          <p className="text-xl font-bold text-white">Máx. {featuredTournament.max_players}</p>
                        </div>
                      </div>
                    </div>
                    
                    {featuredTournament.special_features && (
                      <div className="mt-6">
                        <p className="text-gray-400 text-sm mb-2">Características Especiais:</p>
                        <p className="text-white">{featuredTournament.special_features}</p>
                      </div>
                    )}
                    
                    {(new Date(featuredTournament.date).getDay() === 1 || new Date(featuredTournament.date).getDay() === 5) && (
                      <div className="mt-6 bg-poker-gold/10 p-4 rounded-lg border border-poker-gold/30">
                        <p className="text-poker-gold font-bold mb-2 flex items-center gap-2">
                          <Flame className="w-5 h-5" /> Torneio FREE
                        </p>
                        <ul className="text-gray-200 space-y-2">
                          <li className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-poker-gold" />
                            <span>Registro tardio até o final do nível 7</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-poker-gold" />
                            <span>Entrada free até o final do nível 3</span>
                          </li>
                        </ul>
                      </div>
                    )}
                    
                    <Button
                      className="w-full mt-4 bg-poker-gold hover:bg-poker-gold-light text-poker-black"
                      onClick={() => {
                        const msg = `Olá! Gostaria de reservar um lugar para o torneio ${featuredTournament.name} no dia ${formatDate(featuredTournament.date)} às ${featuredTournament.time}.`;
                        window.open(`https://wa.me/+5511912345678?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                    >
                      Reservar Lugar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Calendário e navegação */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex justify-center mb-2">
            <h3 className="text-2xl font-bold text-poker-gold">
              <span className="text-white bg-poker-gold px-2 py-1 rounded mr-2">Hoje</span>
              {(() => {
                const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                const dia = dias[selectedDate.getDay()];
                const dataFormatada = selectedDate.toLocaleDateString('pt-BR');
                return `${dia}, ${dataFormatada} - Programação de Torneios`;
              })()}
            </h3>
          </div>
          
          <div className="bg-poker-gray-dark/50 p-4 rounded-lg border border-poker-gold/20 backdrop-blur-sm mb-6">
            <div className="custom-calendar-container">
              <style jsx global>{`
                .react-datepicker {
                  background-color: #1a1a1a !important;
                  border: 1px solid rgba(212, 175, 55, 0.3) !important;
                  border-radius: 0.5rem !important;
                  font-family: inherit !important;
                  color: white !important;
                }
                .react-datepicker__header {
                  background-color: #222222 !important;
                  border-bottom: 1px solid rgba(212, 175, 55, 0.2) !important;
                  color: white !important;
                }
                .react-datepicker__current-month, 
                .react-datepicker__day-name {
                  color: white !important;
                }
                .react-datepicker__day {
                  color: #e0e0e0 !important;
                  border-radius: 0.25rem !important;
                }
                .react-datepicker__day:hover {
                  background-color: rgba(212, 175, 55, 0.3) !important;
                }
                .react-datepicker__day--selected {
                  background-color: #d4af37 !important;
                  color: black !important;
                  font-weight: bold !important;
                }
                .react-datepicker__day--today {
                  border: 1px solid rgba(212, 175, 55, 0.7) !important;
                  font-weight: bold !important;
                }
                .react-datepicker__day--highlighted {
                  background-color: rgba(212, 175, 55, 0.2) !important;
                  color: #d4af37 !important;
                  font-weight: 600 !important;
                }
                .react-datepicker__navigation-icon::before {
                  border-color: #d4af37 !important;
                }
                .react-datepicker__navigation:hover *::before {
                  border-color: white !important;
                }
              `}</style>
              
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-bold text-poker-gold flex items-center gap-2">
                  <Calendar className="w-5 h-5"/>
                  <span>Calendário de Torneios</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-poker-gold/30 text-poker-gold hover:bg-poker-gold hover:text-poker-black"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Hoje
                  </Button>
                </div>
              </div>
              
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
                highlightDates={tournamentDates}
                calendarClassName="w-full"
                dayClassName={(date) => {
                  const day = date.getDay();
                  return tournamentsByDay[day]?.length > 0 ? 'has-tournaments' : null;
                }}
                renderCustomHeader={({ 
                  date, 
                  decreaseMonth, 
                  increaseMonth, 
                  prevMonthButtonDisabled, 
                  nextMonthButtonDisabled 
                }) => (
                  <div className="flex items-center justify-between px-2 py-1">
                    <button
                      type="button"
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      className="text-poker-gold hover:text-white disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-white font-bold">
                      {date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                    </div>
                    <button
                      type="button"
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                      className="text-poker-gold hover:text-white disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              />
            </div>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
              <div className="bg-poker-gray-medium/50 p-2 rounded border border-poker-gold/20 text-sm">
                <div className="font-bold text-poker-gold">{tournamentsByDay[activeDay]?.length || 0}</div>
                <div className="text-gray-300">Torneios no dia</div>
              </div>
              
              <div className="bg-poker-gray-medium/50 p-2 rounded border border-poker-gold/20 text-sm">
                <div className="font-bold text-poker-gold">{tournaments?.length || 0}</div>
                <div className="text-gray-300">Total de torneios</div>
              </div>
              
              <div className="bg-poker-gray-medium/50 p-2 rounded border border-poker-gold/20 text-sm">
                <div className="font-bold text-poker-gold">{weekDays[activeDay]?.full}</div>
                <div className="text-gray-300">Dia selecionado</div>
              </div>
              
              <div className="bg-poker-gray-medium/50 p-2 rounded border border-poker-gold/20 text-sm">
                <div className="font-bold text-poker-gold">{selectedDate.toLocaleDateString('pt-BR')}</div>
                <div className="text-gray-300">Data</div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Lista de torneios */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {sortedTournaments
            .filter(tournament => {
              try {
                const isSameDay = (date1, date2) => {
                  return date1.getDate() === date2.getDate() && 
                         date1.getMonth() === date2.getMonth() && 
                         date1.getFullYear() === date2.getFullYear();
                };
                
                // Primeiro tentamos com data formato ISO - verificar se é o mesmo dia calendário
                if (tournament.date && tournament.date.includes('-')) {
                  const tournamentDate = new Date(tournament.date);
                  return isSameDay(tournamentDate, selectedDate);
                }
                // Se não for data ISO, verificamos se o dia da semana corresponde
                else if (typeof tournament.date === 'string') {
                  const dayLower = tournament.date.toLowerCase();
                  if (dayLower.includes('domingo') && selectedDate.getDay() === 0) return true;
                  if (dayLower.includes('segunda') && selectedDate.getDay() === 1) return true;
                  if (dayLower.includes('terça') && selectedDate.getDay() === 2) return true;
                  if (dayLower.includes('quarta') && selectedDate.getDay() === 3) return true;
                  if (dayLower.includes('quinta') && selectedDate.getDay() === 4) return true;
                  if (dayLower.includes('sexta') && selectedDate.getDay() === 5) return true;
                  if (dayLower.includes('sábado') && selectedDate.getDay() === 6) return true;
                  return false;
                }
                return false;
              } catch (error) {
                console.error('Erro ao filtrar torneio por dia:', error);
                return false;
              }
            })
            .map((tournament, index) => {
              const isTodayTournament = isToday(tournament.date);
              const isUpcomingTournament = isUpcoming(tournament.date);
              
              return (
                <motion.div key={tournament.id} variants={itemVariants}>
                  <Card 
                    className={`bg-poker-gray-medium/80 backdrop-blur-sm hover:bg-poker-gray-medium/90 transition-all duration-300 relative overflow-hidden border ${
                      isTodayTournament 
                        ? 'border-poker-gold shadow-lg shadow-poker-gold/20' 
                        : 'border-poker-gold/20'
                    }`}
                  >
                    {isTodayTournament && (
                      <div className="absolute top-0 right-0 bg-poker-gold text-poker-black px-3 py-1 text-sm font-bold rounded-bl-lg flex items-center gap-1 z-10">
                        <Trophy className="w-4 h-4" />
                        HOJE
                      </div>
                    )}
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-poker-gold">
                        {tournament.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${isTodayTournament ? 'text-poker-gold/80' : 'text-gray-400'}`}>
                          {getDayOfWeek(tournament.date)}
                        </p>
                        {isUpcomingTournament && (
                          <Badge variant="outline" className="text-xs border-poker-gold/50 text-poker-gold">
                            Em breve
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3 pb-2">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-5 h-5 mr-2 text-poker-gold" />
                        {formatDate(tournament.date)}
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-5 h-5 mr-2 text-poker-gold" />
                        {tournament.time}
                      </div>
                      
                      {(new Date(tournament.date).getDay() === 1 || new Date(tournament.date).getDay() === 5) && (
                        <div className="flex flex-col gap-1 text-poker-gold/80 mt-1 text-sm">
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-2" />
                            <span>Free com registro até nível 7</span>
                          </div>
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-2" />
                            <span>Entrada free até nível 3</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center text-gray-300">
                        <User className="w-5 h-5 mr-2 text-poker-gold" />
                        {tournament.max_players} jogadores
                      </div>
                      <div className="flex items-center text-gray-300">
                        <CreditCard className="w-5 h-5 mr-2 text-poker-gold" />
                        {tournament.buy_in}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4 text-poker-gold" />
                            <span className="text-sm text-gray-400">Prêmio:</span>
                          </div>
                          <span className="font-bold text-white">{tournament.prize}</span>
                        </div>
                        
                        <Button 
                          className="w-full bg-poker-gold/20 hover:bg-poker-gold text-poker-gold hover:text-poker-black border border-poker-gold/50 transition-all duration-300"
                          size="sm"
                          onClick={() => {
                            const msg = `Olá! Gostaria de reservar um lugar para o torneio ${tournament.name} no dia ${formatDate(tournament.date)} às ${tournament.time}.`;
                            window.open(`https://wa.me/+5511912345678?text=${encodeURIComponent(msg)}`, '_blank');
                          }}
                        >
                          Reservar Lugar
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
            
            {tournamentsByDay[activeDay].length === 0 && (
              <motion.div 
                className="col-span-3 text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={() => setActiveDay((activeDay + 1) % 7)}
                  className="bg-poker-gold hover:bg-poker-gold-light text-poker-black px-4 py-2"
                >
                  Verificar próximo dia
                </Button>
              </motion.div>
            )}
        </motion.div>
        
        {/* Botão para ver mais torneios */}
        <div className="flex justify-center">
          <Button 
            className="bg-poker-gold hover:bg-poker-gold-light text-poker-black px-8 py-6 text-lg font-bold"
          >
            Ver Todos os Torneios
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Tournaments;
