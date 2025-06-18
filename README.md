# ♟️ Chess Wiki – Player Profile Viewer

A clean, responsive React + TypeScript app that fetches and displays Chess.com grandmaster profiles, including live "time since last online" tracking.

🎯 **Demo features**:

- Paginated list of grandmaster usernames (client-only, uses Chess.com API)
- Clickable cards to view player details with responsive layout
- Live timer showing how long since last online in `HH:MM:SS`
- Back button preserving pagination state via `?page=` query
- Full responsive support (cards wrap, mobile‑friendly)

---

## 🚀 Quick Start

```bash
# Clone repo
git clone https://github.com/kliffordme/chess-wiki.git
cd chess-wiki

# Install dependencies
npm install

# Set environment variables
echo "VITE_CHESS_API_BASE=https://api.chess.com/pub" > .env

# Run in development mode
npm run dev
```
