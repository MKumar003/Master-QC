import os
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class QCReport(BaseModel):
    title: str
    type: str # 'video' or 'photo'
    checklist: Dict[str, Any]
    aiAnalysis: Optional[Dict[str, Any]] = None
    score: int = 0
    status: str = 'in_progress'

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []

class VideoAudioAnalysisRequest(BaseModel):
    file_id: str

class VideoSceneAnalysisRequest(BaseModel):
    file_id: str
