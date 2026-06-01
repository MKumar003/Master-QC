import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, auth

def init_firebase():
    if not firebase_admin._apps:
        # Load from env var (Vercel) or local file
        service_account_env = os.environ.get("FIREBASE_SERVICE_ACCOUNT_KEY")
        
        if service_account_env:
            try:
                cred_dict = json.loads(service_account_env)
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
            except Exception as e:
                print(f"Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY: {e}")
        else:
            # Fallback for local development
            try:
                # Assumes the service account file is at the root of the project
                cred = credentials.Certificate("serviceAccountKey.json")
                firebase_admin.initialize_app(cred)
            except Exception as e:
                print(f"Firebase local init failed: {e}")
                print("Make sure serviceAccountKey.json exists for local dev.")

def get_db():
    init_firebase()
    try:
        return firestore.client()
    except Exception:
        return None

def verify_token(token: str):
    init_firebase()
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None
