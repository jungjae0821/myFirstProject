import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./stacks/MainStack";
import AuthStack from "./stacks/AuthStack";
import { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { User } from "firebase/auth";
import LoadingScreen from "./screens/LoadingScreen";

export default function App() {
  // 유저 정보 State
  const [user, setUser] = useState<User | null>(null);
  // 로딩 (로그인 여부를 파악할 때까지 걸리는 시간)
  const [loading, setLoading] = useState(true);

  // 로그인 여부를 파악(with Server,비동기처리)
  const getAuth = async () => {
    try {
      // 1. Server와 소통해서 로그인 여부 확인할 때까지 기다림
      await auth.authStateReady();

      // -- 로그인여부 파악이 끝났다면, 로딩 종료
      setLoading(false);

      // 2. 로그인 여부에 따른 현재 접속 유저의 상태변화 체크
      auth.onAuthStateChanged((authState) => {
        // 3. 상태변화에 따라 Login 여부 판단
        // 3-a. 로그인 성공 => user 에 값 할당
        if (authState) setUser(authState);
        // 3-b. 로그인 실패 => user 에 값 Reset
        else setUser(null);
      });
    } catch (e) {
      console.warn(e);
    }
  };

  // App.tsx 즉, 앱 실행 시 최초 1번 실행
  useEffect(() => {
    getAuth();
  }, []);

  const MainStream = user ? <MainStack /> : <AuthStack />;

  return (
    <NavigationContainer>
      {/* 로그인 여부에 따라 다른 Stack 등록 */}
      {/* 로그인 O : MainStack, 로그인 X : AuthStack */}
      {/* user안의 값이 있다면 로그인 O, 없다면 로그인 X */}
      {loading ? <LoadingScreen /> : MainStream}
    </NavigationContainer>
  );
}
