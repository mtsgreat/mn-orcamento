'use client'

import { useState, useEffect } from 'react'
import BottomNav from '@/components/BottomNav'
import { ConfigPagamento } from '@/types'
import { createClient } from '@/lib/supabase'

const inputClass =
  'w-full border border-outline-variant bg-white p-3 rounded-lg text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all'

const labelClass = 'block text-label-md text-on-surface-variant uppercase tracking-wider mb-1'

type ConfigForm = Omit<ConfigPagamento, 'id'>

const defaultConfig: ConfigForm = {
  banco: '', agencia: '', conta: '',
  favorecido: '', cnpj_favorecido: '', chave_pix: '', tipo_chave: 'CNPJ',
  nome_empresa: '', cnpj_empresa: '', endereco_empresa: '', contato_empresa: '',
}

export default function Configuracoes() {
  const [config, setConfig] = useState<ConfigForm>(defaultConfig)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('configuracao_pagamento').select('*').eq('id', 1).single()
      .then(({ data }) => {
        if (data) {
          setConfig({
            banco: data.banco ?? '', agencia: data.agencia ?? '', conta: data.conta ?? '',
            favorecido: data.favorecido ?? '', cnpj_favorecido: data.cnpj_favorecido ?? '',
            chave_pix: data.chave_pix ?? '', tipo_chave: data.tipo_chave ?? 'CNPJ',
            nome_empresa: data.nome_empresa ?? '', cnpj_empresa: data.cnpj_empresa ?? '',
            endereco_empresa: data.endereco_empresa ?? '', contato_empresa: data.contato_empresa ?? '',
          })
        }
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      await supabase.from('configuracao_pagamento')
        .upsert({ id: 1, ...config, updated_at: new Date().toISOString() })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const set = (field: keyof ConfigForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setConfig((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <>
      <main className="pt-20 pb-20 md:pb-8 px-4 lg:px-8 max-w-3xl mx-auto">
        <div className="py-4 md:py-6">
          <h1 className="text-headline-md font-bold text-on-background">Configurações</h1>
          <p className="text-body-md text-secondary mt-1">Dados fixos que aparecem em todos os orçamentos.</p>
        </div>

        {/* ── Empresa ── */}
        <section className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-5 text-primary">
            <span className="material-symbols-outlined">business</span>
            <h2 className="text-headline-md font-semibold uppercase tracking-wider">Dados da Empresa</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Nome da Empresa</label>
              <input type="text" className={inputClass} placeholder="Razão Social" value={config.nome_empresa ?? ''} onChange={set('nome_empresa')} />
            </div>
            <div>
              <label className={labelClass}>CNPJ da Empresa</label>
              <input type="text" className={inputClass} placeholder="00.000.000/0000-00" value={config.cnpj_empresa ?? ''} onChange={set('cnpj_empresa')} />
            </div>
            <div>
              <label className={labelClass}>Contato / Telefone</label>
              <input type="text" className={inputClass} placeholder="(00) 00000-0000" value={config.contato_empresa ?? ''} onChange={set('contato_empresa')} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Endereço da Empresa</label>
              <input type="text" className={inputClass} placeholder="Rua, Número, Bairro, Cidade - UF, CEP" value={config.endereco_empresa ?? ''} onChange={set('endereco_empresa')} />
            </div>
          </div>
        </section>

        {/* ── Pagamento ── */}
        <section className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-5 text-primary">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <h2 className="text-headline-md font-semibold uppercase tracking-wider">Dados de Pagamento / PIX</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Favorecido (Nome para transferência)</label>
              <input type="text" className={inputClass} placeholder="Nome da empresa ou pessoa" value={config.favorecido ?? ''} onChange={set('favorecido')} />
            </div>
            <div>
              <label className={labelClass}>CNPJ / CPF do Favorecido</label>
              <input type="text" className={inputClass} placeholder="00.000.000/0000-00" value={config.cnpj_favorecido ?? ''} onChange={set('cnpj_favorecido')} />
            </div>
            <div>
              <label className={labelClass}>Banco / Instituição</label>
              <input type="text" className={inputClass} placeholder="Ex: 197 - Stone" value={config.banco ?? ''} onChange={set('banco')} />
            </div>
            <div>
              <label className={labelClass}>Agência</label>
              <input type="text" className={inputClass} placeholder="0000" value={config.agencia ?? ''} onChange={set('agencia')} />
            </div>
            <div>
              <label className={labelClass}>Conta Corrente</label>
              <input type="text" className={inputClass} placeholder="00000-0" value={config.conta ?? ''} onChange={set('conta')} />
            </div>
            <div>
              <label className={labelClass}>Tipo de Chave PIX</label>
              <select className={inputClass} value={config.tipo_chave ?? 'CNPJ'} onChange={set('tipo_chave')}>
                <option value="CNPJ">CNPJ</option>
                <option value="CPF">CPF</option>
                <option value="email">E-mail</option>
                <option value="celular">Celular</option>
                <option value="aleatoria">Chave Aleatória</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Chave PIX</label>
              <input type="text" className={inputClass} placeholder="Sua chave PIX" value={config.chave_pix ?? ''} onChange={set('chave_pix')} />
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-primary text-on-primary font-bold px-8 py-3 rounded-xl hover:bg-primary-container transition-colors disabled:opacity-60">
            <span className="material-symbols-outlined text-[18px]">{saving ? 'hourglass_empty' : 'save'}</span>
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
          {saved && (
            <div className="flex items-center gap-1.5 text-green-700">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span className="text-body-md font-semibold">Salvo com sucesso!</span>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
