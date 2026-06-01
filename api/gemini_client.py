import os
import json
import time
from google import genai
from google.genai import types

class GeminiClient:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("WARNING: GEMINI_API_KEY environment variable not set.")
        self.client = genai.Client(api_key=api_key)
        self.flash_model = 'gemini-2.5-flash'
        
    def analyze_image(self, file_path, mime_type="image/jpeg"):
        """Analyzes a static image/poster for QC."""
        prompt = """
        You are an expert Creative Director and Quality Control Specialist.
        Analyze this design/poster and provide a strict JSON response with the following structure:
        {
          "overallScore": <int 0-100>,
          "summary": "<brief string summarizing quality>",
          "designScore": <int 0-100>,
          "colorScore": <int 0-100>,
          "typographyScore": <int 0-100>,
          "trendScore": <int 0-100>,
          "suggestions": ["<string suggestion 1>", "<string suggestion 2>"],
          "checklistSuggestions": {
             "sectionKey.itemIndex": { "type": "issue" | "pass", "note": "<reason>" }
          }
        }
        Be highly critical of alignment, color contrast, modern trends, and visual hierarchy.
        Return ONLY valid JSON.
        """
        try:
            # For small images, we can pass them inline. For larger, we should use the Files API.
            # Using Files API for consistency and reliability.
            uploaded_file = self.client.files.upload(file=file_path, config={'mime_type': mime_type})
            
            response = self.client.models.generate_content(
                model=self.flash_model,
                contents=[uploaded_file, prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )
            
            # Clean up file
            self.client.files.delete(name=uploaded_file.name)
            
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini Image Analysis Error: {e}")
            return {"error": str(e), "overallScore": 0, "summary": "Analysis failed"}

    def upload_video(self, file_path, mime_type="video/mp4"):
        """Uploads a video to Gemini Files API for processing."""
        try:
            uploaded_file = self.client.files.upload(file=file_path, config={'mime_type': mime_type})
            return uploaded_file.name
        except Exception as e:
            print(f"Video upload failed: {e}")
            return None

    def check_file_status(self, file_name):
        """Checks if a video file has finished processing."""
        try:
            file_info = self.client.files.get(name=file_name)
            return file_info.state.name # 'PROCESSING', 'ACTIVE', 'FAILED'
        except Exception as e:
            print(f"Check status failed: {e}")
            return "FAILED"

    def analyze_video(self, file_name):
        """Analyzes an already processed video file."""
        prompt = """
        You are an expert Video Editor, Audio Engineer, and Quality Control Specialist.
        Analyze this video thoroughly (visuals, audio, text, motion) and provide a strict JSON response:
        {
          "overallScore": <int 0-100>,
          "summary": "<brief string summarizing video quality>",
          "categoryScores": {
            "visual": <int 0-100>,
            "audio": <int 0-100>,
            "content": <int 0-100>,
            "technical": <int 0-100>,
            "trendAlignment": <int 0-100>
          },
          "timestampedIssues": [
            {"timecode": "MM:SS", "severity": "critical"|"warning"|"info", "description": "<issue text>"}
          ],
          "audioQuality": {
            "overallClarity": "Good"|"Fair"|"Poor",
            "backgroundNoise": "Low"|"Medium"|"High",
            "volumeBalance": "Balanced"|"Unbalanced",
            "musicVoiceBalance": "Good"|"Poor",
            "hasClipping": <bool>,
            "hasDistortion": <bool>,
            "audioSyncIssues": <bool>
          },
          "sceneBreakdown": [
            {"startTime": "MM:SS", "endTime": "MM:SS", "description": "<scene desc>", "issues": [{"severity": "warning", "description": "..."}]}
          ],
          "suggestions": ["<suggestion 1>", "<suggestion 2>"]
        }
        Be extremely detail-oriented. Look for compression artifacts, audio clipping, jump cuts, and branding issues.
        Return ONLY valid JSON.
        """
        try:
            # We fetch the file object using the name
            file_obj = self.client.files.get(name=file_name)
            
            response = self.client.models.generate_content(
                model=self.flash_model,
                contents=[file_obj, prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )
            
            # Clean up the file after analysis
            self.client.files.delete(name=file_name)
            
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini Video Analysis Error: {e}")
            return {"error": str(e), "overallScore": 0, "summary": "Video analysis failed"}

    def chat(self, message, history=[]):
        """Handles chat interactions with the QC assistant."""
        try:
            chat_history = []
            for msg in history:
                role = 'user' if msg.get('role') == 'user' else 'model'
                chat_history.append(types.Content(role=role, parts=[types.Part.from_text(text=msg.get('content', ''))]))
                
            system_instruction = """
            You are 'QC Assistant', an AI expert in video editing, graphic design, branding, and social media trends.
            You help users review their content, understand QC checklists, and optimize for current trends.
            Keep your answers concise, practical, and highly relevant to content creators.
            Use emojis occasionally. Formulate responses in markdown.
            """
            
            chat = self.client.chats.create(
                model=self.flash_model,
                history=chat_history,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction
                )
            )
            
            response = chat.send_message(message)
            return {"reply": response.text}
        except Exception as e:
            print(f"Chat Error: {e}")
            return {"reply": "I'm having trouble connecting right now. Please try again later."}

gemini = GeminiClient()
