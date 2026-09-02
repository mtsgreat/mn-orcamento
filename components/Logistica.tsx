'use client'

import { useState, useEffect } from 'react'

interface Props {
  frete: number
  onFreteChange: (value: number) => void
  desconto: number
  onDescontoChange: (value: number) => void
  prazoEntrega: string
  onPrazoChange: (value: string) => void
  formaPagamento: string
  onFormaPagamentoChange: (value: string) => void
  diasPrazo: number
  onDiasPrazoChange: (value: number) => void
  parcelas: number
  onParcelasChange: (value: number) => void
}

const inputClass =
  'w-full border border-outline-variant bg-white p-3 rounded-lg text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all'

const labelClass = 'block text-label-md text-on-surface-variant uppercase tracking-wider mb-1'

const formasPagamento = ['A Vista', 'PIX', 'Cartão de Crédito com Juros', 'Cartão de Crédito sem Juros', 'Cartão de Débito', 'Boleto', 'Transferência', 'Parcelado', '50% / 50%', '50% / Prazo']

const isCartaoCredito = (forma: string) => forma === 'Cartão de Crédito com Juros' || forma === 'Cartão de Crédito sem Juros'

export default function Logistica({ frete, onFreteChange, desconto, onDescontoChange, prazoEntrega, onPrazoChange, formaPagamento, onFormaPagamentoChange, diasPrazo, onDiasPrazoChange, parcelas, onParcelasChange }: Props) {
  const [diasInput, setDiasInput] = useState(String(diasPrazo))
  const [parcelasInput, setParcelasInput] = useState(String(parcelas))

  useEffect(() => {
    setDiasInput(String(diasPrazo))
  }, [diasPrazo])

  useEffect(() => {
    setParcelasInput(String(parcelas))
  }, [parcelas])

  return (
    <section className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5 text-primary">
        <span className="material-symbols-outlined">local_shipping</span>
        <h2 className="text-headline-md font-semibold uppercase tracking-wider">Logística e Pagamento</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Forma de Pagamento</label>
          <select
            className={inputClass}
            value={formaPagamento}
            onChange={(e) => onFormaPagamentoChange(e.target.value)}
          >
            {formasPagamento.map((f) => (
              <option key={f} value={f}>
                {f === '50% / Prazo' ? `50%/P/${diasPrazo} dias` : f}
              </option>
            ))}
          </select>
        </div>

        {formaPagamento === '50% / Prazo' && (
          <div>
            <label className={labelClass}>Prazo para restante do pagamento (dias)</label>
            <input
              type="number"
              min={1}
              value={diasInput}
              onChange={(e) => {
                setDiasInput(e.target.value)
                const num = parseInt(e.target.value)
                if (!isNaN(num) && num >= 1) onDiasPrazoChange(num)
              }}
              onBlur={() => {
                const num = parseInt(diasInput)
                const valid = !isNaN(num) && num >= 1 ? num : 1
                onDiasPrazoChange(valid)
                setDiasInput(String(valid))
              }}
              className={inputClass}
              placeholder="Ex: 15"
            />
          </div>
        )}

        {isCartaoCredito(formaPagamento) && (
          <div>
            <label className={labelClass}>Quantidade de Parcelas</label>
            <input
              type="number"
              min={1}
              value={parcelasInput}
              onChange={(e) => {
                setParcelasInput(e.target.value)
                const num = parseInt(e.target.value)
                if (!isNaN(num) && num >= 1) onParcelasChange(num)
              }}
              onBlur={() => {
                const num = parseInt(parcelasInput)
                const valid = !isNaN(num) && num >= 1 ? num : 1
                onParcelasChange(valid)
                setParcelasInput(String(valid))
              }}
              className={inputClass}
              placeholder="Ex: 3"
            />
          </div>
        )}

        <div>
          <label className={labelClass}>Prazo de Entrega</label>
          <input type="text" value={prazoEntrega} onChange={(e) => onPrazoChange(e.target.value)}
            className={inputClass} placeholder="Ex: 20 dias úteis após aprovação" />
        </div>

        <div>
          <label className={labelClass}>Frete e Montagem (R$)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-body-md select-none">R$</span>
            <input
              type="text"
              inputMode="decimal"
              value={frete === 0 ? '' : String(frete).replace('.', ',')}
              onChange={(e) => {
                const raw = e.target.value.replace(',', '.').replace(/[^\d.]/g, '')
                onFreteChange(parseFloat(raw) || 0)
              }}
              className={`${inputClass} pl-9`}
              placeholder="0,00"
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Desconto (R$)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-body-md select-none">R$</span>
            <input
              type="text"
              inputMode="decimal"
              value={desconto === 0 ? '' : String(desconto).replace('.', ',')}
              onChange={(e) => {
                const raw = e.target.value.replace(',', '.').replace(/[^\d.]/g, '')
                onDescontoChange(parseFloat(raw) || 0)
              }}
              className={`${inputClass} pl-9`}
              placeholder="0,00"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
