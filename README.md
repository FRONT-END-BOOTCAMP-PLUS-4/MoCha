# 가계부 웹 어플리케이션 서비스 - MoCha

<br/>

## 🔥 프로젝트 목표

- 최소한의 절차로 누구나 손쉽게 가계부를 작성하도록 만드는 것
- 시각화된 차트로 소비 패턴에 대한 인사이트를 제공하는 것
- 반복 사용을 통해 사용자가 건전한 소비 습관을 자연스럽게 형성하도록 유도하는 것


<br/>

## 💻 주요 시스템

### 로그인 / 회원가입

- 자체 회원가입 지원
- nodemailer를 이용하여 이메일 인증코드 전송, 인증번호 확인
- 이메일, 닉네임 중복검사
- 닉네임과 전화번호를 이용하여 아이디 찾기
- 이메일 인증코드 전송, 인증번호 확인 후 비밀번호 재설정
- google, kakao 소셜 로그인 지원

### 수입 / 지출

- 캘린더 라이브러리를 이용
- 플러스 버튼을 클릭하여, 수입 / 지출 등록 모달 오픈, 필수 값 입력 후 저장 시 DB에 데이터 저장
- 해당 날짜 클릭 시 등록된 데이터 조회, 삭제 가능
- 화면 상단에 해당 월의 수입과 지출의 합을 보여주고, 화살표 버튼으로 월 이동이 가능

### 차트 시각화

- 화살표 버튼으로 월 이동 가능
- 파이 차트는 선택한 월에 해당하는 카테고리별 수입과 지출 비율 조회
- 두개의 파이 차트중 왼쪽 차트는 수입 카테고리 리스트, 오른쪽 차트는 지출 카테고리 리스트
- 파이 차트 아래쪽에는 바 차트, 연 단위로 구성
- 연평균 수입과 지출 금액도 함께 제공

### 사용자 정보 변경

- 이메일은 변경 불가능, 전화번호와 닉네임 수정
- 비밀번호 변경 시, 기존의 비밀번호 입력 후 성공 시, 새로운 비밀번호 입력 모달 오픈
- 회원 탈퇴(데이터 삭제 X, user 테이블의 deleted_at 값 할당)

<br/>

## ⚙️ 사용 기술 스택

### 프론트엔드

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-52303d?style=flat-square&logo=zustand&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-57b2bd?style=flat-square&logo=recharts&logoColor=white)

<!-- ![React Query](https://img.shields.io/badge/React%20Query-FF4154?style=flat-square&logo=react-query&logoColor=white) -->

### 백엔드 및 데이터 처리

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/bcrypt-FF6A00?style=flat-square&logo=bcrypt&logoColor=white)

### 기타 도구

![Nodemailer](https://img.shields.io/badge/Nodemailer-4d9fcb?style=flat-square&logo=nodemailer&logoColor=white)

<br/>

## 👥 팀원 소개

<table style="border-collapse: collapse; width: 100%; text-align: center;">
  <tr>
    <td style="border: 1px solid #464646; padding: 10px; ">
      <img src="https://avatars.githubusercontent.com/u/107985535?v=4" alt="yoonstar1996" width="100" height="100" style="border-radius: 100%;">
      <hr style="border: 0; border-top: 1px solid #464646; margin: 10px 0;">
      <a href="https://github.com/yoonstar1996">yoonstar1996</a>
    </td>
    <td style="border: 1px solid #464646; padding: 10px;">
      <img src="https://avatars.githubusercontent.com/u/108041161?v=4" alt="JangIkIk" width="100" height="100" style="border-radius: 100%;">
      <hr style="border: 0; border-top: 1px solid #464646; margin: 10px 0;">
      <a href="https://github.com/JangIkIk">JangIkIk</a>
    </td>
    <td style="border: 1px solid #464646; padding: 10px;">
      <img src="https://avatars.githubusercontent.com/u/91395969?v=4" alt="imi21123" width="100" height="100" style="border-radius: 100%;">
      <hr style="border: 0; border-top: 1px solid #464646; margin: 10px 0;">
      <a href="https://github.com/working-zima">imi21123</a>
    </td>
  </tr>
</table>
