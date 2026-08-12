# 🗳️ Voto25 – Sistemi i Menaxhimit të Votave

**Sistem modern online për votim elektronik**

Voto25 is a full-stack web application for secure and transparent online voting.  
It allows administrators to manage parties, candidates and voters, while voters can cast their vote in a simple and protected way. The system provides real-time results by city and overall.

---

## ✨ Features

### For Administrators
- Secure admin login (JWT + password hashing)
- Register political **parties**
- Register **candidates** (linked to parties and cities)
- Register **voters**
- View all registered voters and candidates
- View real-time **election results** (by candidate and by party)
- Results filtered by city

### For Voters
- Login with Voter ID
- View candidates available in their city
- Cast a single vote (one vote per voter)
- See voting status after submitting

### General
- Modern dark-themed and **responsive** UI (desktop, tablet, mobile)
- Input validation on both frontend and backend
- Protection against double voting
- Real-time vote counting

---

## 🛠 Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Frontend       | HTML5, CSS3, Vanilla JavaScript         |
| Backend        | Node.js + Express.js                    |
| Database       | MongoDB + Mongoose                      |
| Authentication | JWT (JSON Web Tokens)                   |
| Security       | bcryptjs (password hashing)             |
| Validation     | express-validator                       |
| Other          | cors, dotenv                            |

---

## 📁 Project Structure

```
Sistem-i-Menaxhimit-te-Votave-Voto25-main/
├── index.html
├── README.md
└── backend/
    ├── config/
    │   └── database.js
    ├── controllers/
    │   ├── adminController.js
    │   ├── candidateController.js
    │   ├── electionController.js
    │   ├── partyController.js
    │   └── voterController.js
    ├── middleware/
    │   ├── auth.js
    │   └── validation.js
    ├── models/
    │   ├── Admin.js
    │   ├── Candidate.js
    │   ├── ElectionResult.js
    │   ├── Party.js
    │   └── Voter.js
    ├── routes/
    │   ├── admin.js
    │   ├── candidates.js
    │   ├── election.js
    │   ├── parties.js
    │   └── voters.js
    ├── server.js
    ├── package.json
    └── .env
```

## ⚙️ Prerequisites

- **Node.js** ≥ 16.x
- **MongoDB** (local or MongoDB Atlas)
- Modern web browser

---

## 🚀 Installation & Setup

### 1. Clone the repository

git clone <repository-url>
cd Sistem-i-Menaxhimit-te-Votave-Voto25-main

### 2. Install backend dependencies

cd backend
npm install

### 3. Configure environment variables
The project already includes a .env file. You can edit it if needed:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/voto25

For MongoDB Atlas, replace the URI with your connection string.

### 4. Start the backend server

# Production
npm start

# Development (with auto-reload)
npm run dev

Server will run at:
http://localhost:5000

###  📡 Main API Endpoints

Method,Endpoint,Description,Auth required
POST,/api/admin/login,Admin login,No
POST,/api/parties/register,Register a new party,Yes
GET,/api/parties / /api/parties/all,List all parties,No
POST,/api/candidates/register,Register a candidate,Yes
GET,/api/candidates,List all candidates,No
GET,/api/candidates/city/:city,Candidates by city,No
POST,/api/voters/register,Register a voter,Yes
POST,/api/voters/login,Voter login (by Voter ID),No
GET,/api/voters,List all voters,Yes
POST,/api/voters/vote,Cast a vote,No*
GET,/api/results,Election results,Yes
GET,/api/results/parties,Results by party,Yes
GET,/api/health,Health check,No

Vote endpoint validates the voter and prevents double voting.

###  📊 Data Models
Party
name, symbol, leader, foundingYear, ideology, voteCount
Candidate
name, party, city, age (≥ 25), dateOfBirth, qualifications, manifesto, voteCount
Voter
firstName, lastName, age (≥ 18), dateOfBirth, email, voterId (unique), city, address, hasVoted, votedCandidateId, votedPartyId, voteDate
Admin
username, password (hashed), name, email, role
Supported cities
Tirana, Durrës, Vlorë, Shkodër, Elbasan, Korçë, Fier, Berat, Lushnjë, Kavajë

###  👥 How to Use
Administrator

Choose “Administrator”
Enter the admin code / login credentials
Register parties → candidates → voters
Monitor real-time results

###  Voter

Choose “Votues”
Enter your Voter ID
Select a candidate from your city
Submit your vote (only once)


### 🔒 Security Features

Passwords hashed with bcrypt
Protected routes with JWT
Input validation with express-validator
One vote per voter (hasVoted flag)
CORS enabled


### 📱 Compatibility

Desktop
Tablet
Mobile (responsive design)


### 📄 License
This project is intended for educational and demonstration purposes.
Feel free to use and modify it.

👨‍💻 Developer
Kristi Spahi

