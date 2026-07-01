'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ClienteForm from '@/components/ClienteForm'
import ItensServico from '@/components/ItensServico'
import Logistica from '@/components/Logistica'
import PagamentoCard from '@/components/PagamentoCard'
import ResumoCard from '@/components/ResumoCard'
import OrcamentoPDF from '@/components/OrcamentoPDF'
import BottomNav from '@/components/BottomNav'
import { ClienteFormData, ConfigPagamento, ItemRow } from '@/types'
import { createClient } from '@/lib/supabase'
import { exportToPDF, sharePDF } from '@/lib/pdf'

const defaultCliente: ClienteFormData = {
  nome: '', cnpj: '', inscricao_estadual: '', endereco: '', telefone: '', contato: '',
}

function pdfFilename(clienteNome: string): string {
  const date = new Date()
  const d = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`
  const name = clienteNome.trim().replace(/[/\\?%*:|"<>]/g, '').replace(/\s+/g, '-') || 'cliente'
  return `orcamento-${name}-${d}.pdf`
}

export default function OrcamentoDetalhes() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [cliente, setCliente] = useState<ClienteFormData>(defaultCliente)
  const [itens, setItens] = useState<ItemRow[]>([])
  const [frete, setFrete] = useState(0)
  const [desconto, setDesconto] = useState(0)
  const [prazoEntrega, setPrazoEntrega] = useState('')
  const [formaPagamento, setFormaPagamento] = useState('A Vista')
  const [diasPrazo, setDiasPrazo] = useState(15)
  const [configPagamento, setConfigPagamento] = useState<ConfigPagamento | null>(null)
  const [saving, setSaving] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [numero, setNumero] = useState<number | null>(null)
  const [status, setStatus] = useState<string>('rascunho')

  const subtotal = itens.reduce((sum, i) => sum + i.quantidade * i.valorUnitario, 0)
  const total = subtotal - desconto + frete

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const [{ data: orc }, { data: config }] = await Promise.all([
        supabase.from('orcamentos').select('*, clientes(*), orcamento_itens(*)').eq('id', id).single(),
        supabase.from('configuracao_pagamento').select('*').eq('id', 1).single(),
      ])
      if (!orc) { router.push('/'); return }
      setNumero(orc.numero)
      setStatus(orc.status)
      setFrete(orc.frete ?? 0)
      setDesconto(orc.desconto ?? 0)
      setPrazoEntrega(orc.prazo_entrega ?? '')
      const formaRaw: string = orc.forma_pagamento ?? 'A Vista'
      const prazoMatch = formaRaw.match(/^50%\/P\/(\d+) dias$/)
      if (prazoMatch) {
        setFormaPagamento('50% / Prazo')
        setDiasPrazo(parseInt(prazoMatch[1], 10))
      } else {
        setFormaPagamento(formaRaw)
      }
      if (config) setConfigPagamento(config)
      if (orc.clientes) {
        const c = orc.clientes as Record<string, string>
        setCliente({ nome: c.nome ?? '', cnpj: c.cnpj ?? '', inscricao_estadual: c.inscricao_estadual ?? '', endereco: c.endereco ?? '', telefone: c.telefone ?? '', contato: c.contato ?? '' })
      }
      if (orc.orcamento_itens?.length) {
        setItens((orc.orcamento_itens as Array<Record<string, unknown>>).map((i) => ({
          id: String(i.id), descricao: String(i.descricao ?? ''),
          quantidade: Number(i.quantidade ?? 1), valorUnitario: Number(i.valor_unitario ?? 0),
        })))
      } else {
        setItens([{ id: Date.now().toString(), descricao: '', quantidade: 1, valorUnitario: 0 }])
      }
      setLoading(false)
    }
    load()
  }, [id, router])

  const handleSave = async () => {
    setSaving(true)
    try {
      const formaToSave = formaPagamento === '50% / Prazo' ? `50%/P/${diasPrazo} dias` : formaPagamento
      await createClient().from('orcamentos')
        .update({ prazo_entrega: prazoEntrega || null, forma_pagamento: formaToSave, frete, desconto, subtotal, total })
        .eq('id', id)
    } finally { setSaving(false) }
  }

  const handlePDF = async () => {
    await handleSave()
    await exportToPDF('orcamento-pdf', pdfFilename(cliente.nome))
  }

  const handleShare = async () => {
    setSharing(true)
    try {
      await handleSave()
      await sharePDF(
        'orcamento-pdf',
        pdfFilename(cliente.nome),
        `Orçamento ${numero ? '#' + String(numero).padStart(4, '0') : ''}`.trim()
      )
    } finally { setSharing(false) }
  }

if (loading) {
    return (
      <main className="pt-20 pb-20 md:pb-8 px-4 lg:px-8 max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-secondary">
          <span className="material-symbols-outlined text-[40px] animate-spin">progress_activity</span>
          <p className="text-body-md">Carregando orçamento...</p>
        </div>
      </main>
    )
  }

  const statusColors: Record<string, string> = {
    rascunho: 'bg-surface-container-high text-on-surface-variant',
    enviado: 'bg-secondary-container text-primary',
    aprovado: 'bg-green-100 text-green-800',
  }

  return (
    <>
      <main className="pt-20 pb-20 md:pb-8 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between py-4 md:py-6 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-headline-md font-bold text-on-background">
              Orçamento #{numero ? String(numero).padStart(4, '0') : '—'}
            </h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-label-md capitalize ${statusColors[status] ?? statusColors.rascunho}`}>
            {status}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <ClienteForm cliente={cliente} onChange={setCliente} />
            <ItensServico itens={itens} onChange={setItens} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Logistica
                frete={frete} onFreteChange={setFrete}
                desconto={desconto} onDescontoChange={setDesconto}
                prazoEntrega={prazoEntrega} onPrazoChange={setPrazoEntrega}
                formaPagamento={formaPagamento} onFormaPagamentoChange={setFormaPagamento}
                diasPrazo={diasPrazo} onDiasPrazoChange={setDiasPrazo}
              />
              <PagamentoCard config={configPagamento} />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <ResumoCard subtotal={subtotal} desconto={desconto} frete={frete} total={total} numero={numero}
              saving={saving} sharing={sharing} canGenerate={!!cliente.nome.trim()}
              onSave={handleSave} onPDF={handlePDF} onShare={handleShare} onClear={() => router.push('/orcamentos/novo')} />
          </div>
        </div>
      </main>

      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
        <OrcamentoPDF id="orcamento-pdf" cliente={cliente} itens={itens} frete={frete} desconto={desconto}
          prazoEntrega={prazoEntrega} formaPagamento={formaPagamento === '50% / Prazo' ? `50%/P/${diasPrazo} dias` : formaPagamento}
          subtotal={subtotal} total={total} configPagamento={configPagamento} numero={numero} />
      </div>

      <BottomNav />
    </>
  )
}
