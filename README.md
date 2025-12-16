# 🎬 MovieFlix – Front-End Demo Site (Netflix Style)

MovieFlix là một **Single Page Application (SPA)** mô phỏng giao diện và trải nghiệm của Netflix, được xây dựng bằng **React + TypeScript**.  
Dự án tập trung vào **UI/UX animation**, **TMDB API 연동**, **LocalStorage 활용**, và **정적 웹사이트 배포 (GitHub Pages)**.

---

## 📌 Project Goal
- React 기반 SPA 개발 및 라우팅 이해
- TMDB API를 활용한 영화 데이터 비동기 처리
- CSS Transition & Animation을 통한 Netflix-style UI 구현
- LocalStorage를 이용한 사용자 데이터 관리
- GitHub Pages를 통한 정적 웹사이트 배포
- GPT를 활용한 개발 생산성 향상

---

## 🛠 Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State / Storage**: LocalStorage
- **UI / Animation**: CSS Transition, Transform, Blur, Hover Effect
- **API**: The Movie Database (TMDB)
- **Deploy**: GitHub Pages

---

## ✨ Main Features
- 🔐 **Login / Sign Up**
  - Netflix-style 2-panel sliding animation
  - Email validation, Remember Me
  - User data stored in LocalStorage

- 🏠 **Home**
  - Multiple movie lists using TMDB APIs
  - Poster hover zoom & wishlist toggle

- 🔥 **Popular**
  - Table View / Infinite Scroll switch
  - Pagination, loading indicator, scroll-to-top button

- 🔎 **Search / Filtering**
  - Genre, rating, sorting filters
  - Reset filter support

- ❤️ **Wishlist**
  - Favorite movies stored in LocalStorage
  - No API call on this page

- 📱 **Responsive Web**
  - Mobile / Desktop layout support

---

## 🔑 LocalStorage Usage
- `users` : registered user list  
- `currentUser` : login state  
- `keepLogin` : auto login flag  
- `movieWishlist` : favorite movie list  
- `TMDb-Key` : TMDB API key (assignment requirement)

---

## ▶️ How to Run
``
npm install
npm run dev

---

## Build
npm run build


🌐 Deployment
GitHub Repository: https://github.com/USERNAME/REPOSITORY_NAME

GitHub Pages: https://USERNAME.github.io/REPOSITORY_NAME/

🤖 AI Usage
GPT를 활용하여:

React 컴포넌트 설계

Netflix-style animation 구조 설계

CSS Transition & UX 개선

코드 리팩토링 및 문서 작성