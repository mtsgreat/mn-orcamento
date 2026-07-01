'use client'

import { ConfigPagamento } from '@/types'

interface Props {
  config: ConfigPagamento | null
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-outline-variant last:border-0">
      <span className="text-label-md text-secondary uppercase tracking-wider">{label}</span>
      <span className="text-body-md font-semibold text-on-surface">{value}</span>
    </div>
  )
}

export default function PagamentoCard({ config }: Props) {
  const copyPIX = () => {
    if (config?.chave_pix) {
      navigator.clipboard.writeText(config.chave_pix)
    }
  }

  return (
    <section className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-6">
      <div className="flex items-center gap-2 mb-5 text-primary">
        <span className="material-symbols-outlined">account_balance_wallet</span>
        <h2 className="text-headline-md font-semibold uppercase tracking-wider">Pagamento</h2>
      </div>

      {!config || (!config.banco && !config.chave_pix) ? (
        <div className="flex flex-col items-center justify-center py-6 text-center text-secondary gap-2">
          <span className="material-symbols-outlined text-[32px] opacity-40">account_balance</span>
          <p className="text-body-md opacity-60">Dados de transferência não configurados.</p>
          <a href="/configuracoes" className="text-label-md text-primary underline underline-offset-2">
            Configurar agora →
          </a>
        </div>
      ) : (
        <div className="bg-surface-container-low rounded-lg border border-outline-variant p-4 space-y-0">
          <Row label="Favorecido" value={config.favorecido} />
          <Row label="CNPJ/CPF" value={config.cnpj_favorecido} />
          <Row label="Banco" value={config.banco} />
          <Row label="Agência" value={config.agencia} />
          <Row label="Conta" value={config.conta} />

          {config.chave_pix && (
            <div className="flex justify-between items-center py-1.5">
              <span className="text-label-md text-secondary uppercase tracking-wider">
                PIX ({config.tipo_chave || 'chave'})
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-body-md font-semibold text-primary font-mono text-right max-w-[160px] truncate">
                  {config.chave_pix}
                </span>
                <button
                  onClick={copyPIX}
                  title="Copiar chave PIX"
                  className="text-secondary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
