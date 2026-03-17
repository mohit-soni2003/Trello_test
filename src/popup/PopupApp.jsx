import { useEffect, useState } from 'react'

export default function PopupApp() {
  const [t, setT] = useState(null)
  const [card, setCard] = useState(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (window.parent === window) {
      setError('This popup must be opened from a Trello card.')
      return
    }

    const iframe = window.TrelloPowerUp.iframe()
    setT(iframe)
    iframe.card('id', 'name').then(setCard)
  }, [])

  const sendToViaSocket = async () => {
    if (!card || !t) return
    setSending(true)
    setError(null)
    try {
      const response = await fetch('https://flow.sokt.io/func/scrioNNVqxV2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: card.id,
          cardName: card.name,
        }),
      })

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      await t.set('card', 'shared', 'status', 'Sent')
      t.closePopup()
    } catch (err) {
      setError(err.message)
      setSending(false)
    }
  }

  return (
    <div style={{ padding: '12px', fontFamily: 'sans-serif' }}>
      {error && !card ? (
        <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>
      ) : card ? (
        <>
          <h3 style={{ marginTop: 0 }}>{card.name}</h3>
          {error && (
            <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>
          )}
          <button onClick={sendToViaSocket} disabled={sending}>
            {sending ? 'Sending...' : 'Send to ViaSocket'}
          </button>
        </>
      ) : (
        <p>Loading card...</p>
      )}
    </div>
  )
}
