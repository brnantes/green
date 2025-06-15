
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSiteImages } from '@/hooks/useSiteImages';
import { Upload, Eye, Image } from 'lucide-react';
import { HeroBannerModal } from './HeroBannerModal';

export const ImagesSection = () => {
  const { images, loading, saveImage } = useSiteImages();
  const [formData, setFormData] = useState({
    hero_background: '',
    about_image: '',
    contact_background: ''
  });
  const [saving, setSaving] = useState(false);
  const [heroBannerModalOpen, setHeroBannerModalOpen] = useState(false);

  const imageTypes = [
    {
      key: 'hero_background',
      label: 'Imagem de Fundo do Hero',
      description: 'Imagem principal da seção hero (1920x1080px recomendado)'
    },
    {
      key: 'about_image',
      label: 'Imagem da Seção Sobre',
      description: 'Imagem da seção sobre nós (800x600px recomendado)'
    },
    {
      key: 'contact_background',
      label: 'Imagem de Fundo do Contato',
      description: 'Imagem de fundo da seção de contato (1920x1080px recomendado)'
    }
  ];

  const handleSave = async (imageType: string) => {
    setSaving(true);
    try {
      await saveImage(imageType, formData[imageType]);
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentImageUrl = (imageType: string) => {
    const image = images.find(img => img.type === imageType);
    return image?.image_url || '';
  };

  if (loading) {
    return <div className="text-center py-8 text-poker-gold">Carregando...</div>;
  }

  return (
    <>
      {/* Modal para gerenciar o banner principal */}
      <HeroBannerModal 
        open={heroBannerModalOpen} 
        onOpenChange={setHeroBannerModalOpen} 
      />
      
      <Card className="bg-poker-gray-medium border-poker-gold/20">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-poker-gold">Gerenciar Imagens do Site</CardTitle>
              <p className="text-gray-400 text-sm">
                Gerencie as imagens principais exibidas no site. Use URLs de imagens hospedadas externamente.
              </p>
            </div>
            <Button 
              onClick={() => setHeroBannerModalOpen(true)}
              className="bg-green-primary hover:bg-green-primary/90 text-white"
            >
              <Image className="w-4 h-4 mr-2" />
              Trocar Banner Principal
            </Button>
          </div>
        </CardHeader>
      <CardContent className="space-y-6">
          {imageTypes.map((imageType) => {
          // Se for o banner principal, adicione uma observação sobre o modal
          const currentUrl = getCurrentImageUrl(imageType.key);
          const formUrl = formData[imageType.key] || currentUrl;
          const isHeroBanner = imageType.key === 'hero_background';
          
          return (
            <div key={imageType.key} className="space-y-4 p-4 bg-poker-black/30 rounded-lg border border-poker-gold/10">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-poker-gold font-medium">{imageType.label}</h4>
                  <p className="text-gray-400 text-sm">{imageType.description}</p>
                </div>
                {isHeroBanner && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setHeroBannerModalOpen(true)}
                    className="border-poker-gold/30 text-poker-gold hover:bg-poker-gold/10"
                  >
                    <Image className="w-4 h-4 mr-1" />
                    Editor Avançado
                  </Button>
                )}
              </div>
              
              {currentUrl && (
                <div className="space-y-2">
                  <label className="block text-sm text-gray-300">Imagem Atual:</label>
                  <div className="flex items-center gap-2">
                    <img 
                      src={currentUrl} 
                      alt={imageType.label}
                      className="w-20 h-20 object-cover rounded border border-poker-gold/30"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5';
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(currentUrl, '_blank')}
                      className="border-poker-gold/30 text-poker-gold hover:bg-poker-gold/10"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  {currentUrl ? 'Nova URL da Imagem:' : 'URL da Imagem:'}
                </label>
                <Input 
                  value={formUrl}
                  onChange={(e) => handleChange(imageType.key, e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="bg-poker-black border-poker-gold/30 text-white"
                />
              </div>
              
              <Button 
                onClick={() => handleSave(imageType.key)}
                disabled={saving || !formUrl}
                className="bg-poker-gold text-poker-black hover:bg-poker-gold-light disabled:opacity-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                {saving ? 'Salvando...' : (currentUrl ? 'Atualizar' : 'Salvar')}
              </Button>
            </div>
          );
        })}
        
        <div className="bg-poker-black/50 p-4 rounded border border-poker-gold/10">
          <h4 className="text-poker-gold font-medium mb-2">💡 Dicas para imagens:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Use imagens de alta qualidade para melhor resultado</li>
            <li>• Recomendamos usar serviços como Unsplash, Pexels ou seu próprio servidor</li>
            <li>• Para melhor performance, use imagens otimizadas (WebP, JPG comprimido)</li>
            <li>• Teste sempre as URLs antes de salvar</li>
          </ul>
        </div>
      </CardContent>
    </Card>
    </>
  );
};
