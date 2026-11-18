from fastapi import FastAPI

app = FastAPI(title="College App API")

@app.get("/health")
def health_check():
    return {"status": "ok"}
