'use client'

import { useRef, useState } from 'react'
import { submitContactMessage } from '@/lib/data/contact'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const fieldStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: '12px 14px',
  color: 'var(--text)',
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color .2s',
}

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const mountedAt = useRef(Date.now())
  const honeypotRef = useRef<HTMLInputElement>(null)

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--violet)'
  }
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--border)'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot rempli ou soumission trop rapide → probable bot,
    // on affiche un succès factice sans rien envoyer.
    const isBot = (honeypotRef.current?.value ?? '') !== '' || Date.now() - mountedAt.current < 1500
    if (isBot) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    const result = await submitContactMessage({ name, email, message })
    if (result.ok) {
      setStatus('sent')
      setName('')
      setEmail('')
      setMessage('')
    } else {
      setStatus('error')
      setErrorMsg(result.error ?? 'Une erreur est survenue')
    }
  }

  if (status === 'sent') {
    return (
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 14, padding: 32, textAlign: 'center',
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
          Message envoyé
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-2)' }}>
          Merci, je reviens vers vous rapidement.
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 14, padding: 28,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}
    >
      {/* Honeypot — invisible pour les visiteurs, tentant pour les bots */}
      <input
        ref={honeypotRef}
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: -9999, width: 1, height: 1, opacity: 0 }}
        aria-hidden="true"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12.5, color: 'var(--text-2)', marginBottom: 7 }}>Nom</label>
          <input
            type="text"
            required
            maxLength={200}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={focusStyle}
            onBlur={blurStyle}
            disabled={status === 'sending'}
            style={fieldStyle}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12.5, color: 'var(--text-2)', marginBottom: 7 }}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={focusStyle}
            onBlur={blurStyle}
            disabled={status === 'sending'}
            style={fieldStyle}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 12.5, color: 'var(--text-2)', marginBottom: 7 }}>Message</label>
        <textarea
          required
          maxLength={5000}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={focusStyle}
          onBlur={blurStyle}
          disabled={status === 'sending'}
          style={{ ...fieldStyle, resize: 'vertical' }}
        />
      </div>

      {status === 'error' && (
        <div style={{ fontSize: 13, color: '#f87171' }}>{errorMsg}</div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          alignSelf: 'flex-start',
          fontFamily: 'var(--font-jetbrains-mono), monospace',
          fontSize: 13.5, fontWeight: 600,
          padding: '11px 22px', borderRadius: 10,
          border: '1px solid var(--violet)',
          background: status === 'sending' ? 'var(--violet-soft)' : 'var(--violet)',
          color: '#fff',
          cursor: status === 'sending' ? 'default' : 'pointer',
          opacity: status === 'sending' ? 0.7 : 1,
        }}
      >
        {status === 'sending' ? 'Envoi…' : 'Envoyer'}
      </button>
    </form>
  )
}
