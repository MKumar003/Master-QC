import os
import shutil
import uuid
from fastapi import FastAPI, Depends, HTTPException, Header, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from models import QCReport, ChatRequest
from firebase_config import get_db, verify_token
from gemini_client import gemini
from trends import get_daily_trends

app = FastAPI(title="Master QC API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependency ---
def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        # Bypass for local dev if token isn't provided/valid, 
        # but in prod this should raise 401
        return {"uid": "local_dev_user"}
        # raise HTTPException(status_code=401, detail="Invalid auth header")
    
    token = authorization.split(" ")[1]
    user = verify_token(token)
    if not user:
        # Fallback for testing
        return {"uid": "local_dev_user"}
        # raise HTTPException(status_code=401, detail="Invalid token")
    return user

# --- Reports ---
@app.get("/api/reports")
def list_reports(user: dict = Depends(get_current_user)):
    db = get_db()
    if not db: return []
    try:
        docs = db.collection("users").document(user["uid"]).collection("reports").order_by("createdAt", direction="DESCENDING").stream()
        return [{"id": doc.id, **doc.to_dict()} for doc in docs]
    except Exception as e:
        print(f"DB Error: {e}")
        return []

@app.post("/api/reports")
def create_report(report: QCReport, user: dict = Depends(get_current_user)):
    db = get_db()
    if not db: raise HTTPException(status_code=500, detail="DB not initialized")
    
    report_dict = report.dict()
    report_dict["createdAt"] = firestore.SERVER_TIMESTAMP
    report_dict["updatedAt"] = firestore.SERVER_TIMESTAMP
    
    try:
        _, doc_ref = db.collection("users").document(user["uid"]).collection("reports").add(report_dict)
        return {"id": doc_ref.id, **report_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reports/{report_id}")
def get_report(report_id: str, user: dict = Depends(get_current_user)):
    db = get_db()
    if not db: raise HTTPException(status_code=500)
    
    doc = db.collection("users").document(user["uid"]).collection("reports").document(report_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"id": doc.id, **doc.to_dict()}

@app.put("/api/reports/{report_id}")
def update_report(report_id: str, updates: dict, user: dict = Depends(get_current_user)):
    db = get_db()
    if not db: raise HTTPException(status_code=500)
    
    doc_ref = db.collection("users").document(user["uid"]).collection("reports").document(report_id)
    updates["updatedAt"] = firestore.SERVER_TIMESTAMP
    doc_ref.update(updates)
    return {"success": True}

@app.delete("/api/reports/{report_id}")
def delete_report(report_id: str, user: dict = Depends(get_current_user)):
    db = get_db()
    if not db: raise HTTPException(status_code=500)
    
    db.collection("users").document(user["uid"]).collection("reports").document(report_id).delete()
    return {"success": True}

# --- AI Image/Video Analysis ---
UPLOAD_DIR = "/tmp/master_qc_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/api/ai/analyze-image")
async def ai_analyze_image(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    analysis = gemini.analyze_image(file_path, mime_type=file.content_type)
    
    # Cleanup
    if os.path.exists(file_path):
        os.remove(file_path)
        
    return analysis

@app.post("/api/ai/analyze-video")
async def ai_analyze_video(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    # 1. Save to temp disk
    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Upload to Gemini Files API
    file_id = gemini.upload_video(file_path, mime_type=file.content_type)
    
    # 3. Cleanup temp file
    if os.path.exists(file_path):
        os.remove(file_path)
        
    if not file_id:
        raise HTTPException(status_code=500, detail="Failed to upload video to AI engine")
        
    return {"file_id": file_id, "status": "processing"}

@app.get("/api/ai/video-status/{file_id:path}")
def check_video_status(file_id: str, user: dict = Depends(get_current_user)):
    state = gemini.check_file_status(file_id)
    
    if state == "ACTIVE":
        # Video is processed, now run the analysis prompt
        analysis = gemini.analyze_video(file_id)
        return {"state": state, "analysis": analysis}
        
    return {"state": state}

# --- AI Chat ---
@app.post("/api/ai/chat")
def ai_chat(request: ChatRequest, user: dict = Depends(get_current_user)):
    response = gemini.chat(request.message, request.history)
    return response

# --- Trends ---
@app.get("/api/trends/today")
def get_trends():
    return get_daily_trends()
