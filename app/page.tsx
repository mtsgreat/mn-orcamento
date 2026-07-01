'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import BottomNav from '@/components/BottomNav'
import { Orcamento } from '@/types'

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

const statusConfig: Record<string, { label: string; className: string }> = {
  rascunho: { label: 'Rascunho', className: 'bg-surface-container-high text-on-surface-variant' },
  enviado:  { label: 'Enviado',  className: 'bg-secondary-container text-primary' },
  aprovado: { label: 'Aprovado', className: 'bg-green-100 text-green-800' },
}

export default function Dashboard() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('orcamentos')
      .select('*, clientes(nome)')
      .order('created_at', { ascending: false })
    setOrcamentos((data as Orcamento[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (orc: Orcamento) => {
    const numStr = `#${String(orc.numero).padStart(4, '0')}`
    const clienteNome = orc.clientes?.nome ? ` — ${orc.clientes.nome}` : ''
    if (!confirm(`Excluir o orçamento ${numStr}${clienteNome}?\n\nEssa ação não pode ser desfeita.`)) return

    setDeletingId(orc.id)
    const supabase = createClient()
    await supabase.from('orcamentos').delete().eq('id', orc.id)
    setOrcamentos((prev) => prev.filter((o) => o.id !== orc.id))
    setDeletingId(null)
  }

  return (
    <>
      <main className="pt-20 pb-20 md:pb-8 px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between py-4 md:py-6">
          <h1 className="text-headline-md font-bold text-on-background">Orçamentos</h1>
          <Link
            href="/orcamentos/novo"
            className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-container transition-colors text-body-md"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Novo Orçamento
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 text-secondary gap-3">
            <span className="material-symbols-outlined text-[32px] animate-spin">progress_activity</span>
            <span className="text-body-md">Carregando...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && orcamentos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center text-secondary gap-4">
            <span className="material-symbols-outlined text-[56px] opacity-30">receipt_long</span>
            <p className="text-body-lg font-medium opacity-60">Nenhum orçamento criado ainda.</p>
            <Link
              href="/orcamentos/novo"
              className="flex items-center gap-2 border border-primary text-primary px-6 py-2.5 rounded-full hover:bg-primary hover:text-on-primary transition-colors text-body-md font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Criar primeiro orçamento
            </Link>
          </div>
        )}

        {/* Table */}
        {!loading && orcamentos.length > 0 && (
          <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl overflow-hidden">

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="p-4 text-label-md text-on-surface-variant w-20">Nº</th>
                    <th className="p-4 text-label-md text-on-surface-variant">CLIENTE</th>
                    <th className="p-4 text-label-md text-on-surface-variant w-36 text-right">TOTAL</th>
                    <th className="p-4 text-label-md text-on-surface-variant w-28">STATUS</th>
                    <th className="p-4 text-label-md text-on-surface-variant w-32">DATA</th>
                    <th className="p-4 text-label-md text-on-surface-variant w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {orcamentos.map((orc) => {
                    const cfg = statusConfig[orc.status] ?? statusConfig.rascunho
                    const clienteNome = orc.clientes?.nome ?? '—'
                    const isDeleting = deletingId === orc.id
                    return (
                      <tr
                        key={orc.id}
                        className={`border-b border-outline-variant transition-colors group ${isDeleting ? 'opacity-40' : 'hover:bg-surface-container-low'}`}
                      >
                        <td className="p-4 text-body-md font-semibold text-primary">
                          #{String(orc.numero).padStart(4, '0')}
                        </td>
                        <td className="p-4 text-body-md text-on-surface">{clienteNome}</td>
                        <td className="p-4 text-body-md font-bold text-on-surface text-right">
                          R$ {formatBRL(orc.total)}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-label-md ${cfg.className}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="p-4 text-body-md text-secondary">{formatDate(orc.created_at)}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/orcamentos/${orc.id}`}
                              className="text-primary hover:text-primary-container p-1 rounded"
                              title="Abrir orçamento"
                            >
                              <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                            </Link>
                            <button
                              onClick={() => handleDelete(orc)}
                              disabled={isDeleting}
                              className="text-error hover:text-error-container p-1 rounded transition-colors disabled:opacity-50"
                              title="Excluir orçamento"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                {isDeleting ? 'hourglass_empty' : 'delete'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-outline-variant">
              {orcamentos.map((orc) => {
                const cfg = statusConfig[orc.status] ?? statusConfig.rascunho
                const clienteNome = orc.clientes?.nome ?? '—'
                const isDeleting = deletingId === orc.id
                return (
                  <div key={orc.id} className={`flex items-center p-4 gap-3 ${isDeleting ? 'opacity-40' : ''}`}>
                    <Link
                      href={`/orcamentos/${orc.id}`}
                      className="flex-1 flex items-center justify-between hover:bg-surface-container-low transition-colors rounded-lg -mx-1 px-1"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-label-md font-bold text-primary">
                            #{String(orc.numero).padStart(4, '0')}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-label-md ${cfg.className}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-body-md text-on-surface">{clienteNome}</p>
                        <p className="text-label-md text-secondary">{formatDate(orc.created_at)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 mr-2">
                        <span className="text-body-md font-bold text-on-surface">
                          R$ {formatBRL(orc.total)}
                        </span>
                        <span className="material-symbols-outlined text-secondary text-[20px]">chevron_right</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleDelete(orc)}
                      disabled={isDeleting}
                      className="text-error p-2 rounded-lg hover:bg-error-container transition-colors disabled:opacity-50 shrink-0"
                      title="Excluir"
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        {isDeleting ? 'hourglass_empty' : 'delete'}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </>
  )
}
