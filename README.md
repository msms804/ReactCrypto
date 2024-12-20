# 민비트
## 1. 프로젝트 소개
업비트에서 제공하는 코인들의 정보를 테마별로 분류하고 실시간가격 및 다양한 정보들을 보여주는 서비스 

## 2. 기능 영상

## 3. 기술 스택
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
<img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=redux&logoColor=white"/>
<img src="https://img.shields.io/badge/reactquery-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"/>
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>

## 4. 주요 기능
* 실시간 가격 제공
* 코인테마별 분류, 테마별 정보 (gcTime, staleTime 조정하여 30분에 한번씩 갱신되도록 설정)
* 코인 검색
* 코인 차트
* 이름, 가격, 거래대금 별 정렬
* 관심코인 watchlist (로컬스토리지 저장)
* 다크모드 (로컬스토리지 저장)
## 5. 아키텍처

## 6. 최적화
* 테이블에서 100개 넘는 코인 렌더링시 속도 느려짐 -> Tanstack/react-virtualized로 렌더링최적화
  * 렌더링시간 20.5ms에서 11.4ms로 단축
* throttle 적용하여 리렌더링 최소화, 시스템 과부하 줄임
* skeleton 적용
* useCallback, useMemo, React.memo
