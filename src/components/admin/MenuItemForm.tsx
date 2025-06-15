
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMenuItems } from '@/hooks/useMenuItems';
import { MenuItem } from '@/types/database';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MenuItemFormProps {
  item?: MenuItem | null;
  open: boolean;
  onClose: () => void;
}

export const MenuItemForm = ({ item, open, onClose }: MenuItemFormProps) => {
  const { addMenuItem, updateMenuItem } = useMenuItems();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'Porções',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (item) {
      console.log('Preenchendo formulário com dados do item:', item);
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        image_url: item.image_url || '',
        category: item.category || 'Porções',
      });
      setImagePreview(item.image_url || '');
    } else {
      console.log('Limpando formulário para novo item');
      setFormData({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: 'Porções',
      });
      setImagePreview('');
    }
    setImageFile(null);
  }, [item, open]);

  const formatCurrency = (value: string) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '');
    
    if (!numericValue) return '';
    
    // Converte para número e divide por 100 para ter os centavos
    const number = parseInt(numericValue) / 100;
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(number);
  };

  const handlePriceChange = (value: string) => {
    const formattedPrice = formatCurrency(value);
    setFormData(prev => ({ ...prev, price: formattedPrice }));
  };

  const handleImageUpload = async (file: File) => {
    console.log('Iniciando upload da imagem:', file.name);
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      console.log('Fazendo upload para o bucket menu-images:', filePath);
      
      const { data, error } = await supabase.storage
        .from('menu-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erro no upload:', error);
        throw error;
      }

      console.log('Upload concluído:', data);

      // Obter URL pública da imagem
      const { data: publicData } = supabase.storage
        .from('menu-images')
        .getPublicUrl(filePath);

      const imageUrl = publicData.publicUrl;
      console.log('URL pública da imagem:', imageUrl);

      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      setImagePreview(imageUrl);
      
      return imageUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Arquivo selecionado:', file.name, file.type, file.size);
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      // Validar tamanho (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 10MB.');
        return;
      }
      
      setImageFile(file);
      
      // Criar preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submetendo formulário:', formData);
    
    // Validação básica
    if (!formData.name.trim()) {
      console.log('Nome é obrigatório');
      alert('Nome é obrigatório');
      return;
    }
    
    if (!formData.description.trim()) {
      console.log('Descrição é obrigatória');
      alert('Descrição é obrigatória');
      return;
    }
    
    if (!formData.price.trim()) {
      console.log('Preço é obrigatório');
      alert('Preço é obrigatório');
      return;
    }
    
    setLoading(true);

    try {
      let imageUrl = formData.image_url;
      
      // Se há um novo arquivo de imagem, fazer upload primeiro
      if (imageFile) {
        console.log('Fazendo upload da nova imagem');
        imageUrl = await handleImageUpload(imageFile);
      }
      
      // Se ainda não tem imagem, validar
      if (!imageUrl.trim()) {
        console.log('Imagem é obrigatória');
        alert('Por favor, selecione uma imagem para o item');
        setLoading(false);
        return;
      }
      
      const dataToSubmit = { ...formData, image_url: imageUrl };
      
      if (item) {
        console.log('Atualizando item existente:', item.id);
        const result = await updateMenuItem(item.id, dataToSubmit);
        console.log('Item atualizado com sucesso:', result);
      } else {
        console.log('Criando novo item');
        const result = await addMenuItem(dataToSubmit);
        console.log('Item criado com sucesso:', result);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      alert('Erro ao salvar item. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    console.log('Alterando campo:', field, '=', value);
    
    if (field === 'price') {
      handlePriceChange(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const removeImagePreview = () => {
    setImagePreview('');
    setImageFile(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-poker-gray-medium border-poker-gold/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-poker-gold">
            {item ? 'Editar Item' : 'Adicionar Item'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Categoria *</label>
              <select 
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full p-2 bg-poker-black border border-poker-gold/30 rounded text-white focus:border-poker-gold focus:outline-none"
                required
              >
                <option value="Porções">Porções</option>
                <option value="Drinks">Drinks</option>
                <option value="Combos">Combos</option>
                <option value="Premium">Premium</option>
                <option value="Principais">Principais</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Nome do Item *</label>
              <Input 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ex: Porção de Batata Frita"
                className="bg-poker-black border-poker-gold/30 text-white focus:border-poker-gold"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Descrição *</label>
            <Textarea 
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descrição do item..."
              className="bg-poker-black border-poker-gold/30 text-white focus:border-poker-gold"
              rows={3}
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Preço *</label>
              <Input 
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="R$ 0,00"
                className="bg-poker-black border-poker-gold/30 text-white focus:border-poker-gold"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">URL da Imagem</label>
              <Input 
                value={formData.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="https://... ou faça upload abaixo"
                className="bg-poker-black border-poker-gold/30 text-white focus:border-poker-gold"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Upload de Imagem *</label>
            <div className="border-2 border-dashed border-poker-gold/30 rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center cursor-pointer hover:bg-poker-gold/10 rounded p-4 transition-colors"
              >
                <Upload className="w-8 h-8 text-poker-gold mb-2" />
                <span className="text-poker-gold text-sm font-medium">
                  {uploading ? 'Fazendo upload...' : 'Clique para selecionar imagem'}
                </span>
                <span className="text-gray-400 text-xs mt-1">
                  PNG, JPG, WEBP até 10MB
                </span>
              </label>
            </div>
          </div>
          
          {imagePreview && (
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Preview da Imagem</label>
              <div className="relative w-32 h-32 border border-poker-gold/30 rounded overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Erro ao carregar imagem preview:', imagePreview);
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <button
                  type="button"
                  onClick={removeImagePreview}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-4 border-t border-poker-gold/20">
            <Button 
              type="submit"
              disabled={loading || uploading}
              className="bg-poker-gold text-poker-black hover:bg-poker-gold-light disabled:opacity-50"
            >
              {loading ? 'Salvando...' : uploading ? 'Fazendo upload...' : (item ? 'Atualizar' : 'Adicionar')}
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading || uploading}
              className="border-poker-gold/30 text-poker-gold hover:bg-poker-gold/10"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
