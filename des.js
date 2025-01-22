// des.js
const usuarios = {
  'usuario1': 'senha1',
  'usuario2': 'senha2'
};

let usuarioAtual = '';

// Função para salvar mensagens no localStorage
function salvarMensagens(mensagens) {
  localStorage.setItem('chatMensagens', JSON.stringify(mensagens));
}

// Função para carregar mensagens do localStorage
function carregarMensagensStorage() {
  const mensagensStorage = localStorage.getItem('chatMensagens');
  return mensagensStorage ? JSON.parse(mensagensStorage) : [];
}

function fazerLogin() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorElement = document.getElementById('loginError');

  if (usuarios[username] && usuarios[username] === password) {
      usuarioAtual = username;
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('chatScreen').style.display = 'flex';
      document.getElementById('currentUser').textContent = `Conectado como: ${username}`;
      carregarMensagens();
      // Inicia a verificação periódica de novas mensagens
      iniciarAtualizacaoAutomatica();
  } else {
      errorElement.textContent = 'Usuário ou senha incorretos!';
  }
}

function fazerLogout() {
  usuarioAtual = '';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('chatScreen').style.display = 'none';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('loginError').textContent = '';
  // Para a atualização automática ao fazer logout
  pararAtualizacaoAutomatica();
}

function enviarMensagem() {
  const input = document.getElementById('messageInput');
  const mensagem = input.value.trim();

  if (mensagem) {
      const mensagens = carregarMensagensStorage();
      const novaMensagem = {
          texto: mensagem,
          remetente: usuarioAtual,
          horario: new Date().toLocaleTimeString(),
          status: 'enviado'
      };

      mensagens.push(novaMensagem);
      salvarMensagens(mensagens);
      input.value = '';
      exibirMensagens();
  }
}

function exibirMensagens() {
  const chatMessages = document.getElementById('chatMessages');
  const mensagens = carregarMensagensStorage();
  chatMessages.innerHTML = '';

  mensagens.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${msg.remetente === usuarioAtual ? 'sent' : 'received'}`;
      
      messageDiv.innerHTML = `
          <div class="sender">${msg.remetente} - ${msg.horario}</div>
          <div class="text">${msg.texto}</div>
          <div class="status">${msg.status}</div>
      `;

      chatMessages.appendChild(messageDiv);
  });

  // Rola para a última mensagem
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

let intervalId = null;

function iniciarAtualizacaoAutomatica() {
  // Atualiza as mensagens a cada 1 segundo
  intervalId = setInterval(carregarMensagens, 1000);
}

function pararAtualizacaoAutomatica() {
  if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
  }
}

function carregarMensagens() {
  exibirMensagens();
}

// Event listener para enviar mensagem com Enter
document.getElementById('messageInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
      enviarMensagem();
  }
});

// Limpar mensagens (função auxiliar para testes)
function limparMensagens() {
  localStorage.removeItem('chatMensagens');
  exibirMensagens();
}