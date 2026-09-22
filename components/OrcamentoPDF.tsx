'use client'

import { ClienteFormData, ConfigPagamento, ItemRow } from '@/types'

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDateFull() {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

interface Props {
  id: string
  cliente: ClienteFormData
  itens: ItemRow[]
  frete: number
  desconto: number
  prazoEntrega: string
  formaPagamento: string
  subtotal: number
  total: number
  configPagamento: ConfigPagamento | null
  numero: number | null
  mostrarValorUnitario?: boolean
}

const BORDER = '1px solid #e0e0e0'
const CELL: React.CSSProperties = { border: BORDER, padding: '4px 6px', fontSize: '12px' }
const HEADER_CELL: React.CSSProperties = { ...CELL, backgroundColor: '#b0b0b0', fontWeight: 700, textAlign: 'center', border: '1px solid #bbb' }
const LABEL_CELL: React.CSSProperties = { ...CELL, fontWeight: 700, whiteSpace: 'nowrap' }

// Minimum rows shown in the items table
const MIN_ROWS = 10

export default function OrcamentoPDF({ id, cliente, itens, frete, desconto, prazoEntrega, formaPagamento, subtotal, total, configPagamento, numero, mostrarValorUnitario = false }: Props) {
  const numStr = ''
  const dateStr = formatDateFull()

  // Pad itens to MIN_ROWS
  const filledItens = [
    ...itens.filter((i) => i.descricao.trim()),
    ...Array(Math.max(0, MIN_ROWS - itens.filter((i) => i.descricao.trim()).length)).fill(null),
  ]

  const config = configPagamento

  return (
    <div
      id={id}
      style={{
        width: '794px',
        backgroundColor: '#fff',
        padding: '24px 32px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        color: '#000',
        boxSizing: 'border-box',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
          src="/logo.png"
          alt=""
          style={{ width: '400px', marginBottom: '20px' }}
        />
      </div>
      {/* ── TITLE ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '6px' }}>
        <tbody>
          <tr>
            <td style={{ ...HEADER_CELL, fontSize: '18px', letterSpacing: '2px', padding: '10px', backgroundColor: '#b0bec5', border: '1px solid #9aa5af' }}>
              ORÇAMENTO {numStr}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── DATE ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
        <tbody>
          <tr>
            <td style={{ ...CELL, textAlign: 'right', fontWeight: 700, border: 'none', paddingRight: 0 }}>
              {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── CLIENT DATA ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
        <tbody>
          <tr>
            <td style={{ ...LABEL_CELL, width: '80px' }}>Cliente:</td>
            <td style={{ ...CELL, width: '55%' }}>{cliente.nome}</td>
            <td style={{ ...LABEL_CELL, width: '40px', textAlign: 'right' }}></td>
            <td style={{ ...CELL }}></td>
          </tr>
          <tr>
            <td style={LABEL_CELL}>Cnpj:</td>
            <td style={CELL}>{cliente.cnpj}</td>
            <td style={{ ...LABEL_CELL, textAlign: 'right' }}>Insc:</td>
            <td style={CELL}>{cliente.inscricao_estadual}</td>
          </tr>
          <tr>
            <td style={LABEL_CELL}>Endereço:</td>
            <td style={{ ...CELL }} colSpan={3}>{cliente.endereco}</td>
          </tr>
          <tr>
            <td style={LABEL_CELL}>Fone:</td>
            <td style={CELL}>{cliente.telefone}</td>
            <td style={{ ...LABEL_CELL, textAlign: 'right' }}>Contato:</td>
            <td style={CELL}>{cliente.contato}</td>
          </tr>
        </tbody>
      </table>

      {/* ── SERVICE HEADER ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
        <tbody>
          <tr>
            <td style={{ ...HEADER_CELL, padding: '6px', letterSpacing: '1px', backgroundColor: '#b0bec5', border: '1px solid #9aa5af' }}>SERVIÇO OFERECIDO</td>
          </tr>
          <tr>
            <td style={{ ...CELL, textAlign: 'center', fontWeight: 700, textDecoration: 'underline' }}>DESCRIÇÃO</td>
          </tr>
        </tbody>
      </table>

      {/* ── ITEMS TABLE ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
        <thead>
          <tr>
            <th style={{ ...HEADER_CELL, width: '60px', backgroundColor: '#b0bec5', border: '1px solid #9aa5af' }}>QTD</th>
            <th style={{ ...HEADER_CELL, backgroundColor: '#b0bec5', border: '1px solid #9aa5af' }}>ITEM</th>
            {mostrarValorUnitario && <th style={{ ...HEADER_CELL, width: '110px', backgroundColor: '#b0bec5', border: '1px solid #9aa5af' }}>VALOR UNITÁRIO</th>}
            {mostrarValorUnitario && <th style={{ ...HEADER_CELL, width: '110px', backgroundColor: '#b0bec5', border: '1px solid #9aa5af' }}>SUBTOTAL</th>}
          </tr>
        </thead>
        <tbody>
          {filledItens.map((item: ItemRow | null, idx) => {
            const sub = item ? item.quantidade * item.valorUnitario : null
            return (
              <tr key={idx}>
                <td style={{ ...CELL, textAlign: 'center', height: '22px' }}>
                  {item ? item.quantidade : ''}
                </td>
                <td style={CELL}>{item?.descricao ?? ''}</td>
                {mostrarValorUnitario && <td style={{ ...CELL, textAlign: 'right' }}>{item ? formatBRL(item.valorUnitario) : ''}</td>}
                {mostrarValorUnitario && <td style={{ ...CELL, textAlign: 'right' }}>{sub != null ? formatBRL(sub) : ''}</td>}
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* ── TOTALS ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
        <tbody>
          <tr>
            <td style={{ ...CELL, textAlign: 'right', fontWeight: 700 }} colSpan={2}>VALOR DOS ITENS:</td>
            <td style={{ ...CELL, textAlign: 'right', width: '110px' }}>R$ {formatBRL(subtotal)}</td>
            <td style={{ ...CELL, width: '110px' }}></td>
          </tr>
          {desconto > 0 && (
            <tr>
              <td style={{ ...CELL, textAlign: 'right', fontWeight: 700 }} colSpan={2}>DESCONTO:</td>
              <td style={{ ...CELL, textAlign: 'right' }}>- R$ {formatBRL(desconto)}</td>
              <td style={CELL}></td>
            </tr>
          )}
          {frete > 0 && (
            <tr>
              <td style={{ ...CELL, textAlign: 'right', fontWeight: 700 }} colSpan={2}>FRETE E MONTAGEM</td>
              <td style={{ ...CELL, textAlign: 'right' }}>R$ {formatBRL(frete)}</td>
              <td style={CELL}></td>
            </tr>
          )}
          <tr>
            <td style={{ ...CELL, textAlign: 'right', fontWeight: 700 }} colSpan={2}>TOTAL GERAL:</td>
            <td style={{ ...CELL, textAlign: 'right', fontWeight: 700 }}>R$ {formatBRL(total)}</td>
            <td style={CELL}></td>
          </tr>
        </tbody>
      </table>

      {/* ── TRANSFER DATA ── */}
      {config && (config.favorecido || config.chave_pix) && (
        <div style={{ marginBottom: '4px', fontSize: '12px' }}>
          <div style={{ fontWeight: 700, marginBottom: '2px' }}>Dados para transferência:</div>
          {config.favorecido && <div>Nome: {config.favorecido}</div>}
          {config.chave_pix && (
            <div>Chave pix {config.tipo_chave ? config.tipo_chave + ':' : ''} {config.chave_pix}
              {config.banco ? `  |  Instituição: ${config.banco}` : ''}
            </div>
          )}
          {config.agencia && config.conta && (
            <div>Agência: {config.agencia}  —  Conta: {config.conta}</div>
          )}
        </div>
      )}

      {/* ── PAYMENT + DELIVERY ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
        <tbody>
          <tr>
            <td style={{ ...LABEL_CELL, width: '50%' }}>FORMA DE PAGAMENTO:</td>
            <td style={CELL}>{formaPagamento || 'A Vista'}</td>
          </tr>
          {prazoEntrega && (
            <tr>
              <td style={LABEL_CELL}>PRAZO DE ENTREGA:</td>
              <td style={CELL}>{prazoEntrega} Dias</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ── COMPANY DATA ── */}
      {config && (config.nome_empresa || config.cnpj_empresa || config.endereco_empresa) && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2px' }}>
          <tbody>
            <tr>
              <td style={{ ...HEADER_CELL, textAlign: 'left', padding: '6px 8px', backgroundColor: '#b0bec5', border: '1px solid #9aa5af' }}>DADOS DA EMPRESA</td>
            </tr>
            <tr>
              <td style={{ ...CELL, border: 'none', padding: '3px 0', fontSize: '12px', lineHeight: '1.6' }}>
                {config.nome_empresa && <div>{config.nome_empresa}</div>}
                {config.cnpj_empresa && <div>CNPJ: {config.cnpj_empresa}</div>}
                {config.endereco_empresa && <div>ENDEREÇO: {config.endereco_empresa}</div>}
                {config.contato_empresa && <div>CONTATO: {config.contato_empresa}</div>}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}
