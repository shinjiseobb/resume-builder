import os
import logging
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai

# 로깅 설정 (요청, 응답, 오류를 백엔드 터미널에 명확히 출력)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# .env 파일에서 환경변수 로드
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# API Key 유효성 검사 및 Gemini 설정
if not GEMINI_API_KEY or GEMINI_API_KEY.strip() == "" or "여기에" in GEMINI_API_KEY:
    logger.warning("경고: .env 파일에 올바른 GEMINI_API_KEY가 설정되지 않았습니다.")
else:
    genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)

@app.route("/")
def index():
    """메인 화면 렌더링"""
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    """Gemini API를 호출하여 이력서 및 포트폴리오 생성"""
    try:
        data = request.get_json()
        if not data:
            logger.warning("[검증 실패] 요청 데이터(JSON)가 비어 있습니다.")
            return jsonify({"success": False, "error": "요청 데이터가 전달되지 않았습니다."}), 400

        name = data.get("name", "").strip()
        job_role = data.get("job_role", "").strip()
        experience = data.get("experience", "").strip()
        projects = data.get("projects", "").strip()
        tone = data.get("tone", "전문적이고 자신감 있는")
        prompt_type = data.get("prompt_type", "prompt_a")

        # 백엔드 입력값 검증 (필수 항목 확인)
        if not name:
            logger.warning("[검증 실패] 이름이 누락되었습니다.")
            return jsonify({"success": False, "error": "이름을 입력해 주세요."}), 400
        if not job_role:
            logger.warning("[검증 실패] 지원 직무가 누락되었습니다.")
            return jsonify({"success": False, "error": "지원 직무를 입력해 주세요."}), 400
        if not experience:
            logger.warning("[검증 실패] 주요 경력 사항이 누락되었습니다.")
            return jsonify({"success": False, "error": "주요 경력 사항을 입력해 주세요."}), 400
        if not projects:
            logger.warning("[검증 실패] 프로젝트 경험이 누락되었습니다.")
            return jsonify({"success": False, "error": "프로젝트 경험을 입력해 주세요."}), 400

        # API Key 재확인
        current_api_key = os.getenv("GEMINI_API_KEY")
        if not current_api_key or current_api_key.strip() == "" or "여기에" in current_api_key:
            logger.error("[API Key 오류] .env 파일에 유효한 GEMINI_API_KEY가 없습니다.")
            return jsonify({
                "success": False,
                "error": ".env 파일에 유효한 GEMINI_API_KEY가 설정되지 않았습니다. API 키를 확인해 주세요."
            }), 500

        logger.info(f"[생성 요청 수신] 지원자: {name}, 직무: {job_role}, 프롬프트 타입: {prompt_type}, 톤: {tone}")

        # 프롬프트 엔지니어링 (Prompt A: 일반 / Prompt B: 전문가)
        if prompt_type == "prompt_b":
            # Prompt B: 전문가 모드 (STAR 기법, 수치화, 시니어 헤드헌터 관점)
            system_instruction = (
                "당신은 글로벌 빅테크 기업의 시니어 테크 리크루터이자 커리어 컨설턴트입니다.\n"
                "제공된 정보를 바탕으로 인사담당자의 시선을 사로잡는 강력한 이력서(Resume)와 포트폴리오(Portfolio) 초안을 작성하세요.\n\n"
                "작성 가이드라인:\n"
                "1. 문체 및 어조: " + tone + " 어조를 유지하며 명확하고 주도적인 표현을 사용하세요.\n"
                "2. 경력 및 프로젝트는 STAR 기법(Situation-Task-Action-Result)을 적용하고, 성과와 기여도를 구체적이고 수치화(예: %, ms, 건수 등)하여 강조하세요.\n"
                "3. 직무 핵심 역량(Tech Stack & Key Skills)을 논리적으로 범주화하여 구성하세요.\n"
                "4. 전체 문서는 마크다운(Markdown) 문법을 적극 활용하여 제목(H1, H2, H3), 불릿 포인트, 굵은 글씨로 가독성 높게 구성하세요."
            )
        else:
            # Prompt A: 일반 모드 (균형 잡히고 깔끔한 표준 서식)
            system_instruction = (
                "당신은 친절하고 꼼꼼한 커리어 멘토입니다.\n"
                "제공된 정보를 바탕으로 깔끔하고 가독성 높은 이력서(Resume)와 포트폴리오(Portfolio) 초안을 작성하세요.\n\n"
                "작성 가이드라인:\n"
                "1. 문체 및 어조: " + tone + " 어조를 자연스럽게 살려 작성하세요.\n"
                "2. 경력 사항과 프로젝트 내용을 일목요연하게 정리하고, 읽기 편한 구조로 정리하세요.\n"
                "3. 마크다운(Markdown) 문법을 활용하여 제목, 본문, 목록을 깔끔하게 구분해 주세요."
            )

        user_content = f"""
[지원자 기본 정보]
- 성명: {name}
- 희망 직무: {job_role}
- 희망 어조/톤: {tone}

[주요 경력 사항]
{experience}

[프로젝트 경험 및 성과]
{projects}

위 정보를 바탕으로 아래 구조를 포함한 완벽한 마크다운 형식의 이력서 & 포트폴리오 초안을 작성해 주세요:
1. 인적사항 및 직무 요약 (Summary)
2. 핵심 역량 (Core Competencies)
3. 경력 기술서 (Work Experience)
4. 프로젝트 상세 (Projects & Achievements)
5. 교육 및 기타 활동 (Education & Others)
"""

        full_prompt = f"{system_instruction}\n\n{user_content}"

        # Gemini 모델 호출 (gemini-3.5-flash-lite 사용)
        model = genai.GenerativeModel("gemini-3.5-flash-lite")
        response = model.generate_content(full_prompt)

        if not response or not response.text:
            logger.error("[응답 오류] Gemini 모델로부터 빈 응답이 반환되었습니다.")
            return jsonify({"success": False, "error": "AI로부터 응답을 생성하지 못했습니다. 다시 시도해 주세요."}), 500

        logger.info(f"[생성 완료] {name} 지원자의 이력서 및 포트폴리오 초안 생성 성공")
        return jsonify({
            "success": True,
            "result": response.text
        })

    except Exception as e:
        error_msg = str(e)
        logger.error(f"[서버 오류 발생] {error_msg}")

        # 사용자 친화적인 에러 메시지로 변환
        user_error = "AI 문서 생성 중 오류가 발생했습니다."
        if "API_KEY_INVALID" in error_msg or "API key not valid" in error_msg:
            user_error = "Gemini API Key가 올바르지 않습니다. .env 파일의 키 값을 다시 확인해 주세요."
        elif "ResourceExhausted" in error_msg or "quota" in error_msg.lower():
            user_error = "Gemini API 무료 사용 한도(Quota)를 초과했습니다. 잠시 후 다시 시도해 주세요."

        return jsonify({"success": False, "error": user_error}), 500

if __name__ == "__main__":
    logger.info("==================================================")
    logger.info("AI Resume & Portfolio Builder 서버를 시작합니다.")
    logger.info("접속 주소: http://127.0.0.1:5000")
    logger.info("==================================================")
    app.run(host="127.0.0.1", port=5000, debug=True)
