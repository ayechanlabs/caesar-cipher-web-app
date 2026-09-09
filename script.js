// Dark Mode to Light Mode
const themeToggleBtn = document.querySelector("#themeToggleBtn");
const themeIcon = document.querySelector("#themeIcon");

const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme, false);

function setTheme(theme, animateIcon = true) {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);

    if (animateIcon) {
        themeIcon.classList.add("icon-spin");

        setTimeout(() => {
            themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
        }, 150);

        setTimeout(() => {
            themeIcon.classList.remove("icon-spin");
        }, 400);
    }
    else {
        themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
}

themeToggleBtn.addEventListener("click", () => {
    const currTheme = document.documentElement.getAttribute("data-bs-theme");
    setTheme(currTheme === "dark" ? "light" : "dark", true);
});

// Declare All Variables
const 
modeToggle = document.querySelector("#modeToggle"),
labelEncrypt = document.querySelector("#labelEncrypt"),
labelDecrypt = document.querySelector("#labelDecrypt"),

inputHeading = document.querySelector("#inputHeading"),
outputHeading = document.querySelector("#outputHeading"),
inputTxt = document.querySelector("#inputText"),
outputTxt = document.querySelector("#outputText"),
inputBadge = document.querySelector("#inputBadge"),
outputBadge = document.querySelector("#outputBadge"),

shiftRange = document.querySelector("#shiftRange"),
shiftValueDisplay = document.querySelector("#shiftValueDisplay"),

charCount = document.querySelector("#charCount"),
wordCount = document.querySelector("#wordCount"),
pasteBtn = document.querySelector("#pasteBtn"),
clearBtn = document.querySelector("#clearBtn"),
copyBtn = document.querySelector("#copyBtn"),

swapBtn = document.querySelector("#swapBtn"),
randomShiftBtn = document.querySelector("#randomShiftBtn"),
autoDetectBtn = document.querySelector("#autoDetectBtn"),

shiftPreview = document.querySelector("#shiftPreview"),

bruteForceWrapper = document.querySelector("#bruteForceContainer"), 
bruteForceToggle = document.querySelector("#bruteForceToggle"), 
bruteForceResults = document.querySelector("#bruteForceResults"), 
bruteForceList = document.querySelector("#bruteForceList");

// Start Caesar Cipher Encryption/Decryption
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
    const shift = parseInt(shiftRange.value);
    outputTxt.value = caesarCipher(plainTxt, shift, currentMode);

    if (currentMode === "decrypt" && bruteForceToggle?.checked) {
        bruteForceDecryption();
    }
}
// End Caesar Cipher Encrytion/Decryption

// Start - this function will show the user, how characters shifted based on the key input.
function updateShiftPreview() {
    if (!shiftPreview) return;

    let shift = parseInt(shiftRange.value) || 0;
    if (currentMode === "decrypt") {
        shift = (26 - (shift % 26)) % 26;
    }

    const samples = ['A', 'B', 'C'];
    const mapping = samples.map(char => {
        const charCode = char.charCodeAt(0);
        const shiftedCode = ((charCode - 65 + shift) % 26) + 65;
        return `${char} -> ${String.fromCharCode(shiftedCode)}`;
    }).join(' | ');

    shiftPreview.textContent = mapping;
}
updateShiftPreview();
// End - this function will show the user, how characters shifted based on the key input

