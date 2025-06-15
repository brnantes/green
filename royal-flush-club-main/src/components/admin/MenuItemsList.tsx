
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMenuItems } from '@/hooks/useMenuItems';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { MenuItemForm } from './MenuItemForm';
import { MenuItem } from '@/types/database';

export const MenuItemsList = () => {
  const { menuItems, loading, deleteMenuItem } = useMenuItems();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  console.log('MenuItemsList renderizando com:', { menuItems, loading });

  const handleEdit = (item: MenuItem) => {
    console.log('Editando item:', item);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    console.log('Tentando deletar item:', id);
    if (confirm('Tem certeza que deseja deletar este item?')) {
      await deleteMenuItem(id);
    }
  };

  const handleCloseForm = () => {
    console.log('Fechando formulário');
    setShowForm(false);
    setEditingItem(null);
  };

  const handleAddNew = () => {
    console.log('Adicionando novo item');
    setEditingItem(null);
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-poker-gray-medium border-poker-gold/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-poker-gold">Itens do Cardápio</CardTitle>
          <Button
            onClick={handleAddNew}
            className="bg-poker-gold text-poker-black hover:bg-poker-gold-light"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Item
          </Button>
        </CardHeader>
        <CardContent>
          {menuItems.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhum item cadastrado ainda.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-poker-gold">Imagem</TableHead>
                  <TableHead className="text-poker-gold">Nome</TableHead>
                  <TableHead className="text-poker-gold">Descrição</TableHead>
                  <TableHead className="text-poker-gold">Categoria</TableHead>
                  <TableHead className="text-poker-gold">Preço</TableHead>
                  <TableHead className="text-poker-gold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          console.log('Erro ao carregar imagem:', item.image_url);
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-white">{item.name}</TableCell>
                    <TableCell className="text-gray-300 max-w-xs truncate">{item.description}</TableCell>
                    <TableCell className="text-gray-300">{item.category}</TableCell>
                    <TableCell className="text-poker-gold font-semibold">{item.price}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="border-poker-gold/30 text-poker-gold hover:bg-poker-gold/10"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <MenuItemForm
        item={editingItem}
        open={showForm}
        onClose={handleCloseForm}
      />
    </div>
  );
};
