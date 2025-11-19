# Chat-App 🔥

A **real-time scalable group chat application** enriched with instant messaging, active user tracking, and planned **WebRTC video conferencing**.  
Powered by **Next.js, Socket.IO, Redis (Valkey), and MongoDB**.  
Engineered for speed, reliability, and distributed scalability.

---

## 🚀 Features

### 💬 Real-Time Group Chat
- Join / Leave groups dynamically  
- Insta-delivery using **Socket.IO + Redis Pub/Sub**
- Message history stored in **Redis (30 min TTL)** + MongoDB backup  
- Smooth animated UI using **Framer Motion**

### 👀 Live Presence Indicators
- Shows how many users are **actively connected in real-time**
- Accurate count based on socket rooms per group

### 💾 Smart Messaging Cache
- Recent messages cached in Redis for fast load  
- Auto sync with MongoDB after cache expiration

### 🎥 Video Call 
- Group video chat planned using **WebRTC**
- Socket.IO signaling for peer connections
- Optimized architecture for **small groups + scalable SFU**

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js, React | UI, Routing |
| Backend | Node.js, Socket.IO | Real-time communication |
| Database | MongoDB | Persistent message storage |
| Cache / Broker | Redis (Valkey) | Pub/Sub + temporary storage |
| Styling | Tailwind CSS | High-quality UI |
| Animation | Framer Motion | Message transitions |
| Video Plan | WebRTC, STUN/TURN, SFU | Real-time media streaming |

---

## 🎥 🛠 Video Call Architecture

We are building **group video calling** with a two-phase strategy:

### ✔ Phase 1 — P2P Group Calling (WebRTC Mesh)->READY
- Ideal for groups up to 6 members
- Browser directly sends audio/video stream to each peer

**Tech**
- STUN/TURN (ICE Servers)
- Socket.IO for WebRTC signaling

**Workflow**

Client ↔ Socket.IO ↔ Signaling Server
Peer A ↔ WebRTC ↔ Peer B ↔ Peer C ...


### 🚀 Phase 2 — SFU Based Architecture (Scalable)->COMMING SOON
Large groups (>10 users) will use an **SFU (Selective Forwarding Unit)** such as:
- mediasoup
- Janus
- LiveKit

**Benefits**
- Server forwards streams; clients send only **one upload**
- Reduces bandwidth by ~80%


---

## 🔧 Getting Started

### 1️⃣ Clone Repo

### 2️⃣ Install Dependencies
npm install
# or
yarn install

3️⃣ Setup Environment
Create .env.local
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
MONGODB_URI=
NEXT_PUBLIC_SOCKET_SERVER=http://localhost:8000

4️⃣ Run App
npm run dev



🤝 Contributing

1.Fork repo
2.Create branch: feature/new-feature
3.Submit PR 🙌


👨‍💻 Author

Gyanvendra Singh

🌐 GitHub: gyanvendra2005
📧 Email: gyanvendras2004@gmail.com

