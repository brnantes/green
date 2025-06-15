
import { supabase } from '@/integrations/supabase/client';
import { Tournament, TournamentData } from '@/types/tournament';

export const fetchTournaments = async (): Promise<Tournament[]> => {
  console.log('🔍 TournamentService: Iniciando busca no Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('type', 'tournament')
      .order('created_at', { ascending: false });

    console.log('📊 TournamentService: Resposta bruta do Supabase:', { data, error });

    if (error) {
      console.error('❌ TournamentService: Erro na consulta:', error);
      throw new Error(`Erro ao buscar torneios: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️ TournamentService: Nenhum registro encontrado');
      return [];
    }
    
    console.log(`📋 TournamentService: ${data.length} registros encontrados`);
    
    const tournaments = data.map((item, index) => {
      try {
        console.log(`🔄 TournamentService: Processando item ${index + 1}:`, item);
        
        let content;
        if (typeof item.content === 'string') {
          content = JSON.parse(item.content);
        } else {
          content = item.content;
        }
        
        console.log(`📝 TournamentService: Conteúdo parseado do item ${index + 1}:`, content);
        
        const tournament: Tournament = {
          id: item.id,
          name: item.title,
          date: content.date,
          time: content.time,
          buy_in: content.buy_in,
          prize: content.prize,
          max_players: content.max_players,
          created_at: item.created_at,
          updated_at: item.updated_at
        };
        
        console.log(`✅ TournamentService: Torneio ${index + 1} processado:`, tournament);
        return tournament;
      } catch (parseError) {
        console.error(`❌ TournamentService: Erro ao processar item ${index + 1}:`, parseError, item);
        return null;
      }
    }).filter(Boolean) as Tournament[];
    
    console.log(`🏆 TournamentService: ${tournaments.length} torneios válidos processados`);
    console.log('📋 TournamentService: Lista final:', tournaments);
    
    return tournaments;
  } catch (globalError) {
    console.error('💥 TournamentService: Erro global:', globalError);
    throw globalError;
  }
};

export const addTournament = async (tournamentData: TournamentData) => {
  console.log('➕ TournamentService: Adicionando torneio:', tournamentData);
  
  const content = JSON.stringify({
    date: tournamentData.date,
    time: tournamentData.time,
    buy_in: tournamentData.buy_in,
    prize: tournamentData.prize,
    max_players: tournamentData.max_players
  });
  
  const { data, error } = await supabase
    .from('site_content')
    .insert([{
      type: 'tournament',
      title: tournamentData.name,
      content: content
    }])
    .select()
    .single();

  if (error) {
    console.error('❌ TournamentService: Erro ao adicionar:', error);
    throw new Error(`Erro ao adicionar torneio: ${error.message}`);
  }
  
  console.log('✅ TournamentService: Torneio adicionado:', data);
  return data;
};

export const updateTournament = async (id: string, tournamentData: TournamentData) => {
  console.log('✏️ TournamentService: Atualizando torneio:', id, tournamentData);
  
  const content = JSON.stringify({
    date: tournamentData.date,
    time: tournamentData.time,
    buy_in: tournamentData.buy_in,
    prize: tournamentData.prize,
    max_players: tournamentData.max_players
  });
  
  const { error } = await supabase
    .from('site_content')
    .update({
      title: tournamentData.name,
      content: content
    })
    .eq('id', id);

  if (error) {
    console.error('❌ TournamentService: Erro ao atualizar:', error);
    throw new Error(`Erro ao atualizar torneio: ${error.message}`);
  }
  
  console.log('✅ TournamentService: Torneio atualizado com sucesso');
};

export const deleteTournament = async (id: string) => {
  console.log('🗑️ TournamentService: Deletando torneio:', id);
  
  const { error } = await supabase
    .from('site_content')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('❌ TournamentService: Erro ao deletar:', error);
    throw new Error(`Erro ao deletar torneio: ${error.message}`);
  }
  
  console.log('✅ TournamentService: Torneio deletado com sucesso');
};
