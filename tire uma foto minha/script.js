const video = document.getElementById('video');
const captureButton = document.getElementById('captureButton');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const photoContainer = document.querySelector('.photo-container');
const effectSelect = document.getElementById('effectSelect');
const brightnessRange = document.getElementById('brightnessRange');
const contrastRange = document.getElementById('contrastRange');

let currentEffect = 'none';
let currentBrightness = 100;
let currentContrast = 100;

// Acessar a câmera do dispositivo
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (error) {
        console.error('Erro ao acessar a câmera:', error);
    }
}

// Capturar uma foto da câmera com efeito
function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    applyEffect(context, currentEffect);
    applyBrightness(context, currentBrightness);
    applyContrast(context, currentContrast);

    photo.src = canvas.toDataURL('image/png');
    photoContainer.style.display = 'block';
    video.style.display = 'none';
}

// Aplicar um efeito à imagem
function applyEffect(context, effect) {
    if (effect === 'grayscale') {
        applyGrayscaleEffect(context);
    } else if (effect === 'sepia') {
        applySepiaEffect(context);
    } else if (effect === 'invert') {
        applyInvertEffect(context);
    }
}

// Aplicar efeito de escala de cinza à imagem
function applyGrayscaleEffect(context) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }
    context.putImageData(imageData, 0, 0);
}

// Aplicar efeito de sépia à imagem
function applySepiaEffect(context) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        data[i] = Math.min(255, (red * 0.393 + green * 0.769 + blue * 0.189));
        data[i + 1] = Math.min(255, (red * 0.349 + green * 0.686 + blue * 0.168));
        data[i + 2] = Math.min(255, (red * 0.272 + green * 0.534 + blue * 0.131));
    }
    context.putImageData(imageData, 0, 0);
}

// Aplicar efeito de inversão de cores à imagem
function applyInvertEffect(context) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
    context.putImageData(imageData, 0, 0);
}

// Aplicar brilho à imagem
function applyBrightness(context, brightness) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const factor = (brightness - 100) / 100;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] + 255 * factor;
        data[i + 1] = data[i + 1] + 255 * factor;
        data[i + 2] = data[i + 2] + 255 * factor;
    }
    context.putImageData(imageData, 0, 0);
}

// Aplicar contraste à imagem
function applyContrast(context, contrast) {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const factor = (contrast - 100) / 100 + 1;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = (data[i] - 128) * factor + 128;
        data[i + 1] = (data[i + 1] - 128) * factor + 128;
        data[i + 2] = (data[i + 2] - 128) * factor + 128;
    }
    context.putImageData(imageData, 0, 0);
}

// Atualizar o efeito selecionado
effectSelect.addEventListener('change', () => {
    currentEffect = effectSelect.value;
    capturePhoto(); // Recapturar a foto com o novo efeito selecionado
});

// Atualizar o valor de brilho
brightnessRange.addEventListener('input', () => {
    currentBrightness = parseInt(brightnessRange.value);
    capturePhoto(); // Recapturar a foto com o novo valor de brilho
});

// Atualizar o valor de contraste
contrastRange.addEventListener('input', () => {
    currentContrast = parseInt(contrastRange.value);
    capturePhoto(); // Recapturar a foto com o novo valor de contraste
});

// Inicializar a câmera quando a página carregar
window.addEventListener('load', () => {
    setupCamera();
});

// Adicionar um ouvinte de evento ao botão de captura
captureButton.addEventListener('click', () => {
    capturePhoto();
});
