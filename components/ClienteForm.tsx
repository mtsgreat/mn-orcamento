'use client'

import { useState } from 'react'
import { ClienteFormData } from '@/types'

interface Props {
  cliente: ClienteFormData
  onChange: (data: ClienteFormData) => void
}

const inputClass =
  'w-full border border-outline-variant bg-black p-3 rounded-lg text-body-md text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#F54927] focus:border-transparent focus:outline-none transition-all'

const labelClass = 'block text-label-md text-on-surface-variant uppercase tracking-wider mb-1'

export default function ClienteForm({ cliente, onChange }: Props) {
  const [cnpjLoading, setCnpjLoading] = useState(false)
  const [cnpjError, setCnpjError] = useState<string | null>(null)
  const [cnpjFilled, setCnpjFilled] = useState(false)

  const set = (field: keyof ClienteFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...cliente, [field]: e.target.value })

  async function handleCnpjBlur() {
    const digits = cliente.cnpj.replace(/\D/g, '')
    if (digits.length !== 14) return
    setCnpjLoading(true)
    setCnpjError(null)
    setCnpjFilled(false)
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      const partes = [
        data.logradouro,
        data.numero,
        data.complemento,
        data.bairro,
        data.municipio && data.uf ? `${data.municipio} - ${data.uf}` : '',
      ].filter(Boolean).join(', ')
      onChange({
        ...cliente,
        nome: data.razao_social || cliente.nome,
        endereco: partes || cliente.endereco,
        telefone: data.ddd_telefone_1 || cliente.telefone,
      })
      setCnpjFilled(true)
    } catch {
      setCnpjError('CNPJ não encontrado')
    } finally {
      setCnpjLoading(false)
    }
  }

  return (
    <section className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5 text-primary">
        <span className="material-symbols-outlined">person</span>
        <h2 className="text-headline-md font-semibold uppercase tracking-wider">Dados do Cliente</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>CNPJ / CPF</label>
          <div className="relative">
            <input type="text" className={inputClass + ' pr-10'} placeholder="00.000.000/0000-00"
              value={cliente.cnpj} onChange={e => { set('cnpj')(e); setCnpjFilled(false); setCnpjError(null) }}
              onBlur={handleCnpjBlur} />
            {cnpjLoading && (
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline animate-spin text-[20px]">
                progress_activity
              </span>
            )}
            {!cnpjLoading && cnpjFilled && (
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-(--color-success,#1a8a1a) text-[20px]">
                check_circle
              </span>
            )}
          </div>
          {cnpjError && (
            <p className="text-label-sm text-error mt-1">{cnpjError}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Nome / Razão Social</label>
          <input type="text" className={inputClass} placeholder="Nome Completo ou Razão Social"
            value={cliente.nome} onChange={set('nome')} />
        </div>

        <div>
          <label className={labelClass}>Inscrição Estadual</label>
          <input type="text" className={inputClass} placeholder="Inscrição Estadual (ou ISENTO)"
            value={cliente.inscricao_estadual} onChange={set('inscricao_estadual')} />
        </div>

        <div>
          <label className={labelClass}>Telefone</label>
          <input type="tel" className={inputClass} placeholder="(00) 00000-0000"
            value={cliente.telefone} onChange={set('telefone')} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Endereço</label>
          <input type="text" className={inputClass} placeholder="Rua, Número, Bairro, Cidade - UF"
            value={cliente.endereco} onChange={set('endereco')} />
        </div>

        <div>
          <label className={labelClass}>Contato Principal</label>
          <input type="text" className={inputClass} placeholder="Nome do Responsável"
            value={cliente.contato} onChange={set('contato')} />
        </div>
      </div>
    </section>
  )
}
