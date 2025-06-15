
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SiteImage {
  id: string;
  type: string;
  title: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export const useSiteImages = () => {
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchImages = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('type', 'site_image')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedImages = data?.map(item => ({
        id: item.id,
        type: item.title, // hero_background, about_image, etc.
        title: item.title,
        image_url: item.content,
        created_at: item.created_at,
        updated_at: item.updated_at
      })) || [];
      
      setImages(formattedImages);
    } catch (error) {
      console.error('Erro ao buscar imagens:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as imagens.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveImage = async (imageType: string, imageUrl: string) => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .upsert([{
          type: 'site_image',
          title: imageType,
          content: imageUrl
        }], {
          onConflict: 'type,title'
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchImages();
      toast({
        title: "Sucesso",
        description: "Imagem atualizada com sucesso!",
      });
      return data;
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a imagem.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getImageUrl = (imageType: string, fallbackUrl: string) => {
    const image = images.find(img => img.type === imageType);
    return image?.image_url || fallbackUrl;
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    images,
    loading,
    saveImage,
    getImageUrl,
    refetch: fetchImages,
  };
};
