
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tournament, TournamentData } from '@/types/tournament';

interface TournamentFormProps {
  editingTournament: Tournament | null;
  onSubmit: (data: TournamentData) => Promise<void>;
  onCancel: () => void;
}

export const TournamentForm = ({ editingTournament, onSubmit, onCancel }: TournamentFormProps) => {
  const [formData, setFormData] = useState({
    name: editingTournament?.name || '',
    date: editingTournament?.date || '',
    time: editingTournament?.time || '',
    buy_in: editingTournament?.buy_in || '',
    prize: editingTournament?.prize || '',
    max_players: editingTournament?.max_players || 16
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.date || !formData.time || !formData.buy_in || !formData.prize) {
      console.error('❌ Campos obrigatórios não preenchidos');
      return;
    }
    
    setSaving(true);
    try {
      console.log('💾 Salvando torneio:', formData);
      await onSubmit(formData);
    } catch (error) {
      console.error('❌ Erro ao salvar torneio:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-poker-gray-medium border-poker-gold/20">
      <CardHeader>
        <CardTitle className="text-poker-gold">
          {editingTournament ? 'Editar Torneio' : 'Adicionar Novo Torneio'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Nome do Torneio *</label>
              <Input 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Segunda-feira Freeroll"
                className="bg-poker-black border-poker-gold/30 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Data * <span className="text-xs text-gray-400">(DD/MM/AAAA ou dia da semana)</span></label>
              <Input 
                type="text"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                placeholder="Ex: 15/06/2025 ou Segunda"
                className="bg-poker-black border-poker-gold/30 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Horário * <span className="text-xs text-gray-400">(Ex: 19:30)</span></label>
              <Input 
                type="text"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                placeholder="Ex: 19:30 ou 20h"
                className="bg-poker-black border-poker-gold/30 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Buy-in *</label>
              <Input 
                value={formData.buy_in}
                onChange={(e) => handleChange('buy_in', e.target.value)}
                placeholder="R$ 30,00 ou Gratuito"
                className="bg-poker-black border-poker-gold/30 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Prêmio *</label>
              <Input 
                value={formData.prize}
                onChange={(e) => handleChange('prize', e.target.value)}
                placeholder="R$ 500,00"
                className="bg-poker-black border-poker-gold/30 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Máx. Jogadores *</label>
              <Input 
                type="number"
                value={formData.max_players}
                onChange={(e) => handleChange('max_players', parseInt(e.target.value) || 16)}
                placeholder="16"
                min="1"
                max="100"
                className="bg-poker-black border-poker-gold/30 text-white"
                required
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4 border-t border-poker-gold/20">
            <Button 
              type="submit"
              disabled={saving}
              className="bg-poker-gold text-poker-black hover:bg-poker-gold-light disabled:opacity-50"
            >
              {saving ? 'Salvando...' : (editingTournament ? 'Atualizar' : 'Adicionar')}
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={saving}
              className="border-poker-gold/30 text-poker-gold hover:bg-poker-gold/10"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
