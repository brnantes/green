
import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuItemsList } from '@/components/admin/MenuItemsList';
import { BannersSection } from '@/components/admin/BannersSection';
import { TournamentsSection } from '@/components/admin/TournamentsSection';
import { ChampionsSection } from '@/components/admin/ChampionsSection';
import { ImagesSection } from '@/components/admin/ImagesSection';
import UsersSection from '@/components/admin/UsersSection';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Admin = () => {
  const { isLoggedIn, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-poker-black text-white">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Painel Administrativo</h1>
              <p className="text-gray-400">Gerencie o conteúdo do Green Table</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-gray-400 text-sm">
                <span className="text-poker-gold">Administrador</span>
              </p>
              <Button 
                onClick={logout} 
                variant="outline" 
                size="sm"
                className="border-poker-gold/20 hover:border-poker-gold/50 hover:bg-poker-black/50 flex gap-1 items-center"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="menu" className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-poker-gray-medium">
              <TabsTrigger value="menu" className="data-[state=active]:bg-poker-gold data-[state=active]:text-poker-black">
                Cardápio
              </TabsTrigger>
              <TabsTrigger value="banners" className="data-[state=active]:bg-poker-gold data-[state=active]:text-poker-black">
                Banners
              </TabsTrigger>
              <TabsTrigger value="tournaments" className="data-[state=active]:bg-poker-gold data-[state=active]:text-poker-black">
                Torneios
              </TabsTrigger>
              <TabsTrigger value="champions" className="data-[state=active]:bg-poker-gold data-[state=active]:text-poker-black">
                Campeões
              </TabsTrigger>
              <TabsTrigger value="images" className="data-[state=active]:bg-poker-gold data-[state=active]:text-poker-black">
                Imagens
              </TabsTrigger>
              <TabsTrigger value="contacts" className="data-[state=active]:bg-poker-gold data-[state=active]:text-poker-black">
                Contatos
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-poker-gold data-[state=active]:text-poker-black">
                Usuários
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="menu" className="space-y-6">
              <MenuItemsList />
            </TabsContent>
            
            <TabsContent value="banners" className="space-y-6">
              <BannersSection />
            </TabsContent>
            
            <TabsContent value="tournaments" className="space-y-6">
              <TournamentsSection />
            </TabsContent>
            
            <TabsContent value="champions" className="space-y-6">
              <ChampionsSection />
            </TabsContent>
            
            <TabsContent value="images" className="space-y-6">
              <ImagesSection />
            </TabsContent>
            
            <TabsContent value="contacts" className="space-y-6">
              <Card className="bg-poker-gray-medium border-poker-gold/20">
                <CardHeader>
                  <CardTitle className="text-poker-gold">Contatos Recebidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-poker-black p-4 rounded border border-poker-gold/20">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-poker-gold font-semibold">João Silva</h4>
                        <span className="text-gray-400 text-sm">06/01/2025</span>
                      </div>
                      <p className="text-gray-300 text-sm">joao@email.com | (11) 99999-9999</p>
                      <p className="text-gray-400 text-sm mt-2">Interessado em receber agenda de torneios</p>
                    </div>
                    <div className="bg-poker-black p-4 rounded border border-poker-gold/20">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-poker-gold font-semibold">Maria Santos</h4>
                        <span className="text-gray-400 text-sm">05/01/2025</span>
                      </div>
                      <p className="text-gray-300 text-sm">maria@email.com | (11) 88888-8888</p>
                      <p className="text-gray-400 text-sm mt-2">Interessada em receber agenda de torneios</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-6">
              <UsersSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;