// Start - this function will decode the cipher, when user doesn't know the key with all possible key sets.
function bruteForceDecryption() {
    if (!bruteForceToggle.checked) return;

    const text = inputTxt.value;
    bruteForceList.innerHTML = "";

    if (!text?.trim()) {
        bruteForceList.innerHTML = `<div class="p-3 text-muted">Type a message above to see all shifts...</div>`;
        return;
    }

    for (let shift = 1; shift <= 25; shift++) {
        const decryptTxt = caesarCipher(text, shift, "decrypt");

        const item = document.createElement("div");
        item.className = "list-group-item d-flex align-items-center justify-content-between gap-2";

        item.innerHTML = 
        `
        <div>
            <span class="badge bg-secondary me-2">Shift ${shift}</span>
            <span>${escapeHTML(decryptTxt)}</span>
        </div>
        <div class="d-flex align-items-center gap-2">
            <span class="copy-status-msg badge text-bg-success d-none">Copied!</span>
            <button class="btn btn-sm btn-outline-primary copy-shift-btn" data-text="${escapeHTML(decryptTxt)}" title="Copy Result">
                <i class="fa-regular fa-copy"></i>
            </button>
        </div>
        `;

        bruteForceList.appendChild(item);
    }

    bruteForceList.querySelectorAll(".copy-shift-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {

            const button = e.currentTarget;
            const textToCopy = e.currentTarget.getAttribute("data-text");

            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    const tempInput = document.createElement("textarea");
                    tempInput.value = textToCopy;

                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand("copy");
                    document.body.removeChild(tempInput);
                }

                const iconTag = button.querySelector("i");
                const statusMsg = button.parentElement.querySelector(".copy-status-msg");

                if (iconTag) iconTag.className = "fa-solid fa-check text-success";
                if (statusMsg) statusMsg.classList.remove("d-none");

                setTimeout(() => {
                    if (iconTag) iconTag.className = 'fa-regular fa-copy';
                    if (statusMsg) statusMsg.classList.add("d-none");
                }, 1500);
            } catch (err) {
                console.error("Failed to copy text: ", err);
            }
        });
    });
}

function analyzeFrequency() {
    const text = inputTxt.value.toUpperCase().replace(/[^A-Z]/g, "");
    if (!text.length) return 1;

    const counts = {};
    for (const char of text) {
        counts[char] = (counts[char] || 0) + 1;
    }

    let mostFrequentChar = "E";
    let maxCount = 0;
    for (const char in counts) {
        if (counts[char] > maxCount) {
            maxCount = counts[char];
            mostFrequentChar = char;
        }
    }

    const eCode = "E".charCodeAt(0);
    const maxCode = mostFrequentChar.charCodeAt(0);
    let guessedShift = (maxCode - eCode + 26) % 26;

    return guessedShift === 0 ? 25 : guessedShift;
}

function autoDetectKey() {
    const detectShift = analyzeFrequency();
    shiftRange.value = detectShift
    shiftValueDisplay.textContent = detectShift;
    executeCaesarCipher();
    updateShiftPreview();
}

if (autoDetectBtn) {
    autoDetectBtn.addEventListener("click", autoDetectKey);
}

function generateRandomShift() {
    const randomShift = Math.floor(Math.random() * 25) + 1;
    shiftRange.value = randomShift;
    shiftValueDisplay.textContent = randomShift;
    executeCaesarCipher();
    updateShiftPreview();
}

if (randomShiftBtn) {
    randomShiftBtn.addEventListener("click", generateRandomShift);
}

function swapInputOutput() {
    const temp = inputTxt.value;
    inputTxt.value = outputTxt.value;
    outputTxt.value = temp;

    modeToggle.checked = !modeToggle.checked;
    // modeToggle.dispatchEvent(new Event("change"));
    currentMode = modeToggle.checked ? "decrypt" : "encrypt";

    updateUI(true);
    executeCaesarCipher();
    countWordCharStats();
}

if (swapBtn) {
    swapBtn.addEventListener("click", swapInputOutput);
}

