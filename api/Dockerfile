FROM python:3.12-slim
WORKDIR /app
COPY api/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY api ./api
ENV PORT=8000
EXPOSE 8000
CMD ["sh", "-c", "python -m api.seed && uvicorn api.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
