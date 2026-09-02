'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
const newItem = (): ItemRow => ({ id: Date.now().toString(), descricao: '', quantidade: 1, valorUnitario: 0 })

function pdfFilename(clienteNome: string): string {
  const date = new Date()
  const d = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`
  const name = clienteNome.trim().replace(/[/\\?%*:|"<>]/g, '').replace(/\s+/g, '-') || 'cliente'
  return `orcamento-${name}-${d}.pdf`
}

export default function NovoOrcamento() {
  const router = useRouter()
  const [cliente, setCliente] = useState<ClienteFormData>(defaultCliente)
  const [itens, setItens] = useState<ItemRow[]>([newItem()])
  const [frete, setFrete] = useState(0)
  const [prazoEntrega, setPrazoEntrega] = useState('')
  const [formaPagamento, setFormaPagamento] = useState('A Vista')
  const [diasPrazo, setDiasPrazo] = useState(15)
  const [configPagamento, setConfigPagamento] = useState<ConfigPagamento | null>(null)
  const [desconto, setDesconto] = useState(0)
  const [parcelas, setParcelas] = useState(1)
  const [saving, setSaving] = useState(false)
  const [exportando, setExportando] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [numero, setNumero] = useState<number | null>(null)
  const [mostrarValorUnitario, setMostrarValorUnitario] = useState(false)

  const subtotal = itens.reduce((sum, i) => sum + i.quantidade * i.valorUnitario, 0)
  const total = subtotal - desconto + frete

  useEffect(() => {
    createClient().from('configuracao_pagamento').select('*').eq('id', 1).single()
      .then(({ data }) => { if (data) setConfigPagamento(data) })
  }, [])

  const persistir = async (): Promise<string | null> => {
    const supabase = createClient()
    let clienteId: string | null = null
    if (cliente.nome.trim()) {
      const { data } = await supabase.from('clientes')
        .insert({ nome: cliente.nome, cnpj: cliente.cnpj, inscricao_estadual: cliente.inscricao_estadual, endereco: cliente.endereco, telefone: cliente.telefone, contato: cliente.contato })
        .select('id').single()
      if (data) clienteId = data.id
    }
    const formaToSave = formaPagamento === '50% / Prazo'
      ? `50%/P/${diasPrazo} dias`
      : (formaPagamento === 'Cartão de Crédito com Juros' || formaPagamento === 'Cartão de Crédito sem Juros')
        ? `Cartão de crédito em ${parcelas} ${parcelas === 1 ? 'vez' : 'vezes'}, ${formaPagamento === 'Cartão de Crédito com Juros' ? 'com juros' : 'sem juros'}`
        : formaPagamento
    const { data: orc } = await supabase.from('orcamentos')
      .insert({ cliente_id: clienteId, prazo_entrega: prazoEntrega || null, forma_pagamento: formaToSave, frete, desconto, subtotal, total, status: 'rascunho' })
      .select('id, numero').single()
    if (orc) {
      setNumero(orc.numero)
      const itensValidos = itens.filter((i) => i.descricao.trim())
      if (itensValidos.length > 0) {
        await supabase.from('orcamento_itens').insert(
          itensValidos.map((i) => ({ orcamento_id: orc.id, descricao: i.descricao, quantidade: i.quantidade, valor_unitario: i.valorUnitario, subtotal: i.quantidade * i.valorUnitario }))
        )
      }
      return orc.id
    }
    return null
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const id = await persistir()
      if (id) router.push(`/orcamentos/${id}`)
    } finally { setSaving(false) }
  }

  const handlePDF = async () => {
    setExportando(true)
    try {
      const id = await persistir()
      await exportToPDF('orcamento-pdf', pdfFilename(cliente.nome))
      if (id) router.push(`/orcamentos/${id}`)
    } finally { setExportando(false) }
  }

  const handleShare = async () => {
    setSharing(true)
    try {
      await persistir()
      await sharePDF(
        'orcamento-pdf',
        pdfFilename(cliente.nome),
        `Orçamento ${numero ? '#' + String(numero).padStart(4, '0') : ''}`.trim()
      )
    } finally { setSharing(false) }
  }

const handleClear = () => {
    if (!confirm('Limpar todos os dados e iniciar um novo orçamento?')) return
    setCliente(defaultCliente)
    setItens([newItem()])
    setFrete(0)
    setPrazoEntrega('')
    setFormaPagamento('A Vista')
    setDiasPrazo(15)
    setParcelas(1)
    setNumero(null)
  }

  return (
    <>
      <main className="pt-20 pb-20 md:pb-8 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between py-4 md:py-6">
          <h1 className="text-headline-md font-bold text-on-background">Novo Orçamento</h1>
          {numero && (
            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-label-md">
              #{String(numero).padStart(4, '0')}
            </span>
          )}
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
                parcelas={parcelas} onParcelasChange={setParcelas}
              />
              <PagamentoCard config={configPagamento} />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <ResumoCard subtotal={subtotal} desconto={desconto} frete={frete} total={total} numero={numero}
              saving={saving || exportando} sharing={sharing} canGenerate={!!cliente.nome.trim()}
              mostrarValorUnitario={mostrarValorUnitario} onToggleMostrarValorUnitario={() => setMostrarValorUnitario(v => !v)}
              onSave={handleSave} onPDF={handlePDF} onShare={handleShare} onClear={handleClear} />
          </div>
        </div>
      </main>

      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
        <OrcamentoPDF id="orcamento-pdf" cliente={cliente} itens={itens} frete={frete} desconto={desconto}
          prazoEntrega={prazoEntrega}
          formaPagamento={
            formaPagamento === '50% / Prazo'
              ? `50%/P/${diasPrazo} dias`
              : (formaPagamento === 'Cartão de Crédito com Juros' || formaPagamento === 'Cartão de Crédito sem Juros')
                ? `Cartão de crédito em ${parcelas} ${parcelas === 1 ? 'vez' : 'vezes'}, ${formaPagamento === 'Cartão de Crédito com Juros' ? 'com juros' : 'sem juros'}`
                : formaPagamento
          }
          subtotal={subtotal} total={total} configPagamento={configPagamento} numero={numero} mostrarValorUnitario={mostrarValorUnitario} />
      </div>

      <BottomNav />
    </>
  )
}
