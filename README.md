# mypiggybankmobile

A simple personal-finance mobile app + API.

## What you get
**Mobile (Expo + React Native)**
- JWT login/register
- Dashboard (cashflow snapshot)
- Transactions (income/expense) CRUD
- Investments CRUD (ticker, shares, avg cost, notes)
- Mortgage tracker (loan amount, rate, term, extra payment; shows amortization summary)
- Budgets (monthly category limits) CRUD

**Backend (FastAPI)**
- JWT auth (access tokens)
- SQLite persistence (SQLAlchemy)
- REST API for all modules
- CORS enabled for local dev

---

## Run backend (FastAPI)
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt

# (optional) copy env:
# cp .env.example .env

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Swagger: http://localhost:8000/docs

---

## Run mobile (Expo)
```bash
cd mobile
npm install
npm run start
```

### Configure API base URL
Edit `mobile/src/config.ts`:
- Android emulator: `http://10.0.2.2:8000`
- iOS simulator: `http://localhost:8000`
- Physical device: use your LAN IP, e.g. `http://192.168.1.50:8000`

---

## Security note
Tokens are stored in AsyncStorage (fine for demos). For production, use secure storage + refresh tokens.
