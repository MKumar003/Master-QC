import os
import json
import time
from google import genai
from google.genai import types

class GeminiClient:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        self.is_mock = not api_key or api_key == "your_gemini_api_key_here"
        if self.is_mock:
            print("WARNING: Using MOCK Gemini Client (Dummy key detected).")
            self.client = None
        else:
            self.client = genai.Client(api_key=api_key)
        self.flash_model = 'gemini-2.5-flash'
        
    def analyze_image(self, file_path, mime_type="image/jpeg"):
        """Analyzes a static image/poster for QC."""
        if self.is_mock:
            time.sleep(2)
            return {
                "overallScore": 85,
                "summary": "This design looks great! The typography is clear and contrast is solid, but it could use more vibrant colors.",
                "designScore": 90,
                "colorScore": 75,
                "typographyScore": 95,
                "trendScore": 80,
                "suggestions": ["Increase contrast on the main title", "Use a more vibrant secondary color"],
                "checklistSuggestions": {
                    "visual.0": { "type": "pass", "note": "High quality image used" },
                    "branding.0": { "type": "issue", "note": "Logo could be larger" }
                }
            }

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
            uploaded_file = self.client.files.upload(file=file_path, config={'mime_type': mime_type})
            
            response = self.client.models.generate_content(
                model=self.flash_model,
                contents=[uploaded_file, prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )
            
            self.client.files.delete(name=uploaded_file.name)
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini Image Analysis Error: {e}")
            return {"error": str(e), "overallScore": 0, "summary": "Analysis failed"}

    def upload_video(self, file_path, mime_type="video/mp4"):
        """Uploads a video to Gemini Files API for processing."""
        if self.is_mock:
            time.sleep(1)
            return "mock_video_file_id_123"

        try:
            uploaded_file = self.client.files.upload(file=file_path, config={'mime_type': mime_type})
            return uploaded_file.name
        except Exception as e:
            print(f"Video upload failed: {e}")
            return None

    def check_file_status(self, file_name):
        """Checks if a video file has finished processing."""
        if self.is_mock:
            return "ACTIVE"

        try:
            file_info = self.client.files.get(name=file_name)
            return file_info.state.name
        except Exception as e:
            print(f"Check status failed: {e}")
            return "FAILED"

    def analyze_video(self, file_name):
        """Analyzes an already processed video file."""
        if self.is_mock:
            time.sleep(3)
            return {
                "overallScore": 78,
                "summary": "Good overall pacing, but there are some audio clipping issues at the beginning.",
                "categoryScores": { "visual": 85, "audio": 60, "content": 90, "technical": 75, "trendAlignment": 80 },
                "timestampedIssues": [
                    {"timecode": "00:05", "severity": "warning", "description": "Audio clipping detected"},
                    {"timecode": "00:15", "severity": "info", "description": "Consider adding a transition here"}
                ],
                "audioQuality": {
                    "overallClarity": "Fair", "backgroundNoise": "Medium", "volumeBalance": "Unbalanced",
                    "musicVoiceBalance": "Poor", "hasClipping": True, "hasDistortion": False, "audioSyncIssues": False
                },
                "sceneBreakdown": [
                    {"startTime": "00:00", "endTime": "00:10", "description": "Intro sequence", "issues": [{"severity": "warning", "description": "Audio peak"}]},
                    {"startTime": "00:10", "endTime": "00:30", "description": "Main content", "issues": []}
                ],
                "suggestions": ["Normalize audio levels", "Add B-roll to the second half"]
            }

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
            file_obj = self.client.files.get(name=file_name)
            
            response = self.client.models.generate_content(
                model=self.flash_model,
                contents=[file_obj, prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )
            
            self.client.files.delete(name=file_name)
            return json.loads(response.text)
        except Exception as e:
            print(f"Gemini Video Analysis Error: {e}")
            return {"error": str(e), "overallScore": 0, "summary": "Video analysis failed"}

    def chat(self, message, history=[]):
        """Handles chat interactions with the QC assistant."""
        if self.is_mock:
            time.sleep(1)
            responses = {
                "What colors are trending now?": "Right now, neon cyber-punk colors (cyan, magenta, electric yellow) are trending heavily in tech, while muted earth tones are dominating lifestyle branding! 🎨✨",
                "Best aspect ratio for Reels?": "For Instagram Reels and TikTok, you definitely want to use 9:16 (1080x1920 pixels). Make sure to keep text away from the bottom 20% of the screen! 📱",
            }
            return {"reply": responses.get(message, "That's a great question! For high-quality QC, always ensure your audio is balanced, your contrast ratio is accessible, and your branding is clear. 🎬✨")}

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
