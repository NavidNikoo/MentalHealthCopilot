# 🌿 Vivamind – Your Wellness Copilot

Vivamind is a modern mental health and wellness web application designed to support emotional well-being through journaling, mood tracking, and AI-powered conversation. Built with empathy, science, and accessibility in mind, Vivamind empowers users to reflect, grow, and stay grounded.

---

## ✨ Key Features

- 🧠 **Mood Journal**: Track daily emotions and view your emotional history.
- 💬 **AI Copilot Chat**: Chat with supportive AI companions (CBT, reflective, coaching styles).
- 📊 **Dashboard**: Visualize trends in moods and reflections.
- 🧍‍♀️ **Custom Avatars**: Choose an AI Copilot that matches your style.
- 🔒 **Privacy First**: Built with Firebase for secure authentication and data storage.
- 💎 **Premium Upgrade**: One-time payment to unlock all AI Copilots and advanced features.

---

## 🛠 Tech Stack

**Frontend**: React + Vite + Chakra UI  
**Backend**: Firebase (Auth, Firestore, Storage, Functions)  
**Payments**: Stripe (One-time premium purchase)  
**AI Integration**: OpenAI API (per Copilot persona)  
**Deployment**: Firebase Hosting  

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/NavidNikoo/MentalHealthCopilot.git
cd MentalHealthCopilot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

Create a `.env` file or update `src/firebase.js` with your config:

```js
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### 4. Start the dev server

```bash
npm run dev
```

---

## 🔐 Privacy & Terms

- [Privacy Policy](https://vivamind.com/privacy)
- [Terms of Service](https://vivamind.com/terms)

Vivamind uses Firebase to securely store and manage user data. We do **not** sell or share personal information. Users may request data deletion at any time via `support@vivamind.com`.

---

## 📦 Deployment

To deploy to Firebase:

```bash
firebase deploy
```

Make sure you have:
- Enabled Firebase Auth, Firestore, and Functions
- Added your Stripe secret keys and webhook config
- Upgraded to the Blaze Plan for Cloud Functions

---

## 🤝 Contributing

This project is not accepting public contributions yet, but feedback and feature ideas are welcome. Please reach out via email if you’d like to connect.

---

## 📫 Contact

**Email**: support@vivamind.com  
**Website**: [https://vivamind.com](https://vivamind.com)

---

> © 2025 Vivamind – All rights reserved.  
> Built with compassion to help you grow, one entry at a time. 🌱
