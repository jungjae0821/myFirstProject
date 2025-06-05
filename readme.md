## 수업 중 정리

# Expo Project 만들기

1.npx create-expo-app "프로젝트이름" --template
2.Blank(TypeScript) 선택

# styled-component 설치하기 & extension

# React-Navigatior 설치하기

# Prettier 설치(extension)

# Expo Server 시작하기

npx expo start

# Expo Icon 설치하기

npm install @expo/vector-icons --force

## Firebase 설치하기

1. firebase console에서 프로젝트 생성
2. <Web앱> 추가
3. firebase SDK 추가 : npm install firebase --force
4. firebase sdk config 설정 복사해서, firebaseConfig.ts 만들고 붙여넣기

## Firebase RN 용으로 변경하기 위한 AsyncStorage 설치

1. npm i @react-native-async-storage/async-storage --force
2. firebaseConfig 에 1번으로 설치된 설정값 추가/수정
3. tsConfig.ts 에 'paths:["@firebase/auth":...]'추가
   - 2번을 하기 위해서 올바른 사용 경로를 인식할 수 있게 ts 알려줌.
