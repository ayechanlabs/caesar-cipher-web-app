const inputTxt = document.querySelector("#inputText"),
    outputTxt = document.querySelector("#outputText"),
    shiftKey = document.querySelector("#shiftKey"),
    actionBtn = document.querySelector("#actionBtn");

const navEncrypt = document.querySelector("#navEncryption"),
    navDecrypt = document.querySelector("#navDecryption"),
    inputHeading = document.querySelector("#inputHeading"),
    outputHeading = document.querySelector("#outputHeading");

let currentMode = "encrypt";

function caesarCipher (originalText, shiftKey, mode) {
    if (mode === "decrypt") {
        shift = (26 - (shift % 26)) % 26;
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

actionBtn.addEventListener('click', executeCaesarCipher);
// inputTxt.addEventListener('input', executeCaesarCipher);
// shiftKey.addEventListener('input', executeCaesarCipher);
