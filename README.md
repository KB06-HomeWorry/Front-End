## 꼼꼼한 서류 분석과 신뢰성 있는 중개사 정보로 안전한 부동산 거래를 이끄는, **집걱정단**


<img width="1620" height="1080" alt="집걱정단 표지" src="https://github.com/user-attachments/assets/2782ff20-18e8-44eb-9967-0cbfb076d7d8" />

https://github.com/user-attachments/assets/9da407a8-96df-4990-a846-7536358232aa

**📹 [영상 보러가기](https://youtu.be/QGLd_JbfpK8)**

**👉 [서비스 바로가기](http://home-worry-party-alb-341952107.ap-northeast-2.elb.amazonaws.com)**

<br />

## 📌 목차

- [소개](#-소개)
- [기능](#-기능)
- [기술 스택](#-기술-스택)
- [설치 및 실행 방법](#%EF%B8%8F-설치-및-실행-방법)
- [폴더 구조](#-폴더-구조)
- [스크린샷](#-스크린샷)
- [개발자](#-개발자)

<br />

## 📝 소개

**집걱정단은 사용자에게 더 안전하고 신뢰할 수 있는 부동산 거래 경험을 제공하기 위한 통합 분석 플랫폼입니다.**

부동산 거래는 정보 비대칭과 사기 위험으로 인해 사용자 불안이 높은 영역입니다.

기존 플랫폼은 매물 정보 제공에 집중하지만, **거래의 안전성**까지는 보장하지 못합니다.

우리는 거래 과정에서 **AI 분석**과 **중개사무소 신뢰 지수 시스템**을 도입하여,

**안전하고 투명한 부동산 거래 환경**을 만드는 것을 목표로 합니다.

<br />

## ✨ 기능
**1. 계약/서류 안전 점검**

  * **AI 계약서 분석**

    * 입력/전처리: 이미지·PDF 업로드 → PDF 이미지 변환·페이지 분리 → OCR로 문장 단위 추출
    * 학습/분류: AI-Hub 서식 데이터 기반 \~1,200문장 라벨링(정상/사기) → KoBERT 학습(학습률 튜닝) → 정확도 96%
    * 서빙/UI: FastAPI(REST/OpenAPI) 추론 → 위험 페이지 하이라이트 → 모달에 위험 제목·문구·권장 조치(OpenAI 생성) 표시
  * **서류 기반 매물 검증(4단계 UX)**

    * 건축물 이력 확인: 공공데이터포털 건축물대장(불법 여부/지붕/용도/허가일 등)
    * 중개인 신뢰도 검토: 주소 입력 시 내부 DB 매물 매칭 → 보유 중개사 리스트 모달 → 선택 시 자동 채움
    * 매물 리스크 분석: 유사 매물 평균가 대비 ±30% 이상 괴리 경고
    * 등기부등본 확인: 표제부/갑구/을구 확인 체크
    * 도움말: 각 항목 ‘?’ 버튼으로 입력 이유·활용 방식 안내
  * **시세 기반 위험 매물 판별**

    * 입력: 실평수+거래가 → 지역 평균 시세(API) 비교
    * 판정: 시세보다 현저히 낮으면 주의 매물 플래그 및 사유 표기

**2. 중개사무소 기능(세분 명확화)**

  * **(A) 중개사무소 리스트/검색·정렬**

    * 데이터: 공공데이터포털 중개사무소 API(등록번호/연락처 누락 데이터 drop)
    * 검색/정렬: 이름/지역/주소 검색, 신뢰지수순·이름순 정렬
    * 진입: 하단 네비게이션 + 지도 플로팅 버튼 제공
  * **(B) 중개사무소 지도**

    * 지역 단계 선택 → 해당 위치 이동, 상단 텍스트로 단계 반환
    * 줌 level 3 진입, 커스텀 핀 표시, 핀 클릭 시 정보 툴팁/상세 이동
  * **(C) 중개사무소 상세**

    * 표시: 사무소명/대표/등록번호/주소/연락처
    * 액션: 북마크(별), 보유 매물 보기, 후기 작성
  * **(D) 중개사무소 보유 매물**

    * 상단 세그먼트(월세·전세·매매), 가격 정렬(낮→높 / 높→낮)
  * **(E) 중개사무소 후기 시스템**

    * 사용자 타입 분기: 상담만 / 계약 완료
    * 문항: 공통 5개 + 계약 전용 2개
    * 산출: 지표 4종 가중치 + 시간 가중치 → 신뢰지수(0\~100) 정규화
    * 시각화: 상세 페이지에 원형 그래프(총점) + 막대 그래프(지표별)

**3. 지도 기반 탐색(매물·시세)**

  * **(A) 카테고리 지도 진입**

    * 진입 경로: 홈 상단 버튼(아파트/원·투룸/빌라·주택/오피스텔) 또는 하단 탭
    * 상단 필터: 거래유형 다중(전세/월세/단기), 평수 슬라이더(최소 5평), 검색(건물/역/주소)
  * **(B) 줌 레벨 정책 & 데이터 소스**

    * KakaoMap: level ≥ 5 → 동(洞) 평균 시세 오버레이, level < 5 → 개별 시세/매물 마커
    * 소스: 공공 시세 API + 매물 크롤링 / 커스텀 마커·오버레이·클러스터링
  * **(C) 상세 페이지**

    * 매물 상세: 사진/정보/위치/보유 중개사 카드, 주소 복사, 하트 북마크, 중개사 상세로 이동
    * 시세 상세: 이미지+시세 정보, 평면도 제공(있을 시)

**4. 학습/도구(서브 기능)**

  * **체크리스트 자기 점검**

    * 구성: 전·월세 / 매매 분리, 각 4단계
    * UX: 상단 진행도 바, Top5 주의 아이콘
    * 결과/관리: 단계별 위험 요약 화면, 응답 저장·통계화, 문제/템플릿 분리 관리
  * **부동산 용어 해석기**

    * 입력 UX: 3글자 이상 입력 시 활성화
    * 엔진: OpenAI로 전문 용어 쉬운 표현 변환
    * 효과: 계약서·등기부 난해 용어 평문화 → 자가 위험 식별 보조
  * **부동산 지식 퀴즈**

    * 형식: OX + 3지선다
    * 진행: 전체 수/진행도 표시, 완료 문제 재도전
    * 피드백: 정오답 즉시 안내 + 해설 모달
  * **중개 수수료 계산기**

    * 입력: 거래 유형/금액
    * 계산: 법정 상한 요율 범위 자동 계산
    * 효과: 과도 청구 예방, 협상 기준 제시

**5. 개인화/계정**

  * **홈 개인화 추천**

    * 로직: 북마크 매물 특징 평균 → 선호 벡터 → 전체 매물과 코사인 유사도
    * 출력: 상위 6개 3개씩 2페이지로 캐러셀화(이미 찜한 매물 제외)
  * **마이페이지**

    * 계정 관리: 사용자 정보, 비밀번호 변경
    * 북마크: 매물·중개사 목록(검색/필터/정렬 공통 UX)

<br />

## 🛠 기술 스택

<img width="500" src="https://github.com/user-attachments/assets/03d32983-6dfe-42b4-92ae-ef8ea3970505" />

**Frontend**
- `Vue.js 3` – UI 구성 및 상태 관리
- `Vite` – 번들링 및 개발 서버
- `Tailwind CSS` – 유틸리티 기반 CSS 프레임워크
- `Pinia` – 상태 관리 라이브러리
- `Axios` – API 통신 라이브러리

**Document Processing (문서 처리)**
- `Tesseract.js` – 이미지 기반 계약서의 텍스트 OCR 인식
- `pdf.js` – PDF 파일의 페이지 렌더링 및 이미지 변환

**Backend**
- `Spring` – MVC 아키텍처 기반 서버 및 비즈니스 로직 처리

**AI 분석 서버**
- `FastAPI` – AI 모델 연동 서버 구축
- `KoBERT` – 부동산 계약 조항 사기 가능성 분류 모델
- `OpenAI GPT API` – 부동산 용어 해석 및 위험 조항 해설 및 추천 문구 생성

**Infra / DevOps**
- `Docker / Docker Compose` – 로컬 개발 환경 및 컨테이너화
- `AWS EC2` – 프론트/백엔드 서버 배포
- `AWS RDS` – 클라우드 DB 배포

<br />

## ⚙️ 설치 및 실행 방법

```bash
# 프로젝트 클론
git clone https://github.com/KB06-HomeWorry/Front-End.git
git clone https://github.com/KB06-HomeWorry/Back-End.git
cd project-name

# 프론트엔드
cd ./Front-End/HomeWorry
npm install
npm run dev

# 백엔드
# IntelliJ에서 실행하거나 Tomcat 서버로 구동

# FastAPI 모델 서버
cd ./ai
python3 -m uvicorn server:app --reload --port 8000

🔐 .env, application.properties 등 환경변수 파일이 필요합니다.
```

<br />

## 📁 폴더 구조
```
project-root/
├── Front-End/         # Vue.js 기반 프론트엔드
├── Back-End/          # Spring 백엔드
```

<details>
<summary><b>📂 Front-End/ 구조 보기</b></summary>
<img width="153" height="381" src="https://github.com/user-attachments/assets/f5cd5d35-1d62-4b90-a889-137b81da9a7d" />


```
pages
│  NotFoundPage.vue
│
├─agency
│  │  AgencyDetail.vue
│  │  AgencyListPage.vue
│  │  AgencyReviewWrite.vue
│  │  AgencySample.vue
│  │  ListingPage.vue
│  │
│  ├─components
│  │      AgencyCard.vue
│  │      AgencyReviewSummary.vue
│  │      AgencySearchBar.vue
│  │      BarChart.vue
│  │      BtnAgency.vue
│  │      BtnMedGray.vue
│  │      CircularGauge.vue
│  │      HashTag.vue
│  │      ListingCard.vue
│  │      MapFloatingButtonWithModal.vue
│  │      ProgressBar.vue
│  │      ReviewBox.vue
│  │      ReviewChoice.vue
│  │      ReviewQuestion.vue
│  │      ReviewText.vue
│  │      SortSelect.vue
│  │
│  └─composables
│          useAllTrustScore.js
│          useTrustScore.js
│
├─ai
│  │  AIDocumentSubmitPage.vue
│  │  EstateEase.vue
│  │
│  ├─components
│  │      AIAnalysisDetailModal.vue
│  │      AIAnalysisResult.vue
│  │      AIButtonGroup.vue
│  │      AIExplain.vue
│  │      AIFileUploadButton.vue
│  │      AIUploadList.vue
│  │      ContractOcrUploader.vue
│  │      EstateEaseInput.vue
│  │
│  ├─composables
│  │      useFileUpload.js
│  │      useOcrAndAnalyze.js
│  │
│  └─mock
│          analysisMock.js
│
├─analysis
│  │  AnalysisPage.vue
│  │
│  └─components
│  │       IncidentChecklist.vue
│  │       StepAgentTrust.vue
│  │       StepBuildingHistory.vue
│  │       StepCheckRegistryInfo.vue
│  │       StepRiskAnalysis.vue
│  │
│  └─ composables
│          useAnalysisStep.js
│          usePostcode.js
├─auth
│  │  ChangePasswordPage.vue
│  │  LoginPage.vue
│  │  ResetPasswordPage.vue
│  │  ResetPasswordSentPage.vue
│  │  SignupAgreementPage.vue
│  │  SignupFormPage.vue
│  │
│  └─components
│          AuthTitle.vue
│          InputEmail.vue
│
├─checklist
│  │  ChecklistPage.vue
│  │
│  └─components
│  │       ChecklistBtn.vue
│  │       ChecklistNavBar.vue
│  │       ChecklistQuestion.vue
│  │       ChecklistStagePage.vue
│  │       CircleButton.vue
│  │
│  └─components
│          useChecklistStep.js
│ 
├─dangerResult
│  │  DangerResultPage.vue
│  │
│  └─components
│          DangerResultButtons.vue
│          DangerResultCard.vue
│          DangerResultSummery.vue
│
├─home
│  │  Calculator.vue
│  │  HomePage.vue
│  │
│  └─components
│          ApartBtn.vue
│          CalOption.vue
│          HomeBtn80px.vue
│          HomeBtnLg.vue
│          HomeBtnMed.vue
│          HomeBtnSmall.vue
│          OptionBtnSmall.vue
│
├─map
│  │  DetailPage.vue
│  │  FixMapPage.vue
│  │  MapAgencyPage.vue
│  │  MapCompoTest.vue
│  │  MapPage.vue
│  │
│  └─components
│          AreaSlider.vue
│          BottomSheet.vue
│          DetailAgency.vue
│          DetailLocation.vue
│          FilterBar.vue
│          FilterButton.vue
│          FilterOptionList.vue
│          FloatingButtonStack.vue
│          HomeFilter.vue
│          ListingMarkers.vue
│          ListingToggle.vue
│          LocationSearch.vue
│          MarketPrice.vue
│          MarketPriceDetail.vue
│          Slider.vue
│
├─mypage
│  │  AgencyBookmark.vue
│  │  ListingBookmark.vue
│  │  MyPage.vue
│  │  PrivacyNotice.vue
│  │
│  └─components
│          AgencyBookmarkCard.vue
│          CurrentPwModal.vue
│          ListingBookmarkCard.vue
│          MyMenu.vue
│
└─wordquiz
│   │  QuizHomePage.vue
│   │  QuizPage.vue
│   │
│   └─components
│           AnswerModal.vue
│           OXBtn.vue
│           OXQuizBox.vue
│           QuizHeader.vue
│           SelectBtn.vue
│           SelectQuizBox.vue
│
└─router
└─stores
```
</details>

<details>
<summary><b>📂  Back-End/ 구조 보기</b></summary>
  
```
ai
├─kobert.py
├─server.py
│
main/java/org.scoula
├─agent
│  ├─controller
│  │      AgentController.java
│  │
│  ├─domain
│  │      AgentBookmarkVO.java
│  │      AgentDetailVO.java
│  │      AgentReviewVO.java
│  │      OfficeGeographyVO.java
│  │
│  ├─dto
│  │      AgentBookmarkDTO.java
│  │      AgentDetailDTO.java
│  │      AgentReviewDTO.java
│  │      OfficeGeographyDTO.java
│  │      TrustScoreDTO.java
│  │
│  ├─mapper
│  │      AgentMapper.java
│  │
│  ├─model
│  │      Office.java
│  │      OpenApiResponse.java
│  │
│  └─service
│          AgentService.java
│
├─ai
│  ├─controller
│  │      AIController.java
│  │
│  └─service
│          AIServiceImpl.java
│
├─checklist
│  ├─controller
│  │      ChecklistController.java
│  │
│  ├─domain
│  │      ChecklistTemplateVO.java
│  │      ChecklistUserAnswerVO.java
│  │      ChecklistVO.java
│  │
│  ├─dto
│  │      ChecklistDTO.java
│  │      ChecklistResponseDTO.java
│  │      ChecklistTemplateDTO.java
│  │      ChecklistUserAnswerDTO.java
│  │
│  ├─mapper
│  │      ChecklistMapper.java
│  │      ChecklistTemplateMapper.java
│  │      ChecklistUserAnswerMapper.java
│  │
│  └─service
│          ChecklistService.java
│          ChecklistServiceImpl.java
│          ChecklistUserAnswerService.java
│          ChecklistUserAnswerServiceImpl.java
│
├─common
│  └─util
│          UploadFileName.java
│          UploadFiles.java
│
├─config
│  │  CorsConfig.java
│  │  RootConfig.java
│  │  ServletConfig.java
│  │  SpaController.java
│  │  SwaggerConfig.java
│  │  WebConfig.java
│  │
│  └─db
│          RdsConnectionCleaner.java
│
├─dangerResult
│  ├─controller
│  │      DangerResultController.java
│  │
│  ├─domain
│  │      DangerAnswerVO.java
│  │      DangerResultVO.java
│  │
│  ├─dto
│  │      DangerResultDTO.java
│  │
│  ├─mapper
│  │      DangerResultMapper.java
│  │
│  └─service
│          DangerResultService.java
│          DangerResultServiceImpl.java
│
├─documentAnalysis
│  ├─controller
│  │      DocumentAnalysisController.java
│  │
│  ├─domain
│  │      IllegalBuildingCheckVO.java
│  │      MonthlyRentVO.java
│  │
│  ├─dto
│  │      DocumentAgentDTO.java
│  │      DocumentAnalysisDTO.java
│  │      DocumentAnalysisResultDTO.java
│  │      DocumentSthRiskDTO.java
│  │      IllegalBuildingCheckDTO.java
│  │
│  ├─mapper
│  │      DocumentAnalysisMapper.java
│  │
│  └─service
│          DocumentAnalysisService.java
│          DocumentAnalysisServiceImpl.java
│
├─exception
│      ApiExceptionAdvice.java
│      CommonExceptionAdvice.java
│
├─listing
│  ├─controller
│  │      ListingApiController.java
│  │
│  ├─domain
│  │      ListingVO.java
│  │
│  ├─mapper
│  │      ListingMapper.java
│  │
│  └─service
│          ListingService.java
│          ListingServiceImpl.java
│
├─pricetrend
│  ├─controller
│  │      PriceTrendApiController.java
│  │
│  ├─domain
│  │      PriceTrendVO.java
│  │
│  ├─dto
│  │      MaxPriceDTO.java
│  │
│  ├─mapper
│  │      PriceTrendMapper.java
│  │
│  └─service
│          PriceTrendService.java
│          PriceTrendServiceImpl.java
│
├─quiz
│  ├─controller
│  │      QuizController.java
│  │      UserQuizStatusController.java
│  │
│  ├─domain
│  │      QuizVO.java
│  │      UserQuizStatusVO.java
│  │
│  ├─dto
│  │      QuizDTO.java
│  │      SubmitQuizRequest.java
│  │
│  ├─mapper
│  │      QuizMapper.java
│  │      UserQuizStatusMapper.java
│  │
│  └─service
│          QuizService.java
│          UserQuizStatusService.java
│          UserQuizStatusServiceImpl.java
│
├─sectionGeo
│  ├─controller
│  │      SectionGeoController.java
│  │
│  ├─dto
│  │      SectionGeoDTO.java
│  │
│  ├─mapper
│  │      SectionGeoMapper.java
│  │
│  └─service
│          SectionGeoService.java
│
├─security
│  ├─account
│  │  ├─domain
│  │  │      AuthVO.java
│  │  │      CustomUser.java
│  │  │      UserVO.java
│  │  │
│  │  ├─dto
│  │  │      AuthResultDTO.java
│  │  │      LoginDTO.java
│  │  │      UserInfoDTO.java
│  │  │
│  │  └─mapper
│  │          UserDetailsMapper.java
│  │
│  ├─config
│  │      SecurityConfig.java
│  │      SecurityInitializer.java
│  │
│  ├─filter
│  │      AuthenticationErrorFilter.java
│  │      JwtAuthenticationFilter.java
│  │      JwtUsernamePasswordAuthenticationFilter.java
│  │
│  ├─handler
│  │      CustomAccessDeniedHandler.java
│  │      CustomAuthenticationEntryPoint.java
│  │      LoginFailureHandler.java
│  │      LoginSuccessHandler.java
│  │
│  ├─service
│  │      CustomUserDetailsService.java
│  │      
│  └─util
│          JsonResponse.java
│          JwtProcessor.java
│
└─user
    ├─config
    │      MailConfig.java
    │
    ├─controller
    │      MemberController.java
    │
    ├─domain
    │      PasswordResetTokenVO.java
    │      PasswordRewriteVO.java
    │
    ├─dto
    │      ChangePasswordDTO.java
    │      PasswordResetTokenDTO.java
    │      PasswordRewriteDTO.java
    │      UserDTO.java
    │      UserJoinDTO.java
    │      UserUpdateDTO.java
    │      VerifyPasswordDTO.java
    │
    ├─exception
    │      PasswordMissmatchException.java
    │
    ├─mapper
    │      UserMapper.java
    │
    └─service
            PasswordResetService.java
            UserService.java
            UserServiceImpl.java
```
</details>

<br />

## 📸 스크린샷

### 📑 AI 계약서 분석, 서류 분석, 체크리스트

<img width="1512" height="840" src="https://github.com/user-attachments/assets/3ba420b6-0176-4151-b782-95eb1276d613" />

<img width="1022" height="572" src="https://github.com/user-attachments/assets/ab56cc0d-c530-4321-b3f1-d6919d4cd350" />

<img width="1022" height="574" src="https://github.com/user-attachments/assets/f7ced51c-eca0-4f09-b123-ea2398b6b472" />

<img width="1512" height="845" src="https://github.com/user-attachments/assets/9eb7ea62-75a9-4961-b489-f898ba539b92" />
<br />
<br />
<br />

### 🏢🤝 중개사무소
<img width="1500" height="auto" alt="(최최종)집걱정단_발표자료_35" src="https://github.com/user-attachments/assets/66f94b11-2e45-4968-ae96-7495b3fed33d" />

<img width="1500" height="auto" alt="(최최종)집걱정단_발표자료_36" src="https://github.com/user-attachments/assets/92659d48-1cb5-4a3c-86a3-7c9c5acf924a" />

<img width="1500" height="auto" alt="(최최종)집걱정단_발표자료_38" src="https://github.com/user-attachments/assets/31bf03da-d1c1-4717-ae0b-6e3381abf098" />

<img width="1500" height="auto" alt="(최최종)집걱정단_발표자료_41" src="https://github.com/user-attachments/assets/a5810422-4fd2-4a21-a1ad-f994cde607e2" />


<br />
<br />
<br />

### 📍🗺️ 지도
<img width="1500" height="auto" alt="(최최종)집걱정단_발표자료_46" src="https://github.com/user-attachments/assets/c5358dca-7711-4e08-a860-248e255dbd2a" />

<img width="1500" height="auto" alt="(최최종)집걱정단_발표자료_47" src="https://github.com/user-attachments/assets/92f90c39-1094-4b34-bd1c-d865e212ea1a" />
<br />
<br />
<br />




### 🏡 부동산 용어 해석, 부동산 지식 퀴즈, 중개수수료 계산기

<img width="1022" height="575" src="https://github.com/user-attachments/assets/6db81f86-3384-41c3-9d3f-279fd67cf11e" />

<img width="1505" height="841" src="https://github.com/user-attachments/assets/449c3155-17b7-499c-8d23-9dbfdf15cf7a" />

<img width="1024" height="576" src="https://github.com/user-attachments/assets/81cbd433-8cbe-424b-b546-0e8683dc0925" />
<br />
<br />

## 🧑🏻‍💻 개발자
| [김유빈](https://github.com/ubeeni) | [노경현](https://github.com/Kyunghyun1121) |
|:---:|:---:|
| 팀장 / 체크리스트 / 서류, AI 계약서 분석 / 부동산 용어 해석 / 부동산 지식 퀴즈 | 체크리스트 / 서류 분석 / 인프라 및 배포 환경 구성 |

| [이다연](https://github.com/Leeday11) | [황동민](https://github.com/Dongmin-Hwang715) |
|:---:|:---:|
| 디자인 / 중개사무소 / 홈, 로그인, 회원가입, 마이페이지 / 부동산 지식 퀴즈 / 중개수수료 계산기 | 중개사무소 / 로그인, 회원가입, 마이페이지 / 부동산 지식 퀴즈 | 

| [김려린](https://github.com/ryeorin) | [이의민](https://github.com/min4034415) |
|:---:|:---:|
| 지도 / 매물, 시세 상세 페이지 / AI 계약서 분석 / 사용자 기반 매물 추천 | 지도 / 부동산 맵 필터 / 매물, 시세 상세 페이지 |
