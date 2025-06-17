import { useState, useEffect, useMemo } from 'react';
import { useTournaments } from '@/hooks/useTournaments';
import { format, isToday as isDateToday, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock, CreditCard, Flame, Trophy, User, Zap, Star, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Tournaments = () => {
  const { tournaments, loading } = useTournaments();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [gameOfTheDay, setGameOfTheDay] = useState(null);
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
  
  // Efeito para selecionar o jogo do dia e agrupar os torneios por dia
  useEffect(() => {
    if (!tournaments || tournaments.length === 0) {
      console.log('⚠️ Nenhum torneio disponível');
      setGameOfTheDay(null);
      return;
    }
    
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
    
    // Encontrar o jogo do dia (prioridade para o dia selecionado)
    const selectedDayTournaments = tournamentsByDay[selectedDate.getDay()];
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    if (selectedDayTournaments && selectedDayTournaments.length > 0) {
      // Seleciona o primeiro torneio do dia selecionado
      setGameOfTheDay(selectedDayTournaments[0]);
      console.log(`🌟 Jogo do dia para ${dias[selectedDate.getDay()]}: ${selectedDayTournaments[0].name}`);
    } else {
      // Procurar o próximo dia com torneios
      let nextDayWithTournament = null;
      let daysChecked = 0;
      
      // Verificar os próximos 7 dias
      while (!nextDayWithTournament && daysChecked < 7) {
        daysChecked++;
        const nextDay = (selectedDate.getDay() + daysChecked) % 7;
        if (tournamentsByDay[nextDay].length > 0) {
          nextDayWithTournament = tournamentsByDay[nextDay][0];
          console.log(`🌟 Próximo torneio encontrado: ${nextDayWithTournament.name} (${dias[nextDay]})`);
          break;
        }
      }
      
      if (nextDayWithTournament) {
        setGameOfTheDay(nextDayWithTournament);
      } else if (tournaments.length > 0) {
        // Se não encontrou nenhum torneio nos próximos dias, usa o primeiro disponível
        setGameOfTheDay(tournaments[0]);
        console.log(`🌟 Nenhum torneio encontrado nos próximos dias. Usando o primeiro disponível: ${tournaments[0].name}`);
      } else {
        setGameOfTheDay(null);
        console.log('⚠️ Nenhum torneio disponível para exibir como jogo do dia');
      }
    }
    
  }, [tournaments, selectedDate]);

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
    <div id="tournaments" className="py-20 bg-poker-black relative overflow-hidden">
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
            Calendário de Torneios
          </h2>
          <p className="text-xl text-gray-300">
            Confira o jogo do dia e reserve seu lugar
          </p>
        </motion.div>
        
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
              <style dangerouslySetInnerHTML={{ __html: `
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
              ` }} />
              
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
                onChange={(date) => {
                  if (date) {
                    // Garantir que date seja tratado como uma única data
                    const singleDate = Array.isArray(date) ? date[0] : date;
                    setSelectedDate(singleDate);
                    // activeDay é derivado de selectedDate em um useMemo, não precisa ser definido separadamente
                  }
                }}
                inline
                selectsMultiple={true}
                highlightDates={tournamentDates}
                calendarClassName="custom-calendar"
                dayClassName={(date) => {
                  const day = date.getDay();
                  return day === 0 || day === 6 ? "weekend-day" : "";
                }}
                renderCustomHeader={({ 
                  date, 
                  decreaseMonth, 
                  increaseMonth, 
                  prevMonthButtonDisabled, 
                  nextMonthButtonDisabled 
                }) => (
                  <div className="flex items-center justify-between px-2 py-2">
                    <button
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      type="button"
                      className="p-1 rounded-full hover:bg-poker-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5 text-poker-gold" />
                    </button>
                    
                    <div className="text-white font-medium">
                      {format(date, 'MMMM yyyy', { locale: ptBR })}
                    </div>
                    
                    <button
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                      type="button"
                      className="p-1 rounded-full hover:bg-poker-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5 text-poker-gold" />
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
        </motion.div>
      ) : (
        <motion.div 
          className="mt-8 text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-poker-gray-medium/90 to-poker-gray-dark/90 border-2 border-poker-gold/30 p-8">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="bg-poker-gold/20 p-4 rounded-full">
                  <Calendar className="w-10 h-10 text-poker-gold" />
                </div>
                <h3 className="text-xl font-bold text-poker-gold">Nenhum torneio encontrado para hoje</h3>
                <p className="text-gray-300 mb-4">Selecione outra data no calendário ou confira nossos próximos eventos</p>
                <Button
                  onClick={() => {
                    // Incrementar a data para o próximo dia
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() + 1);
                    setSelectedDate(newDate);
                  }}
                  className="bg-poker-gold hover:bg-poker-gold-light text-poker-black px-4 py-2"
                >
                  Verificar próximo dia
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      {/* Botão para ver todos os torneios */}
      <div className="flex justify-center mt-8">
        <Button 
          className="bg-poker-gold hover:bg-poker-gold-light text-poker-black px-8 py-6 text-lg font-bold"
        >
          Ver Todos os Torneios
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
          >
          
            Ver Todos os Torneios
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tournaments;
