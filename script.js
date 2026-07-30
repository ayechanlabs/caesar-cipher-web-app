const 
modeToggle = document.querySelector("#modeToggle"),
labelEncrypt = document.querySelector("#labelEncrypt"),
labelDecrypt = document.querySelector("#labelDecrypt"),

inputHeading = document.querySelector("#inputHeading"),
outputHeading = document.querySelector("#outputHeading"),
inputTxt = document.querySelector("#inputText"),
outputTxt = document.querySelector("#outputText"),

shiftKey = document.querySelector("#shiftKey"),
actionBtn = document.querySelector("#actionBtn");

let currentMode = "encrypt";

function caesarCipher (originalText, shiftKey, mode) {
    if (mode === "decrypt") {
        shiftKey = (26 - (shiftKey % 26)) % 26;
    }

    let result = "";
    for (const char of originalText) {
        const code = char.charCodeAt(0);

        if (code >= 65 && code <= 90) {
            result += String.fromCharCode(((code - 65 + shiftKey) % 26) + 65);
        }
        else if (code >= 97 && code <= 122) {
            result += String.fromCharCode(((code - 97 + shiftKey) % 26) + 97);
        }
        else {
            result += char;
        }
    }
    return result;
}

function executeCaesarCipher() {
    const plainTxt = inputTxt.value;
    const shift = parseInt(shiftKey.value);
    outputTxt.value = caesarCipher(plainTxt, shift, currentMode);
}

function updateUI(animate = false) {
    const isDecrypt = modeToggle.checked;
    const isMobile = window.innerWidth <= 430;

    currentMode = isDecrypt ? "decrypt" : "encrypt";

    const animatedElements = [inputHeading, outputHeading, actionBtn, labelDecrypt, labelEncrypt];

    const applyTextUpdates = () => {
        if (isMobile) {
            labelDecrypt.textContent = isDecrypt ? "Decryption" : "Encryption";
            labelDecrypt.classList.add("active");
            labelDecrypt.classList.remove("text-muted");
        }
        else {
            labelDecrypt.textContent = "Decryption";

            if (isDecrypt) {
                labelEncrypt.classList.remove("active");
                labelEncrypt.classList.add("text-muted");

                labelDecrypt.classList.add("active");
                labelDecrypt.classList.remove("text-muted");
            } 
            else {
                labelEncrypt.classList.add("active");
                labelEncrypt.classList.remove("text-muted");

                labelDecrypt.classList.remove("active");
                labelDecrypt.classList.add("text-muted");
            }
        }

        actionBtn.textContent = isDecrypt ? "Decrypt" : "Encrypt";
        inputHeading.textContent = isDecrypt ? "Encrypted Text" : "Plain Text";
        outputHeading.textContent = isDecrypt ? "Plain Text" : "Encrypted Text";
        inputTxt.placeholder = isDecrypt ? "Type encrypted message here..." : "Type message here...";

    };

    if (animate) {
        // Trigger fade out
        animatedElements.forEach(el => el.classList.add("mode-fade-out"));

        setTimeout(() => {
            applyTextUpdates();
            // Trigger fade in
            animatedElements.forEach(el => el.classList.remove("mode-fade-out"));
        }, 150);
    } 
    else {
        // Instant update without animation (for page load and resize)
        applyTextUpdates();
    }
}

modeToggle.addEventListener("change", () => {
    inputTxt.value = "";
    outputTxt.value = "";

    updateUI(true);
});

actionBtn.addEventListener('click', executeCaesarCipher);
// inputTxt.addEventListener('input', executeCaesarCipher);
// shiftKey.addEventListener('input', executeCaesarCipher);

updateUI(false);

window.addEventListener("resize", () => updateUI(false));
