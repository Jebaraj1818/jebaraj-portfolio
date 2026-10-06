"""
Vercel Serverless Function entrypoint.
Imports and exposes the Flask WSGI application instance from backend.app.
Single source of truth is preserved in backend/app.py (no backend duplication).
"""
import sys
import os

# Ensure repository root is on sys.path so backend module can be imported
_root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _root_dir not in sys.path:
    sys.path.insert(0, _root_dir)

from backend.app import app
