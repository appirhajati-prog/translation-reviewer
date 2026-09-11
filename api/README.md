# translation-reviewer backend (FastAPI)

## Run locally
```bash
pip install -r api/requirements.txt
python -m api.seed
uvicorn api.main:app --reload --port 8000
```

## Frontend
```bash
# in another terminal
cp .env.example .env.local   # or set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```
- Empty `NEXT_PUBLIC_API_URL` = mock mode (GitHub Pages keeps working).
- Set it = frontend reads/writes reviews via the API.

## Endpoints
- `GET /api/health`
- `GET /api/books`
- `GET /api/books/{id}`
- `GET /api/translations/{id}/reviews`
- `POST /api/translations/{id}/reviews`
- Docs: `http://localhost:8000/docs`
