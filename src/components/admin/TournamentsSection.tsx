
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTournaments } from '@/hooks/useTournaments';
import { Tournament } from '@/types/tournament';
import { Plus, RefreshCw, AlertCircle, Sparkles, CalendarDays } from 'lucide-react';
import { TournamentForm } from './TournamentForm';
import { TournamentTable } from './TournamentTable';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { addTournaments } from '@/scripts/addTournamentsScript';
import { addWeeklyTournaments } from '@/scripts/addWeeklyTournaments';
import { useToast } from '@/hooks/use-toast';

export const TournamentsSection = () => {
  const { tournaments, loading, error, addTournament, updateTournament, deleteTournament, refetch } = useTournaments();
  const [showForm, setShowForm] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  // Carregamento automático de torneios quando o componente é montado
  useEffect(() => {
    const loadTournaments = async () => {
      if (!initialized && !loading && tournaments.length === 0) {
        try {
          console.log('🚀 Inicializando torneios automaticamente...');
          const addedCount = await addWeeklyTournaments();
          toast({
            title: "Sucesso",
            description: `${addedCount} torneios premium adicionados automaticamente!`,
          });
          setInitialized(true);
          await refetch();
        } catch (error) {
          console.error('❌ Erro ao carregar torneios automaticamente:', error);
          toast({
            title: "Erro",
            description: "Não foi possível adicionar os torneios automaticamente.",
            variant: "destructive",
          });
        }
      }
    };
    
    loadTournaments();
  }, [initialized, loading, tournaments.length, refetch]);
  
  console.log('🎛️ TournamentsSection - Estado completo:');
  console.log('   📊 tournaments:', tournaments);
  console.log('   📊 tournaments.length:', tournaments.length);
  console.log('   ⏳ loading:', loading);
  console.log('   ❌ error:', error);
  console.log('   📋 showForm:', showForm);
  console.log('   ✏️ editingTournament:', editingTournament?.name || 'none');
  console.log('   🔄 initialized:', initialized);

  const resetForm = () => {
    setEditingTournament(null);
    setShowForm(false);
  };

  const handleSubmit = async (formData: any) => {
    console.log('💾 TournamentsSection: Submetendo formulário:', formData);
    try {
      if (editingTournament) {
        await updateTournament(editingTournament.id, formData);
      } else {
        await addTournament(formData);
      }
      resetForm();
    } catch (error) {
      console.error('❌ TournamentsSection: Erro ao submeter:', error);
    }
  };

  const handleEdit = (tournament: Tournament) => {
    console.log('✏️ TournamentsSection: Editando torneio:', tournament.name);
    setEditingTournament(tournament);
    setShowForm(true);
  };

  const handleAddNew = () => {
    console.log('➕ TournamentsSection: Abrindo formulário para novo torneio');
    setShowForm(!showForm);
    if (showForm) resetForm();
  };

  const handleRefresh = () => {
    console.log('🔄 TournamentsSection: Atualizando lista de torneios');
    refetch();
  };
  
  // Funções de botões de demonstração e semanais foram removidas
  // Agora os torneios são carregados automaticamente no useEffect

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse text-poker-gold mb-4">Carregando torneios...</div>
        <div className="text-sm text-gray-400">Conectando à base de dados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-500/50 bg-red-500/10">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-red-400">
          Erro ao carregar torneios: {error}
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm" 
            className="ml-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-poker-gray-medium border-poker-gold/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-poker-gold">
              Gerenciar Torneios ({tournaments.length} cadastrados)
            </CardTitle>
            <div className="mt-2 text-sm text-gray-400">
              {tournaments.length > 0 ? (
                <span>✅ {tournaments.length} torneio(s) encontrado(s) na base de dados</span>
              ) : (
                <span>⚠️ Nenhum torneio encontrado na base de dados</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="border-poker-gold/30 text-poker-gold hover:bg-poker-gold/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button
              onClick={handleAddNew}
              className="bg-poker-gold text-poker-black hover:bg-poker-gold-light"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showForm ? 'Cancelar' : 'Adicionar Torneio'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TournamentTable
            tournaments={tournaments}
            onEdit={handleEdit}
            onDelete={deleteTournament}
          />
          
          {tournaments.length > 0 && (
            <div className="mt-4 p-3 bg-poker-black rounded border border-poker-gold/20">
              <p className="text-xs text-poker-gold mb-1">📊 Debug Info:</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <span>Total de torneios: {tournaments.length}</span>
                <span>Estado loading: {loading ? 'true' : 'false'}</span>
                <span>Formulário ativo: {showForm ? 'true' : 'false'}</span>
                <span>Editando: {editingTournament ? editingTournament.name : 'nenhum'}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>Primeiros torneios:</p>
                {tournaments.slice(0, 3).map((t, i) => (
                  <div key={t.id} className="ml-2">
                    {i + 1}. {t.name} - {t.date} às {t.time}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <TournamentForm
          editingTournament={editingTournament}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}
    </div>
  );
};
