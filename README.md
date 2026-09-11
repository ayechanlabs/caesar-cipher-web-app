# 🔐 Caesar Cipher Web Application

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)

An interactive, responsive web application for real-time Caesar Cipher encryption, decryption, and key testing. Designed with modern UI/UX practices, dark mode support, and live character statistics.

---

## 🚀 Live Demo

[View Live App](https://ayechanlabs.github.io/caesar-cipher-web-app/)

---

## ✨ Features

- 🔄 **Live Real-Time Processing:** Encrypt and decrypt text instantly as you type.
- 🌓 **Theme Support:** Dark and Light mode toggle with smooth visual transitions.
- 🔀 **Mode Swapping:** Easily swap input/output text and toggle between encryption and decryption.
- 🔑 **Interactive Key Control:** Adjust shift keys (1-25) via range slider or generate a random shift value.
- 💥 **Brute Force Solver:** Display all 25 possible decrypted variations simultaneously in decryption mode.
- 📋 **One-Click Utilities:** Quick copy, paste, clear, character count, and word count.
- 📱 **Fully Responsive:** Styled using Bootstrap 5 for seamless desktop and mobile use.

---

## 💻 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **UI Framework:** Bootstrap 5.3
- **Typography & Icons:** FontAwesome 6, Google Fonts (Inter & Fira Code)
- **Background Effects:** Particles.js

---

## 🧮 How It Works

The Caesar Cipher is a classic substitution cipher where each letter in the plaintext is shifted by a fixed number of positions down the alphabet:

- **Encryption Formula:**  
  $$E_n(x) = (x + n) \pmod{26}$$
- **Decryption Formula:**  
  $$D_n(x) = (x - n) \pmod{26}$$

*Where $x$ is the character index (0–25) and $n$ is the shift key.*


## 🛠️ Getting Started

### Prerequisites
No node modules or build tools are required—just a web browser!

### Local Setup

**Clone the repository:**
   ```bash
   git clone https://github.com/ayechanlabs/caesar-cipher-web-app.git

   cd caesar-cipher-web-app
   ```
---

### Code / Project Structure

Adding a clean directory map shows strong organizational skills:

```markdown
📂 Project Structure

caesar-cipher-web-app/
├── img/
│   └── devops.png
├── index.html
├── script.js
├── style.css
├── particles.json
├── LICENSE
└── README.md
```
