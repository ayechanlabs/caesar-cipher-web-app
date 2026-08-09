// Dark Mode to Light Mode
const themeToggleBtn = document.querySelector("#themeToggleBtn");
const themeIcon = document.querySelector("#themeIcon");

const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

function setTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);

    localStorage.setItem("theme", theme);

    if (theme === "dark") {
        themeIcon.className = "fa-solid fa-sun";
    }
    else {
        themeIcon.className = "fa-solid fa-moon";
    }
}

themeToggleBtn.addEventListener("click", () => {
    const currTheme = document.documentElement.getAttribute("data-bs-theme");
    const nextTheme = currTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
})

const 
modeToggle = document.querySelector("#modeToggle"),
labelEncrypt = document.querySelector("#labelEncrypt"),
labelDecrypt = document.querySelector("#labelDecrypt"),

inputHeading = document.querySelector("#inputHeading"),
outputHeading = document.querySelector("#outputHeading"),
inputTxt = document.querySelector("#inputText"),
outputTxt = document.querySelector("#outputText"),

shiftKey = document.querySelector("#shiftKey"),
actionBtn = document.querySelector("#actionBtn"),

clearBtn = document.querySelector("#clearBtn"),
copyBtn = document.querySelector("#copyBtn"), 

bruteForceWrapper = document.querySelector("#bruteForceContainer"), 
bruteForceToggle = document.querySelector("#bruteForceToggle"), 
bruteForceResults = document.querySelector("#bruteForceResults"), 
bruteForceList = document.querySelector("#bruteForceList");

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

const shiftPreview = document.querySelector("#shiftPreview");
function updateShiftPreview() {
    if (!shiftPreview) return;

    let shift = parseInt(shiftKey.value) || 0;

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
        <button class="btn btn-sm btn-outline-primary copy-shift-btn" data-text="${escapeHTML(decryptTxt)}" title="Copy Result">
            <i class="fa-regular fa-copy"></i>
        </button>
        `;

        bruteForceList.appendChild(item);
    }

    bruteForceList.querySelectorAll(".copy-shift-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const textToCopy = e.currentTarget.getAttribute("data-text");
            await navigator.clipboard.writeText(textToCopy);

            const iconTag = e.currentTarget.querySelector("i");
            iconTag.className = "fa-solid fa-check text-success";
            setTimeout(() => {
                iconTag.className = 'fa-regular fa-copy';
            }, 1500);
        });
    });
}

function escapeHTML(str) {
    return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt")
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

clearBtn.addEventListener("click", () => {
    inputTxt.value = "";
    outputTxt.value = "";
    inputTxt.focus();
});

copyBtn.addEventListener("click", async () => {
    if (!outputTxt.value) return;

    try {
        await navigator.clipboard.writeText(outputTxt.value);

        const iconTag = copyBtn.querySelector("i");
        iconTag.className = "fa-solid fa-check text-success";

        setTimeout(() => {
            iconTag.className = "fa-regular fa-copy";
        }, 1500);
    }
    catch (err) {
        console.error("Failed to copy text:", err);
    }
});

modeToggle.addEventListener("change", () => {
    inputTxt.value = "";
    outputTxt.value = "";

    shiftKey.value = 3;

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
})

actionBtn.addEventListener('click', executeCaesarCipher);
inputTxt.addEventListener('input', executeCaesarCipher);
shiftKey.addEventListener('input', () => {
    executeCaesarCipher();
    updateShiftPreview();
});

updateUI(false);

window.addEventListener("resize", () => updateUI(false));

const charCount = document.querySelector("#charCount");

inputTxt.addEventListener("input", () => {
    executeCaesarCipher();
    if (charCount) {
        charCount.textContent = `${inputTxt.value.length} chars`;
    }
    bruteForceDecryption();
});
