import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainStack from "./stacks/MainStack";
import MainTabs from "./stacks/MainTabs";
import AuthStack from "./stacks/AuthStack";
import { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { User } from "firebase/auth";

const stack = createStackNavigator();

export default function App() {
  // 유저 정보 State
  const [user, setUser] = useState<User | null>(null);
  // 로딩
  const [loading, setLoading] = useState(true);

  // 로그인 여부를 파악 (Server와 통신)
  const getAuth = async () => {
    try {
      // 1. Server와 소통해서 로그인 여부 확인할때까지 기다림
      await auth.authStateReady();
      // 2. 로그인 여부에 따른 현재 접속 유저의 상태변화 체크
      auth.onAuthStateChanged((authState) => {
        // 3. 상태변화에 따라 로그인 여부 판단
        // 3-1. 로그인 성공 => user에 값 할당
        if (authState) setUser(authState);
        // 3-2. 로그인 실패 => user에 값 리셋
        else setUser(null);
      });
    } catch (e) {}
  };

  // App.tsx 앱 실행시 최초 1번 실행
  useEffect(() => {
    getAuth();
  }, []);

  return (
    <NavigationContainer>
      {/* 로그인 여부에 따라 다른 Stack을 등록
      로그인 O: MainStack, 로그인 X: AuthStack */}
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
