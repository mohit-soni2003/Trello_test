function renderStandaloneMessage() {
  document.body.innerHTML = `
    <main style="font-family: sans-serif; padding: 24px; line-height: 1.5;">
      <h1 style="margin-top: 0;">Trello Power-Up Connector</h1>
      <p>This page must be opened by Trello inside an iframe.</p>
      <p>For local development, expose your app over HTTPS and use that URL as the Power-Up connector URL in Trello admin.</p>
    </main>
  `
}

if (window.parent === window) {
  renderStandaloneMessage()
} else {
  window.TrelloPowerUp.initialize({
    'card-buttons': function (t) {
      return [{
        text: 'ViaSocket',
        callback: function (t) {
          return t.popup({
            title: 'Send to ViaSocket',
            url: 'popup.html'
          });
        }
      }]
    },

    'card-badges': function (t) {
      return t.get('card', 'shared', 'status')
        .then(function (status) {
          return [{
            text: status || 'Not Sent',
            color: status ? 'green' : 'red'
          }]
        })
    },

    'card-detail-badges': function (t) {
      return t.get('card', 'shared', 'status')
        .then(function (status) {
          return [{
            title: 'ViaSocket',
            text: status || 'Click to send',
            callback: function (t) {
              return t.popup({
                title: 'Send to ViaSocket',
                url: '/popup.html'
              })
            }
          }]
        })
    }
  })
}