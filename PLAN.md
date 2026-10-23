# 2026 부산대학교 직무연수 안내 사이트 - 작업 기획서

## 목표
구글 시트(직무연수 카탈로그, 32과정 x 17컬럼)를 데이터베이스로 사용하는 메인(index.html) + 상세(detail.html) 2페이지 사이트.
시트를 수정하고 새로고침하면 사이트에 반영된다. 디자인은 SEED Design(@seed-design/react, seed-design 스킬) 기준.

## 폴더 구조
```
week08/
├── index.html / detail.html     # Vite 멀티 페이지 진입점
├── public/data_backup.csv       # 시트 접근 실패 시 대체 데이터 (xlsx 변환본)
├── data/*.xlsx                  # 강의 첨부 원본
├── src/
│   ├── config.ts                # SHEET_ID / SHEET_TAB (?sheet=, ?tab= 로 임시 덮어쓰기 가능)
│   ├── lib/sheet.ts             # gviz CSV fetch + PapaParse + 백업 폴백
│   ├── lib/useCourses.ts        # 로딩 상태 훅
│   ├── components/              # Shell(헤더/푸터/안내), CourseBadges
│   ├── pages/MainPage.tsx       # 메인
│   ├── pages/DetailPage.tsx     # 상세 (?code=과정코드)
│   └── seed-design/ui/          # SEED 스니펫 (CLI로 설치)
└── vite.config.ts               # base "./", 2개 HTML 빌드
```

## 기능 분해
| 영역 | 기능 |
|---|---|
| 데이터 | 페이지 로드 시 `https://docs.google.com/spreadsheets/d/{시트ID}/gviz/tq?tqx=out:csv&sheet=data` 호출(캐시 방지), PapaParse로 파싱, 필수 컬럼 검증, 실패 시 data_backup.csv + 안내 배너 |
| 메인 | 요약 통계 3종(전체/필수/온라인), 검색창 + [검색]·[지우기] 버튼(Enter 지원, 담당부서 등 전 필드 검색), 분야/이수구분/교육방식/대상 칩 필터(조합 가능), 카드 그리드, 결과 수, 조건 초기화, 결과 없음 안내 |
| 상세 | `detail.html?code=PNU-2026-001`, 브레드크럼, 배지, 연수 소개, 학습 목표(체크 리스트), 주요 교육 내용(번호 카드), 우측 고정 교육정보 + 수강 신청 링크, 링크 복사, 인쇄, 코드 없음/오류 안내 |
| 배포 | `npm run build` 결과(dist/)를 GitHub Pages로 배포 |

## 실행
```
npm install
npm run dev        # 개발
npm run build      # dist/ 생성
npm run preview    # 빌드 결과 확인
```
