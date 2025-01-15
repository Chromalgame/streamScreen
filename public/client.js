const sourceSelect = document.getElementById('sourceSelect');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoElement = document.getElementById('video');

let mediaStream = null;
let mediaRecorder = null;

async function startScreenSharing() {
  const source = sourceSelect.value; // Récupère la source sélectionnée par l'utilisateur
  try {
    const constraints = {
      video: {
        displaySurface: source, // Utilise la valeur sélectionnée : "monitor", "window", "browser"
        cursor: "always",       // Toujours afficher le curseur
      },
      audio: false, // Désactiver l'audio pour l'instant
    };

    // Capture de l'écran avec les contraintes
    mediaStream = await navigator.mediaDevices.getDisplayMedia(constraints);

    // Affiche le flux vidéo capturé
    videoElement.srcObject = mediaStream;

    // Envoi du flux via WebSocket
    mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        socket.emit('stream', event.data);
      }
    };
    mediaRecorder.start(100);

    // Mise à jour des boutons
    startBtn.disabled = true;
    stopBtn.disabled = false;
  } catch (err) {
    console.error('Erreur lors du partage d\'écran :', err);
    alert('Impossible de capturer la source sélectionnée.');
  }
}

function stopScreenSharing() {
  if (mediaStream) {
    // Arrête les pistes
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;

    // Réinitialise la vidéo
    videoElement.srcObject = null;

    // Mise à jour des boutons
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
}

// Gestion des événements des boutons
startBtn.addEventListener('click', startScreenSharing);
stopBtn.addEventListener('click', stopScreenSharing);
