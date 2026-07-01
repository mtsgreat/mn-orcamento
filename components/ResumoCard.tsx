'use client'

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

interface Props {
  subtotal: number
  desconto: number
  frete: number
  total: number
  numero: number | null
  saving: boolean
  sharing?: boolean
  canGenerate?: boolean
  onSave: () => void
  onPDF: () => void
  onShare?: () => Promise<void>
  onClear: () => void
}

export default function ResumoCard({ subtotal, desconto, frete, total, numero, saving, sharing, canGenerate = false, onSave, onPDF, onShare, onClear }: Props) {
  return (
    <div className="sticky top-20 bg-primary text-on-primary p-8 rounded-xl shadow-lg border-b-8 border-primary-container">
      {/* Total */}
      <p className="text-label-md opacity-80 uppercase mb-1">Total do Orçamento</p>
      <div className="text-headline-lg font-bold tracking-tight mb-1">
        R$ {formatBRL(total)}
      </div>
      <p className="text-body-md opacity-70 mb-6">
        {frete > 0 ? 'Inclui serviços, frete e montagem' : 'Somente serviços'}
      </p>

      {/* Breakdown */}
      <div className="space-y-2 mb-6 border-t border-white/20 pt-4">
        <div className="flex justify-between text-body-md opacity-80">
          <span>Subtotal</span>
          <span className="font-medium">R$ {formatBRL(subtotal)}</span>
        </div>
        {desconto > 0 && (
          <div className="flex justify-between text-body-md opacity-80">
            <span>Desconto</span>
            <span className="font-medium">- R$ {formatBRL(desconto)}</span>
          </div>
        )}
        {frete > 0 && (
          <div className="flex justify-between text-body-md opacity-80">
            <span>Frete e Montagem</span>
            <span className="font-medium">R$ {formatBRL(frete)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold border-t border-white/20 pt-2">
          <span>Total</span>
          <span>R$ {formatBRL(total)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onPDF}
          disabled={!canGenerate}
          className="w-full flex items-center justify-center gap-2 bg-surface-container-lowest text-primary font-bold py-3.5 rounded-xl shadow hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">picture_as_pdf</span>
          Gerar PDF
        </button>

        {onShare && (
          <button
            onClick={onShare}
            disabled={!canGenerate || sharing}
            className="w-full flex items-center justify-center gap-2 bg-surface-container-lowest text-primary font-bold py-3.5 rounded-xl shadow hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">{sharing ? 'hourglass_empty' : 'share'}</span>
            {sharing ? 'Preparando...' : 'Enviar por Email'}
          </button>
        )}

        <button
          onClick={onSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary font-bold py-3.5 rounded-xl border border-white/30 hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-60"
        >
          <span className="material-symbols-outlined">{saving ? 'hourglass_empty' : 'save'}</span>
          {saving ? 'Salvando...' : 'Salvar Rascunho'}
        </button>

        <button
          onClick={onClear}
          className="w-full flex items-center justify-center gap-2 border border-white/30 text-on-primary font-semibold py-3 rounded-xl hover:bg-white/10 transition-colors text-body-md"
        >
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          Limpar / Novo
        </button>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-end opacity-70">
        <span className="text-label-md">
          {numero ? `#${String(numero).padStart(4, '0')}` : 'Rascunho'}
        </span>
      </div>
    </div>
  )
}
