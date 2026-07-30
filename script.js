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
copyBtn = document.querySelector("#copyBtn");

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
        animatedElements.forEach(el => el.classList.add("mode-fade-out"));

        setTimeout(() => {
            applyTextUpdates();
            animatedElements.forEach(el => el.classList.remove("mode-fade-out"));
        }, 150);
    } 
    else {
        applyTextUpdates();
    }
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
shiftKey.addEventListener('input', executeCaesarCipher);

updateUI(false);

window.addEventListener("resize", () => updateUI(false));
