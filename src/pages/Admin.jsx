import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OfferForm from '@/components/admin/OfferForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Plus, 
  Pencil, 
  Trash2,
  Shield,
  AlertTriangle,
  X
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const statusConfig = {
  escalando: { color: 'bg-green-500/10 text-green-400' },
  estavel: { color: 'bg-blue-500/10 text-blue-400' },
  saturando: { color: 'bg-yellow-500/10 text-yellow-400' },
  morta: { color: 'bg-red-500/10 text-red-400' }
};

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    };
    loadUser();
  }, []);

  const { data: offers = [], isLoading } = useQuery({
    queryKey: ['admin-offers'],
    queryFn: () => base44.entities.Offer.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Offer.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-offers']);
      queryClient.invalidateQueries(['offers']);
      setShowForm(false);
      setEditingOffer(null);
      toast.success('Oferta criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar oferta');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Offer.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-offers']);
      queryClient.invalidateQueries(['offers']);
      setShowForm(false);
      setEditingOffer(null);
      toast.success('Oferta atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar oferta');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Offer.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-offers']);
      queryClient.invalidateQueries(['offers']);
      toast.success('Oferta deletada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao deletar oferta');
    }
  });

  const handleSubmit = (data) => {
    if (editingOffer) {
      updateMutation.mutate({ id: editingOffer.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja deletar esta oferta?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleNew = () => {
    setEditingOffer(null);
    setShowForm(true);
  };

  const filteredOffers = offers.filter(offer => 
    offer.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if user is admin
  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
          <p className="text-zinc-500">Você precisa ser administrador para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="p-4 lg:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#BF00FF]/10 flex items-center justify-center">
                <Settings size={24} className="text-[#BF00FF]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Painel Admin</h1>
                <p className="text-zinc-500 text-sm">Gerencie as ofertas da plataforma</p>
              </div>
            </div>
            <Button 
              onClick={handleNew}
              className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 font-semibold"
            >
              <Plus size={18} className="mr-2" />
              Nova Oferta
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-4">
              <p className="text-sm text-zinc-500 mb-1">Total</p>
              <p className="text-2xl font-black text-white">{offers.length}</p>
            </div>
            <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-4">
              <p className="text-sm text-zinc-500 mb-1">Escalando</p>
              <p className="text-2xl font-black text-green-400">
                {offers.filter(o => o.status === 'escalando').length}
              </p>
            </div>
            <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-4">
              <p className="text-sm text-zinc-500 mb-1">Em Alta</p>
              <p className="text-2xl font-black text-[#FF6B6B]">
                {offers.filter(o => o.is_hot).length}
              </p>
            </div>
            <div className="bg-[#0A0A0C] border border-white/5 rounded-xl p-4">
              <p className="text-sm text-zinc-500 mb-1">Com Alertas</p>
              <p className="text-2xl font-black text-[#FFB800]">
                {offers.filter(o => o.alerts?.length > 0).length}
              </p>
            </div>
          </div>

          {/* Offers Table */}
          <div className="bg-[#0A0A0C] border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-white">Nome</th>
                    <th className="text-left p-4 text-sm font-semibold text-white">Nicho</th>
                    <th className="text-left p-4 text-sm font-semibold text-white">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-white">Agressividade</th>
                    <th className="text-left p-4 text-sm font-semibold text-white">Risco</th>
                    <th className="text-right p-4 text-sm font-semibold text-white">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="p-4"><Skeleton className="h-5 w-32 bg-white/5" /></td>
                        <td className="p-4"><Skeleton className="h-5 w-20 bg-white/5" /></td>
                        <td className="p-4"><Skeleton className="h-6 w-24 bg-white/5" /></td>
                        <td className="p-4"><Skeleton className="h-5 w-8 bg-white/5" /></td>
                        <td className="p-4"><Skeleton className="h-6 w-20 bg-white/5" /></td>
                        <td className="p-4"><Skeleton className="h-8 w-20 bg-white/5 ml-auto" /></td>
                      </tr>
                    ))
                  ) : filteredOffers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <p className="text-zinc-500">Nenhuma oferta encontrada</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOffers.map((offer) => (
                      <tr key={offer.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-4">
                          <p className="font-semibold text-white">{offer.name}</p>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-zinc-300">
                            {offer.niche}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={statusConfig[offer.status]?.color}>
                            {offer.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-white font-semibold">{offer.aggressiveness}/5</span>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-zinc-300">
                            {offer.risk_level}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(offer)}
                              className="text-zinc-400 hover:text-white hover:bg-white/5"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(offer.id)}
                              className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#0A0A0C] border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingOffer ? 'Editar Oferta' : 'Nova Oferta'}
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              {editingOffer ? 'Atualize as informações da oferta' : 'Preencha os dados da nova oferta'}
            </DialogDescription>
          </DialogHeader>
          <OfferForm
            offer={editingOffer}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingOffer(null);
            }}
            isLoading={createMutation.isLoading || updateMutation.isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}