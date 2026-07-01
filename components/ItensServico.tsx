'use client'

import { useState } from 'react'
import { ItemRow } from '@/types'

interface Props {
  itens: ItemRow[]
  onChange: (itens: ItemRow[]) => void
}

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function parseBRL(raw: string): number {
  // Accept both "1.500,00" and "1500.00" and "1500,00"
  const cleaned = raw.trim().replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}

export default function ItensServico({ itens, onChange }: Props) {
  // Track raw string input per item so we don't clobber mid-typing (e.g. "100,")
  const [rawQtd, setRawQtd] = useState<Record<string, string>>({})
  const [rawVal, setRawVal] = useState<Record<string, string>>({})

  const addRow = () => {
    onChange([...itens, { id: Date.now().toString(), descricao: '', quantidade: 1, valorUnitario: 0 }])
  }

  const removeRow = (id: string) => {
    if (itens.length === 1) return
    onChange(itens.filter((item) => item.id !== id))
    setRawQtd((p) => { const c = { ...p }; delete c[id]; return c })
    setRawVal((p) => { const c = { ...p }; delete c[id]; return c })
  }

  const updateRow = (id: string, field: keyof ItemRow, value: string | number) => {
    onChange(itens.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const getQtdDisplay = (item: ItemRow) =>
    rawQtd[item.id] ?? (item.quantidade === 0 ? '' : String(item.quantidade).replace('.', ','))

  const getValDisplay = (item: ItemRow) =>
    rawVal[item.id] ?? (item.valorUnitario === 0 ? '' : String(item.valorUnitario).replace('.', ','))

  return (
    <section className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-0 flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined">inventory_2</span>
        <h2 className="text-headline-md font-semibold uppercase tracking-wider">Itens do Serviço</h2>
      </div>

      {/* Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-y border-outline-variant">
              <th className="p-3 text-label-md text-on-surface-variant w-20">QTD</th>
              <th className="p-3 text-label-md text-on-surface-variant">DESCRIÇÃO</th>
              <th className="p-3 text-label-md text-on-surface-variant w-36 text-right">VL. UNIT. (R$)</th>
              <th className="p-3 text-label-md text-on-surface-variant w-32 text-right">SUBTOTAL</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => {
              const subtotal = item.quantidade * item.valorUnitario
              return (
                <tr
                  key={item.id}
                  className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group"
                >
                  {/* QTD */}
                  <td className="p-3">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="1"
                      value={getQtdDisplay(item)}
                      onChange={(e) => {
                        setRawQtd((p) => ({ ...p, [item.id]: e.target.value }))
                        updateRow(item.id, 'quantidade', parseBRL(e.target.value))
                      }}
                      onBlur={(e) => {
                        const n = parseBRL(e.target.value)
                        setRawQtd((p) => { const c = { ...p }; delete c[item.id]; return c })
                        updateRow(item.id, 'quantidade', n || 1)
                      }}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-md outline-none placeholder:text-outline"
                    />
                  </td>

                  {/* DESCRIÇÃO */}
                  <td className="p-3">
                    <input
                      type="text"
                      placeholder="Descrição do serviço ou produto"
                      value={item.descricao}
                      onChange={(e) => updateRow(item.id, 'descricao', e.target.value)}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-md outline-none placeholder:text-outline"
                    />
                  </td>

                  {/* VL. UNIT. */}
                  <td className="p-3">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={getValDisplay(item)}
                      onChange={(e) => {
                        setRawVal((p) => ({ ...p, [item.id]: e.target.value }))
                        updateRow(item.id, 'valorUnitario', parseBRL(e.target.value))
                      }}
                      onBlur={(e) => {
                        const n = parseBRL(e.target.value)
                        setRawVal((p) => { const c = { ...p }; delete c[item.id]; return c })
                        updateRow(item.id, 'valorUnitario', n)
                      }}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-md text-right outline-none placeholder:text-outline"
                    />
                  </td>

                  {/* SUBTOTAL */}
                  <td className="p-3 text-right text-body-md font-semibold text-on-surface">
                    {formatBRL(subtotal)}
                  </td>

                  {/* DELETE */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => removeRow(item.id)}
                      disabled={itens.length === 1}
                      className="text-error opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-opacity"
                      title="Remover item"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Add row button */}
      <div className="p-4 bg-surface-container-lowest flex justify-center">
        <button
          onClick={addRow}
          className="flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-on-primary px-6 py-2 rounded-full text-label-md transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Adicionar Item
        </button>
      </div>
    </section>
  )
}
