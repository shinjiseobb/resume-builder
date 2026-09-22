import os
import sys

# 프로젝트 루트 경로를 sys.path에 추가하여 app.py 임포트 가능하도록 설정
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app import app
