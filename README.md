# AutoGram - Telegram Automation SaaS

A professional Telegram automation platform that allows users to safely forward ads to multiple groups using their own Telegram accounts. Built with Next.js and FastAPI.

## 🚀 Features

- **Official Telegram Login**: Secure OTP-based authentication
- **Safe Forwarding**: Smart delays and night mode to prevent bans
- **Multi-Account Management**: Manage multiple Telegram accounts
- **Ad Group Management**: Configure forwarding rules with expiry dates
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Premium glassmorphic design with smooth animations

## 📁 Project Structure

```
Telegram-Website/
├── backend/                 # FastAPI backend server
│   ├── main.py             # Main application file with API endpoints
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables (not in git)
│
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx           # Landing page
│   │       ├── login/             # Login page
│   │       ├── dashboard/         # Dashboard page
│   │       ├── globals.css        # Global styles
│   │       └── layout.tsx         # Root layout
│   ├── public/                    # Static assets
│   ├── package.json               # Node dependencies
│   └── next.config.ts             # Next.js configuration
│
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library

### Backend
- **FastAPI** - Modern Python web framework
- **Telethon** - Telegram client library
- **PyJWT** - JSON Web Token authentication
- **Python-dotenv** - Environment variable management

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nodeadcode/Telegram-Website.git
cd Telegram-Website
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Edit .env file and add:
# - JWT_SECRET: Your secret key for JWT tokens
# - TELEGRAM_BOT_TOKEN: Your Telegram bot token (get from @BotFather)
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# The frontend will connect to backend at http://localhost:8000
```

## 🎯 Running the Application

### Start Backend Server

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: `http://localhost:8000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## 📱 Usage

1. **Landing Page**: Visit `http://localhost:3000` to see the homepage
2. **Login**: Click "Login" and enter your name to access the dashboard
3. **Add Telegram Account**: 
   - Get API credentials from https://my.telegram.org
   - Click "Add Account" in the dashboard
   - Enter API ID, API Hash, and phone number
   - Verify OTP sent to your Telegram
   - If 2FA is enabled, enter your password
4. **Manage Groups**: Add forwarding rules with target group links and expiry dates
5. **Start/Stop Automation**: Toggle accounts to start or stop forwarding

## 🌐 Responsive Design

The entire application is fully responsive and optimized for:
- 📱 **Mobile phones** (320px+)
- 📱 **Tablets** (768px+)
- 💻 **Laptops** (1024px+)
- 🖥️ **Desktops** (1280px+)

## 🔒 Security

- OTP-based Telegram authentication
- No passwords stored on server
- JWT tokens for session management
- Environment variables for sensitive data
- CORS protection
- Sessions stored locally

## 🧪 API Endpoints

### Authentication
- `POST /auth/telegram` - Authenticate with Telegram
- `GET /me` - Get current user info

### Account Management
- `POST /api/send-otp` - Send OTP to phone
- `POST /api/verify-otp` - Verify OTP code
- `POST /api/verify-2fa` - Verify 2FA password
- `POST /api/start-account` - Start account automation
- `POST /api/stop-account` - Stop account automation

## 📦 Building for Production

### Frontend

```bash
cd frontend
npm run build
npm start
```

### Backend

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built by [@nodeadcode](https://github.com/nodeadcode)

## 🐛 Known Issues & Roadmap

- [ ] Add real database support (PostgreSQL/MongoDB)
- [ ] Implement user authentication with email/password
- [ ] Add payment integration for billing
- [ ] Add real-time status updates with WebSockets
- [ ] Add analytics dashboard
- [ ] Deploy to production (Vercel + Railway/Render)

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for the Telegram automation community
