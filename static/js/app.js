// DOM이 모두 로드된 후 스크립트 실행
document.addEventListener("DOMContentLoaded", () => {
    // 주요 DOM 요소 캐싱
    const form = document.getElementById("resume-form");
    const nameInput = document.getElementById("name");
    const jobRoleInput = document.getElementById("job_role");
    const experienceInput = document.getElementById("experience");
    const projectsInput = document.getElementById("projects");
    const toneSelect = document.getElementById("tone");
    const generateBtn = document.getElementById("generate-btn");
    
    // 알림 및 결과 영역 요소
    const errorBox = document.getElementById("error-box");
    const placeholderBox = document.getElementById("placeholder-box");
    const loadingSpinner = document.getElementById("loading-spinner");
    const resultBox = document.getElementById("result-box");
    const resultContent = document.getElementById("result-content");
    const copyBtn = document.getElementById("copy-btn");
    const downloadBtn = document.getElementById("download-btn");

    // 생성된 원본 마크다운 데이터 보관 변수
    let currentMarkdown = "";

    /**
     * 에러 메시지 표시 함수
     * @param {string} message 
     */
    function showError(message) {
        errorBox.textContent = message;
        errorBox.classList.remove("hidden");
    }

    /**
     * 에러 메시지 숨김 함수
     */
    function hideError() {
        errorBox.textContent = "";
        errorBox.classList.add("hidden");
    }

    // 직무별 원클릭 샘플 데이터 정의
    const samplePresets = {
        pm_designer: {
            name: "홍길동",
            job_role: "서비스 기획 및 프로덕트 매니저(PM)",
            experience: "IT 플랫폼 스타트업 서비스기획팀 3년 근무\n- 신규 이커머스 앱 런칭 및 스프린트 일정 관리\n- 사용자 인터뷰 및 데이터 기반 퍼널 분석을 통해 구매 전환율 28% 개선",
            projects: "AI 기반 맞춤형 상품 추천 서비스 기획\n- 와이어프레임 설계 및 개발/디자인 팀간 협업 리드\n- 출시 6개월 만에 월간 활성 사용자(MAU) 35만 명 달성",
            tone: "전문적이고 신뢰감을 주는",
            prompt_type: "prompt_b",
            template: "template-warm"
        },
        developer: {
            name: "김태호",
            job_role: "백엔드 개발자 (Backend Engineer)",
            experience: "핀테크 기업 서버 개발팀 2년 근무\n- 대용량 결제 트랜잭션 처리 및 분산 REST API 시스템 구축\n- Redis 캐싱 및 DB 인덱스 튜닝으로 API 응답 속도 45% 단축",
            projects: "실시간 주문 및 재고 동기화 마이크로서비스(MSA) 구축\n- Python, FastAPI, Docker, PostgreSQL 활용\n- 동시 접속자 15,000명 대상 부하 테스트 통과",
            tone: "논리적이고 분석적인",
            prompt_type: "prompt_b",
            template: "template-tech"
        },
        business: {
            name: "이지은",
            job_role: "경영지원 및 인사총무 매니저",
            experience: "중견 유통기업 경영지원팀 3년 근무\n- 신규 입사자 온보딩 프로그램 기획 및 사내 규정 정비\n- 연간 운영 예산 관리 및 비용 절감 방안 도출 (비용 12% 절감)",
            projects: "전사 전자결재 및 근태 관리 SaaS ERP 시스템 도입 프로젝트\n- 결재 소요 시간 50% 단축 및 페이퍼리스(Paperless) 업무 환경 완성",
            tone: "진솔하고 담백한",
            prompt_type: "prompt_a",
            template: "template-classic"
        }
    };

    // 샘플 프리셋 버튼 클릭 이벤트 연결
    document.querySelectorAll(".preset-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const presetKey = btn.getAttribute("data-preset");
            const data = samplePresets[presetKey];
            if (!data) return;

            nameInput.value = data.name;
            jobRoleInput.value = data.job_role;
            experienceInput.value = data.experience;
            projectsInput.value = data.projects;
            toneSelect.value = data.tone;

            const promptRadio = document.querySelector(`input[name="prompt_type"][value="${data.prompt_type}"]`);
            if (promptRadio) promptRadio.checked = true;

            const templateRadio = document.querySelector(`input[name="design_template"][value="${data.template}"]`);
            if (templateRadio) templateRadio.checked = true;

            hideError();
        });
    });

    /**
     * 폼 제출(Submit) 이벤트 처리
     */
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideError();

        // 1. 프론트엔드 입력값 검증 (Validation)
        const name = nameInput.value.trim();
        const jobRole = jobRoleInput.value.trim();
        const experience = experienceInput.value.trim();
        const projects = projectsInput.value.trim();
        const tone = toneSelect.value;
        const promptTypeRadio = document.querySelector('input[name="prompt_type"]:checked');
        const promptType = promptTypeRadio ? promptTypeRadio.value : "prompt_a";

        if (!name) {
            showError("성명을 입력해 주세요.");
            nameInput.focus();
            return;
        }

        if (!jobRole) {
            showError("지원 직무를 입력해 주세요.");
            jobRoleInput.focus();
            return;
        }

        if (!experience) {
            showError("주요 경력 사항을 입력해 주세요.");
            experienceInput.focus();
            return;
        }

        if (!projects) {
            showError("프로젝트 경험 및 성과를 입력해 주세요.");
            projectsInput.focus();
            return;
        }

        // 2. UI 상태 변경 (로딩 시작)
        placeholderBox.classList.add("hidden");
        resultBox.classList.add("hidden");
        loadingSpinner.classList.remove("hidden");
        generateBtn.disabled = true;
        generateBtn.textContent = "⏳ Gemini AI가 작성 중입니다...";

        // 모바일 화면에서는 로딩 영역으로 자동 스크롤
        if (window.innerWidth <= 900) {
            loadingSpinner.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        try {
            // 3. Flask Backend /generate API 호출
            const response = await fetch("/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    job_role: jobRole,
                    experience: experience,
                    projects: projects,
                    tone: tone,
                    prompt_type: promptType
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                // 백엔드에서 전달된 오류 메시지 표시
                const errorMessage = data.error || "이력서 생성 중 서버 오류가 발생했습니다. 다시 시도해 주세요.";
                showError(errorMessage);
                placeholderBox.classList.remove("hidden");
                return;
            }

            // 4. 결과 출력 (마크다운 HTML 렌더링 및 템플릿 테마 적용)
            currentMarkdown = data.result;
            const selectedTemplateRadio = document.querySelector('input[name="design_template"]:checked');
            const selectedTemplate = selectedTemplateRadio ? selectedTemplateRadio.value : "template-warm";

            // 기존 클래스 유지하며 선택한 템플릿 클래스 부여
            resultContent.className = "result-content markdown-body " + selectedTemplate;

            if (window.marked && typeof window.marked.parse === "function") {
                resultContent.innerHTML = window.marked.parse(data.result);
            } else {
                resultContent.textContent = data.result;
            }
            resultBox.classList.remove("hidden");

            // 모바일 화면에서는 결과창으로 자동 스크롤
            if (window.innerWidth <= 900) {
                resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
            }

        } catch (err) {
            console.error("Fetch Error:", err);
            showError("네트워크 통신 오류가 발생했습니다. 서버가 실행 중인지 확인해 주세요.");
            placeholderBox.classList.remove("hidden");
        } finally {
            // 5. UI 상태 복구 (로딩 종료)
            loadingSpinner.classList.add("hidden");
            generateBtn.disabled = false;
            generateBtn.textContent = "✨ AI 이력서 & 포트폴리오 생성하기";
        }
    });

    /**
     * 결과 텍스트 클립보드 복사 기능
     */
    copyBtn.addEventListener("click", async () => {
        const textToCopy = currentMarkdown || resultContent.innerText;
        if (!textToCopy) return;

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                // 클립보드 API 미지원 환경 대비 폴백
                const textarea = document.createElement("textarea");
                textarea.value = textToCopy;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }

            // 복사 성공 피드백 표시
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "✅ 복사 완료!";
            copyBtn.style.backgroundColor = "#c6f6d5";
            copyBtn.style.color = "#22543d";

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = "";
                copyBtn.style.color = "";
            }, 2000);

        } catch (err) {
            console.error("Copy Error:", err);
            alert("클립보드 복사에 실패했습니다. 마우스로 직접 드래그하여 복사해 주세요.");
        }
    });

    /**
     * 마크다운(.md) 파일 다운로드 기능
     */
    downloadBtn.addEventListener("click", () => {
        const textToDownload = currentMarkdown || resultContent.innerText;
        if (!textToDownload) return;

        const applicantName = nameInput.value.trim() || "이력서";
        const sanitizedName = applicantName.replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
        const filename = `${sanitizedName}_이력서_포트폴리오.md`;

        const blob = new Blob([textToDownload], { type: "text/markdown;charset=utf-8" });
        const downloadUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(downloadUrl);
    });
});
