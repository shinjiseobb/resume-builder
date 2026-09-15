# 🚀 AI Resume & Portfolio Builder

> **"기본 정보를 입력하면 Gemini AI가 쉬었음 청년을 탈출하게 해드립니다."**

사용자의 이름, 지원 직무, 주요 경력, 프로젝트 경험 및 희망하는 어조(Tone)를 입력받아 **Google Gemini AI**가 전문적인 이력서(Resume)와 포트폴리오(Portfolio) 초안을 즉시 작성해 주는 풀스택 웹 애플리케이션입니다.

---

## 🌟 주요 핵심 기능

1. **간편한 사용자 입력 폼**
   - 성명, 희망 직무, 경력 사항, 프로젝트 경험, 원하는 어조(Tone) 입력
   - 실시간 프론트엔드 유효성 검사 및 백엔드 데이터 검증

2. **프롬프트 엔지니어링 (2가지 작성 모드)**
   - **Prompt A (일반 모드)**: 읽기 편하고 균형 잡힌 표준 서식의 깔끔한 초안 생성
   - **Prompt B (전문가 모드)**: 시니어 테크 리크루터 관점 적용, **STAR 기법(Situation-Task-Action-Result)** 및 수치화된 성과 극대화

3. **⚡ 3대 대표 직무 원클릭 샘플 데이터**
   - **🎨 서비스 기획 / 마케터**: IT 플랫폼 커머스 기획 및 퍼널 개선 샘플
   - **💻 테크 개발자**: 대용량 트래픽 처리, MSA, FastAPI, Redis 기반 백엔드 엔지니어 샘플
   - **💼 경영지원 / 사무직**: 전사 ERP 도입, 인사총무 및 예산 관리 샘플
   - 버튼 클릭 한 번으로 모든 입력 양식이 즉시 자동 완성됩니다.

4. **🎨 3가지 비주얼 디자인 템플릿**
   - **모던 웜 (Modern Warm)**: 따뜻한 골드/오렌지 포인트 바 & 부드러운 카드 서식 (기획/마케팅 추천)
   - **테크 미니멀 (Tech Minimal)**: 슬레이트 블루 & 기술 역량 강조형 서식 (개발자 추천)
   - **클래식 (Classic Executive)**: 단정한 상단 더블 라인 정통 비즈니스 문서 서식 (경영지원 추천)

5. **실시간 마크다운 렌더링 (`marked.js`)**
   - AI가 작성한 마크다운 기호(`#`, `**`, `-`)를 브라우저에서 읽기 편한 워드 문서 스타일로 즉시 변환

6. **🌙 시스템 연동 자동 다크 모드**
   - 사용자의 OS(Windows/Mac) 설정에 따라 다크 모드와 라이트 모드가 실시간으로 자동 전환 (`prefers-color-scheme`)

7. **📱 모바일 완벽 최적화 (Responsive UX)**
   - 스마트폰 화면 여백 최적화, iOS 사파리 자동 확대 방지(16px 폰트 적용)
   - 모바일 전용 2열 버튼 그리드 및 생성 시 결과 영역으로의 자동 스크롤

8. **결과 활용 기능**
   - **[📋 텍스트 복사]**: 원본 마크다운 규격을 유지하며 클립보드에 원클릭 복사
   - **[💾 .md 다운로드]**: 노션, 깃허브 등에 즉시 첨부 가능한 `.md` 파일 다운로드

9. **보안 및 안정성**
   - Gemini API Key는 Git에 노출되지 않도록 `.env`로 격리 보관
   - 구글 최신 경량 모델 `gemini-3.5-flash-lite` 적용으로 초고속 응답
   - 백엔드 상세 콘솔 로깅 및 사용자 친화적 오류 메시지 제공

---

## 🛠 기술 스택 (Tech Stack)

| 영역 | 사용 기술 |
|---|---|
| **Backend** | Python 3.14+, Flask, google-generativeai, python-dotenv |
| **Frontend** | HTML5, CSS3 (CSS Variables, Flexbox, Grid), JavaScript (ES6+), marked.js |
| **AI Model** | Google Gemini (`gemini-3.5-flash-lite`) |
| **Version Control** | Git |

---

## 📁 프로젝트 구조 (Project Structure)

```text
resume-builder/
├── app.py                  # Flask 백엔드 서버 및 Gemini API 통신 로직
├── requirements.txt        # 파이썬 패키지 의존성 목록
├── .env                    # 실제 API Key 보관 (Git 제외)
├── .env.example            # 환경변수 예시 템플릿
├── .gitignore              # Git 추적 제외 설정 파일
├── README.md               # 프로젝트 설명서
├── templates/
│   └── index.html          # 웹 화면 HTML 템플릿
├── static/
│   ├── css/
│   │   └── style.css       # 반응형, 다크모드, 템플릿 스타일시트
│   └── js/
│       └── app.js          # API 통신, 샘플 프리셋, 마크다운 렌더링 로직
└── sample/
    └── 스크린샷 2026-09-15 155949.png # 템플릿 참조 샘플 이미지
```

---

## 🚀 빠른 시작 가이드 (Getting Started)

### 1. 가상환경 생성 및 활성화
```powershell
# 프로젝트 폴더 이동
cd C:\AI-study\resume-builder

# 가상환경 생성
py -m venv venv

# 가상환경 활성화 (Windows PowerShell)
.\venv\Scripts\Activate.ps1
```

### 2. 필수 패키지 설치
```powershell
py -m pip install -r requirements.txt
```

### 3. 환경변수 설정 (`.env`)
[Google AI Studio](https://aistudio.google.com/app/apikey)에서 Gemini API Key를 발급받은 후, 프로젝트 루트에 `.env` 파일을 생성하고 키를 입력합니다.
```text
GEMINI_API_KEY=AIzaSy...자신의_실제_API_키
```

### 4. 웹 서버 실행
```powershell
py app.py
```

### 5. 브라우저 접속
웹 브라우저를 열고 아래 주소로 접속합니다:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 💡 사용 방법

1. 상단의 **[⚡ 빠른 샘플 데이터 불러오기]** 버튼을 눌러 예시 데이터를 불러오거나, 본인의 정보를 직접 입력합니다.
2. 원하는 **이력서 디자인 템플릿**(오렌지, 블루, 클래식)과 **작성 모드**(일반 / 전문가)를 선택합니다.
3. **[✨ AI 이력서 & 포트폴리오 생성하기]** 버튼을 클릭합니다.
4. 약 5~10초 후 우측에 렌더링된 결과물을 확인하고, **[복사]** 또는 **[.md 다운로드]**하여 취업 및 이직 활동에 활용합니다!

---

## 📄 라이선스 (License)

This project is created for educational purposes.
