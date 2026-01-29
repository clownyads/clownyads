import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';

export default function OfferForm({ offer, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState(offer || {
    name: '',
    niche: 'nutra',
    category: 'tendencias',
    status: 'escalando',
    aggressiveness: 3,
    risk_level: 'medio',
    requires_cloaker: false,
    main_angle: '',
    description: '',
    ticket: '',
    geo: 'BR',
    traffic_sources: [],
    creatives: [],
    alerts: [],
    affiliate_url: '',
    is_hot: false,
    banner_url: '',
    ad_library_links: [],
    files_url: '',
    ad_count: 0
  });

  const [newTrafficSource, setNewTrafficSource] = useState('');
  const [newCreative, setNewCreative] = useState('');
  const [newAlert, setNewAlert] = useState('');
  const [newAdLibrary, setNewAdLibrary] = useState('');
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field, value, setter) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
      setter('');
    }
  };

  const removeFromArray = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      handleChange('banner_url', file_url);
    } catch (error) {
      console.error('Erro ao fazer upload do banner:', error);
      alert('Erro ao fazer upload do banner');
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div className="md:col-span-2">
          <Label className="text-white mb-2 block">Nome da Oferta *</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Ex: SlimFit Pro"
            required
          />
        </div>

        {/* Nicho */}
        <div>
          <Label className="text-white mb-2 block">Nicho *</Label>
          <Select value={formData.niche} onValueChange={(v) => handleChange('niche', v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#18181B] border-white/10 text-white">
              <SelectItem value="nutra">Nutra</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="info_gray">Info White</SelectItem>
              <SelectItem value="info_black">Info Black</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Categoria */}
        <div>
          <Label className="text-white mb-2 block">Categoria *</Label>
          <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#18181B] border-white/10 max-h-[300px] text-white">
              <SelectItem value="tendencias">🔥 Tendências</SelectItem>
              <SelectItem value="low_ticket">💸 Low Ticket</SelectItem>
              <SelectItem value="renda_extra">📈 Renda Extra</SelectItem>
              <SelectItem value="saude_bem_estar">❤️ Saúde & Bem-estar</SelectItem>
              <SelectItem value="emagrecimento">🏃 Emagrecimento</SelectItem>
              <SelectItem value="fitness_exercicios">🏋️ Fitness & Exercícios</SelectItem>
              <SelectItem value="relacionamento">💕 Relacionamento</SelectItem>
              <SelectItem value="sexualidade">🌶️ Sexualidade</SelectItem>
              <SelectItem value="familia_maternidade">👨‍👩‍👧 Família & Maternidade</SelectItem>
              <SelectItem value="educacao_idiomas">📚 Educação & Idiomas</SelectItem>
              <SelectItem value="desenvolv_pessoal">🧠 Desenvolv. Pessoal</SelectItem>
              <SelectItem value="espiritualidade">🙏 Espiritualidade</SelectItem>
              <SelectItem value="moda_beleza">💄 Moda & Beleza</SelectItem>
              <SelectItem value="estilo_vida">💎 Estilo de Vida</SelectItem>
              <SelectItem value="pets">🐾 Pets</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <Label className="text-white mb-2 block">Status *</Label>
          <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#18181B] border-white/10 text-white">
              <SelectItem value="escalando">Escalando</SelectItem>
              <SelectItem value="estavel">Estável</SelectItem>
              <SelectItem value="saturando">Saturando</SelectItem>
              <SelectItem value="morta">Morta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Agressividade */}
        <div>
          <Label className="text-white mb-2 block">Agressividade *</Label>
          <Select 
            value={formData.aggressiveness?.toString()} 
            onValueChange={(v) => handleChange('aggressiveness', parseInt(v))}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#18181B] border-white/10 text-white">
              <SelectItem value="1">Nível 1 - Leve</SelectItem>
              <SelectItem value="2">Nível 2</SelectItem>
              <SelectItem value="3">Nível 3 - Médio</SelectItem>
              <SelectItem value="4">Nível 4</SelectItem>
              <SelectItem value="5">Nível 5 - Extremo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Risco */}
        <div>
          <Label className="text-white mb-2 block">Nível de Risco *</Label>
          <Select value={formData.risk_level} onValueChange={(v) => handleChange('risk_level', v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#18181B] border-white/10 text-white">
              <SelectItem value="baixo">Baixo</SelectItem>
              <SelectItem value="medio">Médio</SelectItem>
              <SelectItem value="alto">Alto</SelectItem>
              <SelectItem value="extremo">Extremo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ticket */}
        <div>
          <Label className="text-white mb-2 block">Ticket</Label>
          <Input
            value={formData.ticket}
            onChange={(e) => handleChange('ticket', e.target.value)}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Ex: R$47,00"
          />
        </div>

        {/* Espaço vazio para manter grid */}
        <div></div>

        {/* GEO */}
        <div>
          <Label className="text-white mb-2 block">GEO</Label>
          <Input
            value={formData.geo}
            onChange={(e) => handleChange('geo', e.target.value)}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Ex: BR, US, PT"
          />
        </div>

        {/* URL Afiliado */}
        <div>
          <Label className="text-white mb-2 block">URL de Afiliado</Label>
          <Input
            value={formData.affiliate_url}
            onChange={(e) => handleChange('affiliate_url', e.target.value)}
            className="bg-white/5 border-white/10 text-white"
            placeholder="https://..."
          />
        </div>

        {/* Cloaker */}
        <div>
          <Label className="text-white mb-2 block">Precisa de Cloaker?</Label>
          <Select 
            value={formData.requires_cloaker?.toString()} 
            onValueChange={(v) => handleChange('requires_cloaker', v === 'true')}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#18181B] border-white/10 text-white">
              <SelectItem value="false">Não</SelectItem>
              <SelectItem value="true">Sim</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Em Alta */}
        <div>
          <Label className="text-white mb-2 block">Está em Alta?</Label>
          <Select 
            value={formData.is_hot?.toString()} 
            onValueChange={(v) => handleChange('is_hot', v === 'true')}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#18181B] border-white/10 text-white">
              <SelectItem value="false">Não</SelectItem>
              <SelectItem value="true">Sim</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Volume de Anúncios */}
        <div>
          <Label className="text-white mb-2 block">Volume de Anúncios</Label>
          <Input
            type="number"
            value={formData.ad_count}
            onChange={(e) => handleChange('ad_count', parseInt(e.target.value) || 0)}
            className="bg-white/5 border-white/10 text-white"
            placeholder="Ex: 125"
          />
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <Label className="text-white mb-2 block">Descrição</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="bg-white/5 border-white/10 text-white h-24"
            placeholder="Descreva a oferta..."
          />
        </div>

        {/* Ângulo Principal */}
        <div className="md:col-span-2">
          <Label className="text-white mb-2 block">Ângulo Principal</Label>
          <Textarea
            value={formData.main_angle}
            onChange={(e) => handleChange('main_angle', e.target.value)}
            className="bg-white/5 border-white/10 text-white h-24"
            placeholder="O ângulo/copy principal que está convertendo..."
          />
        </div>

        {/* Fontes de Tráfego */}
        <div className="md:col-span-2">
          <Label className="text-white mb-2 block">Fontes de Tráfego</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTrafficSource}
              onChange={(e) => setNewTrafficSource(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('traffic_sources', newTrafficSource, setNewTrafficSource))}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Ex: Facebook Ads"
            />
            <Button
              type="button"
              onClick={() => addToArray('traffic_sources', newTrafficSource, setNewTrafficSource)}
              className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
            >
              <Plus size={18} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.traffic_sources?.map((source, i) => (
              <Badge key={i} variant="outline" className="bg-white/5 border-white/10 text-zinc-300">
                {source}
                <button
                  type="button"
                  onClick={() => removeFromArray('traffic_sources', i)}
                  className="ml-2 hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Criativos */}
        <div className="md:col-span-2">
          <Label className="text-white mb-2 block">URLs dos Criativos</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newCreative}
              onChange={(e) => setNewCreative(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('creatives', newCreative, setNewCreative))}
              className="bg-white/5 border-white/10 text-white"
              placeholder="https://..."
            />
            <Button
              type="button"
              onClick={() => addToArray('creatives', newCreative, setNewCreative)}
              className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
            >
              <Plus size={18} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.creatives?.map((url, i) => (
              <Badge key={i} variant="outline" className="bg-white/5 border-white/10 text-zinc-300 max-w-xs truncate">
                {url}
                <button
                  type="button"
                  onClick={() => removeFromArray('creatives', i)}
                  className="ml-2 hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Alertas */}
        <div className="md:col-span-2">
          <Label className="text-white mb-2 block">Alertas</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newAlert}
              onChange={(e) => setNewAlert(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('alerts', newAlert, setNewAlert))}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Ex: Cuidado com bloqueios no Facebook"
            />
            <Button
              type="button"
              onClick={() => addToArray('alerts', newAlert, setNewAlert)}
              className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
            >
              <Plus size={18} />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.alerts?.map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#FFB800]/5 border border-[#FFB800]/10 rounded-lg">
                <span className="text-sm text-zinc-300">{alert}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray('alerts', i)}
                  className="text-zinc-400 hover:text-red-400"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Ad Library Links */}
        <div className="md:col-span-2">
          <Label className="text-white mb-2 block">Biblioteca de Anúncios (Links)</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newAdLibrary}
              onChange={(e) => setNewAdLibrary(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('ad_library_links', newAdLibrary, setNewAdLibrary))}
              className="bg-white/5 border-white/10 text-white"
              placeholder="https://..."
            />
            <Button
              type="button"
              onClick={() => addToArray('ad_library_links', newAdLibrary, setNewAdLibrary)}
              className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
            >
              <Plus size={18} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.ad_library_links?.map((url, i) => (
              <Badge key={i} variant="outline" className="bg-white/5 border-white/10 text-zinc-300">
                Link {i + 1}
                <button
                  type="button"
                  onClick={() => removeFromArray('ad_library_links', i)}
                  className="ml-2 hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Files URL */}
        <div className="md:col-span-2">
          <Label className="text-white mb-2 block">Arquivos da Oferta (URL)</Label>
          <Input
            value={formData.files_url}
            onChange={(e) => handleChange('files_url', e.target.value)}
            className="bg-white/5 border-white/10 text-white"
            placeholder="https://drive.google.com/... ou outro link"
          />
        </div>

        {/* Banner Upload */}
        <div className="md:col-span-2">
          <Label className="text-white mb-2 block">Banner (1080x1080)</Label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
                id="banner-upload"
                disabled={uploadingBanner}
              />
              <label htmlFor="banner-upload">
                <Button
                  type="button"
                  disabled={uploadingBanner}
                  className="bg-white/5 hover:bg-white/10 text-white border-white/10"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('banner-upload')?.click();
                  }}
                >
                  <Upload size={16} className="mr-2" />
                  {uploadingBanner ? 'Fazendo upload...' : 'Fazer upload do banner'}
                </Button>
              </label>
              {formData.banner_url && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleChange('banner_url', '')}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  <X size={14} className="mr-1" />
                  Remover
                </Button>
              )}
            </div>
            {formData.banner_url && (
              <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 p-2">
                <img 
                  src={formData.banner_url} 
                  alt="Banner preview"
                  className="w-full aspect-square object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="border-white/10 text-white hover:bg-white/5"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 font-semibold"
        >
          {isLoading ? 'Salvando...' : offer ? 'Atualizar Oferta' : 'Criar Oferta'}
        </Button>
      </div>
    </form>
  );
}