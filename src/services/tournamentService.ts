
import { supabase, supabaseAdmin } from '@/integrations/supabase/client';
import { Tournament, TournamentData } from '@/types/tournament';
import { initialTournaments } from '@/data/initialTournaments';

// Modo offline para desenvolvimento quando Supabase estiver com problemas
let offlineMode = false;
let offlineTournaments = [...initialTournaments];

export const fetchTournaments = async (): Promise<Tournament[]> => {
  console.log('🔍 TournamentService: Iniciando busca no Supabase...');
  
  // Se estamos em modo offline, retornar os dados offline
  if (offlineMode) {
    console.log('🔌 TournamentService: Usando modo offline');
    return offlineTournaments;
  }
  
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('type', 'tournament')
      .order('created_at', { ascending: false });

    console.log('📊 TournamentService: Resposta bruta do Supabase:', { data, error });

    if (error) {
      console.error('❌ TournamentService: Erro na consulta:', error);
      console.log('🚨 TournamentService: Ativando modo offline devido a erro de API');
      offlineMode = true;
      return offlineTournaments;
    }
    
    if (!data || data.length === 0) {
      console.log('⚠️ TournamentService: Nenhum registro encontrado');
      console.log('🚨 TournamentService: Ativando modo offline devido a dados vazios');
      offlineMode = true;
      return offlineTournaments;
    }
    
    console.log(`📋 TournamentService: ${data.length} registros encontrados`);
    
    const tournaments = data.map((item, index) => {
      try {
        console.log(`🔄 TournamentService: Processando item ${index + 1}:`, item);
        
        let content;
        try {
          if (typeof item.content === 'string') {
            content = JSON.parse(item.content);
          } else if (item.content && typeof item.content === 'object') {
            content = item.content;
          } else {
            // Se o conteúdo não for válido, cria um objeto vazio
            console.warn(`⚠️ TournamentService: Conteúdo inválido para o item ${index + 1}`);
            content = {};
          }
        } catch (parseError) {
          console.error(`❌ TournamentService: Erro ao parsear JSON do item ${index + 1}:`, parseError);
          content = {};
        }
        
        console.log(`📝 TournamentService: Conteúdo parseado do item ${index + 1}:`, content);
        
        // Assegurar que todos os campos existam para evitar erros
        const tournament: Tournament = {
          id: item.id || `temp-${Date.now()}-${index}`,
          name: item.title || 'Torneio sem nome',
          date: content.date || new Date().toISOString().split('T')[0],
          time: content.time || '19:00',
          buy_in: content.buy_in || 'R$ 100,00',
          prize: content.prize || 'A definir',
          max_players: content.max_players || 50,
          special_features: content.special_features || '',
          created_at: item.created_at || new Date().toISOString(),
          updated_at: item.updated_at || new Date().toISOString()
        };
        
        console.log(`✅ TournamentService: Torneio ${index + 1} processado:`, tournament);
        return tournament;
      } catch (processError) {
        console.error(`❌ TournamentService: Erro fatal ao processar item ${index + 1}:`, processError, item);
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
  console.log('➡ TournamentService: Adicionando torneio:', tournamentData);
  
  // Se estamos em modo offline, adicionar aos torneios offline
  if (offlineMode) {
    console.log('🔌 TournamentService: Adicionando torneio em modo offline');
    
    const newTournament: Tournament = {
      id: `offline-${Date.now()}`,
      name: tournamentData.name,
      date: tournamentData.date,
      time: tournamentData.time,
      buy_in: tournamentData.buy_in,
      prize: tournamentData.prize,
      max_players: tournamentData.max_players || 50,
      special_features: tournamentData.special_features || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    offlineTournaments.unshift(newTournament);
    console.log('✅ TournamentService: Torneio adicionado em modo offline:', newTournament);
    return { id: newTournament.id };
  }
  
  try {
    const content = JSON.stringify({
      date: tournamentData.date,
      time: tournamentData.time,
      buy_in: tournamentData.buy_in,
      prize: tournamentData.prize,
      max_players: tournamentData.max_players,
      special_features: tournamentData.special_features || ''
    });
    
    const { data, error } = await supabaseAdmin
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
      
      // Ativar modo offline se falhar
      console.log('🚨 TournamentService: Ativando modo offline devido a erro de API');
      offlineMode = true;
      return addTournament(tournamentData); // Tenta adicionar novamente em modo offline
    }
    
    console.log('✅ TournamentService: Torneio adicionado:', data);
    return data;
  } catch (error) {
    console.error('❌ TournamentService: Erro ao adicionar:', error);
    
    // Ativar modo offline se falhar
    console.log('🚨 TournamentService: Ativando modo offline devido a erro');
    offlineMode = true;
    return addTournament(tournamentData); // Tenta adicionar novamente em modo offline
  }
};

export const updateTournament = async (id: string, tournamentData: TournamentData) => {
  console.log('✏️ TournamentService: Atualizando torneio:', id, tournamentData);
  
  // Se estamos em modo offline, atualizar nos torneios offline
  if (offlineMode) {
    console.log('🔌 TournamentService: Atualizando torneio em modo offline');
    
    const index = offlineTournaments.findIndex(t => t.id === id);
    if (index >= 0) {
      offlineTournaments[index] = {
        ...offlineTournaments[index],
        name: tournamentData.name,
        date: tournamentData.date,
        time: tournamentData.time,
        buy_in: tournamentData.buy_in,
        prize: tournamentData.prize,
        max_players: tournamentData.max_players || 50,
        special_features: tournamentData.special_features || '',
        updated_at: new Date().toISOString()
      };
      console.log('✅ TournamentService: Torneio atualizado em modo offline');
      return;
    } else {
      console.error('❌ TournamentService: Torneio não encontrado em modo offline');
      return;
    }
  }
  
  try {
    const content = JSON.stringify({
      date: tournamentData.date,
      time: tournamentData.time,
      buy_in: tournamentData.buy_in,
      prize: tournamentData.prize,
      max_players: tournamentData.max_players,
      special_features: tournamentData.special_features || ''
    });
    
    const { error } = await supabaseAdmin
      .from('site_content')
      .update({
        title: tournamentData.name,
        content: content
      })
      .eq('id', id);

    if (error) {
      console.error('❌ TournamentService: Erro ao atualizar:', error);
      
      // Ativar modo offline se falhar
      console.log('🚨 TournamentService: Ativando modo offline devido a erro de API');
      offlineMode = true;
      return updateTournament(id, tournamentData); // Tenta atualizar novamente em modo offline
    }
    
    console.log('✅ TournamentService: Torneio atualizado com sucesso');
  } catch (error) {
    console.error('❌ TournamentService: Erro ao atualizar:', error);
    
    // Ativar modo offline se falhar
    console.log('🚨 TournamentService: Ativando modo offline devido a erro');
    offlineMode = true;
    return updateTournament(id, tournamentData); // Tenta atualizar novamente em modo offline
  }
};

export const deleteTournament = async (id: string) => {
  console.log('🗑️ TournamentService: Deletando torneio:', id);

  // Se estamos em modo offline, deletar dos torneios offline
  if (offlineMode) {
    console.log('🔌 TournamentService: Deletando torneio em modo offline');
    
    const initialLength = offlineTournaments.length;
    offlineTournaments = offlineTournaments.filter(t => t.id !== id);
    
    if (offlineTournaments.length < initialLength) {
      console.log('✅ TournamentService: Torneio deletado em modo offline');
    } else {
      console.error('❌ TournamentService: Torneio não encontrado em modo offline');
    }
    return;
  }
  
  try {
    const { error } = await supabaseAdmin
      .from('site_content')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ TournamentService: Erro ao deletar:', error);
      
      // Ativar modo offline se falhar
      console.log('🚨 TournamentService: Ativando modo offline devido a erro de API');
      offlineMode = true;
      return deleteTournament(id); // Tenta deletar novamente em modo offline
    }
    
    console.log('✅ TournamentService: Torneio deletado com sucesso');
  } catch (error) {
    console.error('❌ TournamentService: Erro ao deletar:', error);
    
    // Ativar modo offline se falhar
    console.log('🚨 TournamentService: Ativando modo offline devido a erro');
    offlineMode = true;
    return deleteTournament(id); // Tenta deletar novamente em modo offline
  }
};

// Desativando modo offline para buscar dados do Supabase
console.log('🌐 TournamentService: Iniciando em modo online para buscar dados do Supabase');
offlineMode = false;