function escapeHTML(str) {
    return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

bruteForceToggle.addEventListener("change", () => {
    if (bruteForceToggle.checked) {
        bruteForceResults.classList.remove("d-none");
        bruteForceDecryption();
    }
    else {
        bruteForceResults.classList.add("d-none");
    }
});
// End - this function will decode the cipher, when user doesn't know the key with all possible key sets.

function countWordCharStats() {
    const text = inputTxt.value;

    if (charCount) {
        charCount.textContent = `${text.length} chars`;
    }

    if (wordCount) {
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        wordCount.textContent = `${words} words`;
    }
}

const pasteToolTip = new bootstrap.Tooltip(pasteBtn);
pasteBtn.addEventListener("click", async () => {
    try {
        const text = await navigator.clipboard.readText();
        if (!text) return;

        inputTxt.value = text;
        executeCaesarCipher();
        countWordCharStats();

        const iconTag = pasteBtn.querySelector("i");
        iconTag.className = "fa-solid fa-check text-success";
        pasteToolTip.show();

        setTimeout(() => {
            iconTag.className = "fa-regular fa-paste";
            pasteToolTip.hide();
        }, 1500);
    }
    catch (err) {
        console.error("Failed to paste text from clipboard:", err);
    }
});

clearBtn.addEventListener("click", () => {
    inputTxt.value = "";
    outputTxt.value = "";

    countWordCharStats();

    inputTxt.focus();
});

const copyToolTip = new bootstrap.Tooltip(copyBtn);
copyBtn.addEventListener("click", async () => {
    if (!outputTxt.value) return;

    try {
        await navigator.clipboard.writeText(outputTxt.value);

        const iconTag = copyBtn.querySelector("i");
        iconTag.className = "fa-solid fa-check text-success";
        copyToolTip.show();

        setTimeout(() => {
            iconTag.className = "fa-regular fa-copy";
            copyToolTip.hide();
        }, 1500);
    }
    catch (err) {
        console.error("Failed to copy text:", err);
    }
});

modeToggle.addEventListener("change", () => {
    inputTxt.value = "";
    outputTxt.value = "";

    shiftRange.value = 3;
    shiftValueDisplay.textContent = shiftRange.value;

    countWordCharStats();

    updateUI(true);
});

labelEncrypt.addEventListener("click", () => {
    if (modeToggle.checked) {
        modeToggle.checked = false;
        modeToggle.dispatchEvent(new Event("change"));
    }
});

labelDecrypt.addEventListener("click", () => {
    if (!modeToggle.checked) {
        modeToggle.checked = true;
        modeToggle.dispatchEvent(new Event("change"));
    }
});

function updateUI(animate = false) {
    const isDecrypt = modeToggle.checked;
    const isMobile = window.innerWidth <= 430;

    currentMode = isDecrypt ? "decrypt" : "encrypt";

    if (bruteForceWrapper) {
        if (isDecrypt) {
            bruteForceWrapper.classList.remove("d-none");
        }
        else {
            bruteForceWrapper.classList.add("d-none");
            bruteForceToggle.checked = false;
            bruteForceResults.classList.add("d-none");
        }
    }

    const animatedElements = [inputHeading, outputHeading, labelDecrypt, labelEncrypt];

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

        inputHeading.querySelector("span").textContent = isDecrypt ? "Encrypted" : "Plain Text";
        outputHeading.querySelector("span").textContent = isDecrypt ? "Plain Text" : "Encrypted";

        if (isDecrypt) {
            inputBadge.textContent = "CIPHERTEXT";
            inputBadge.className = "badge badge-sm rounded-pill text-bg-warning text-white opacity-75";

            outputBadge.textContent = "LIVE DECRYPTION";
            outputBadge.className = "badge badge-sm rounded-pill text-bg-info text-white opacity-75";
        }
        else {
            inputBadge.textContent = "LIVE INPUT";
            inputBadge.className = "badge badge-sm rounded-pill text-bg-success text-white opacity-75";

            outputBadge.textContent = "LIVE ENCRYPTION";
            outputBadge.className = "badge badge-sm rounded-pill text-bg-primary text-white opacity-75";
        }

        inputTxt.placeholder = isDecrypt ? "Type encrypted message here..." : "Type message here...";
    };

    if (animate) {
        animatedElements.forEach(el => el.classList.add("mode-fade-out"));

        setTimeout(() => {
            applyTextUpdates();
            animatedElements.forEach(el => el.classList.remove("mode-fade-out"));
        }, 150);
    } 
    else {
        applyTextUpdates();
    }

    updateShiftPreview();
}

inputTxt.addEventListener("input", () => {
    executeCaesarCipher();
    countWordCharStats();
    bruteForceDecryption();
});

shiftRange.addEventListener('input', () => {
    shiftValueDisplay.textContent = shiftRange.value;
    executeCaesarCipher();
    updateShiftPreview();
});

updateUI(false);

window.addEventListener("resize", () => updateUI(false));
