const qrText = document.getElementById('qr-text');
const downloadBtn = document.getElementById('downloadBtn');
const qrContainer = document.getElementById('qr-container');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Customization Inputs
const colorDots = document.getElementById('color-dots');
const colorBg = document.getElementById('color-bg');
const dotsStyle = document.getElementById('dots-style');
const cornerSquareStyle = document.getElementById('corner-square-style');
const logoUrl = document.getElementById('logo-url');

// Update Hex Values visually
colorDots.addEventListener('input', (e) => {
    e.target.nextElementSibling.textContent = e.target.value;
});
colorBg.addEventListener('input', (e) => {
    e.target.nextElementSibling.textContent = e.target.value;
});

// Tab Switching Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(`tab-${tabId}`).classList.add('active');
    });
});

// Toast Notification
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// QR Code Instance
const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    margin: 15,
    type: "canvas",
    data: "https://example.com",
    image: "",
    dotsOptions: {
        color: "#000000",
        type: "square"
    },
    backgroundOptions: {
        color: "#ffffff",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 10
    },
    cornersSquareOptions: {
        type: "square",
        color: "#000000"
    }
});

// Real-time Generate Logic
const allInputs = [qrText, colorDots, colorBg, dotsStyle, cornerSquareStyle, logoUrl];
allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if (qrText.value.trim().length > 0) {
            generateQRCode();
        } else {
            qrContainer.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-image"></i>
                    <p>Your QR code will appear here</p>
                </div>
            `;
            downloadBtn.classList.add('disabled');
        }
    });
});

qrText.addEventListener('change', () => {
    const val = qrText.value.trim();
    if (val.length > 0 && !val.includes('http://') && !val.includes('https://')) {
        showToast("Please include 'http://' or 'https://' in the URL for better compatibility.");
    }
});

function generateQRCode() {
    // Clear container
    qrContainer.innerHTML = "";
    
    // Update options from inputs
    qrCode.update({
        data: qrText.value,
        margin: 15,
        image: logoUrl.value.trim(),
        dotsOptions: {
            color: colorDots.value,
            type: dotsStyle.value
        },
        backgroundOptions: {
            color: colorBg.value,
        },
        cornersSquareOptions: {
            type: cornerSquareStyle.value,
            color: colorDots.value
        }
    });
    
    // Append to DOM
    qrCode.append(qrContainer);
    
    // Enable download button
    setTimeout(() => {
        downloadBtn.classList.remove('disabled');
    }, 100);
}

// Download Logic
downloadBtn.addEventListener('click', (e) => {
    if (downloadBtn.classList.contains('disabled')) {
        e.preventDefault();
        return;
    }
    qrCode.download({ name: "QR_Code", extension: "png" });
});

// Theme Toggle Logic
function setTheme(isDark) {
    if (isDark) {
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
    }
}

// Check system preference on load
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
setTheme(prefersDarkScheme.matches);

// Listen for system changes
prefersDarkScheme.addEventListener("change", (e) => {
    setTheme(e.matches);
});
