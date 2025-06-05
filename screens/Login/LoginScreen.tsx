import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styled from "styled-components";
import { auth } from "../../firebaseConfig";
import { FirebaseError } from "firebase/app";
import { useNavigation } from "@react-navigation/native";
import { AuthNaviProp } from "../../stacks/AuthStack";

const ImgContainer = styled(ImageBackground)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: black;
`;
const WelcomeTitle = styled(Text)`
  font-size: 12px;
  color: #393939;
`;

const AccountBox = styled(View)`
  background-color: white;
  width: 75%;
  padding: 20px;
  border-radius: 10px;
  gap: 25px;
`;
const Logo = styled(Image)`
  width: 100%;
  height: 70px;
`;
const InputField = styled(View)`
  gap: 10px;
`;
const UserInput = styled(TextInput)`
  background-color: #ededed;
  padding: 12px;
  border-radius: 5px;
  color: black;
`;
const UserId = styled(UserInput)``;
const UserPW = styled(UserInput)``;
const LoginBtn = styled(TouchableOpacity)`
  background-color: dodgerblue;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
`;
const LoginBtnTitle = styled(Text)`
  color: white;
`;

const CreateAccountBox = styled(View)`
  align-items: center;
`;
const CreateAccountBtn = styled(TouchableOpacity)``;
const SubTitle = styled(Text)`
  font-size: 12px;
  color: #515151;
`;

export default () => {
  // User Email, PW, Error, Loading 관련 state 생성 및 초기화
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navi = useNavigation<AuthNaviProp>();

  // Email, PW Input Text 문자 state에 할당
  const onChangeText = (text: string, type: "email" | "password") => {
    // 내가 입력한 타입에 따라 state에 Text 할당
    switch (type) {
      case "email":
        setEmail(text);
        break;
      case "password":
        setPassword(text);
        break;
    }
  };

  // Login 버튼 클릭 시, 서버와 통신하여 로그인 프로세스 진행
  const onLogin = async () => {
    // [방어코드] : Email&Password 입력 안한 경우,
    // [방어코드] : 아직 로딩 중인 경우

    // 1. 로그인에 필요한 정보(email,password + auth(Firebase인증))
    setLoading(true);

    // 2. 서버랑 소통(try-catch, async)
    try {
      // User ID/PW/Auth 정보를 통해 Firebase에 로그인 요청
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result) {
        Alert.alert("로그인 성공");
      }
    } catch (error) {
      // Firebase 관련된 에러인 경우에만
      if (error instanceof FirebaseError) {
        // 1.code 형변환(as) (string => FirebaseErrorcode)
        const code = error.code as keyof ErrorCodeType;
        // 2.해당 키값의 value값을 가져옴
        const message = ErrorCode[code];
        // 3.해당 value값을 알림창에 띄움.
        Alert.alert("경고", message);
      }
    } finally {
      // 로그인 프로세스 종료 시, 에러 여부에 관계 없이 로딩 종료
      setLoading(false);
    }
    // 3. Error & Loading
  };
  // CreateAccout 버튼 클릭 시, 회원가입 페이지로 이동
  const goTo = () => {
    navi.navigate("Signup");
  };

  return (
    <ImgContainer
      source={require("../../assets/resources/instaDaelim_background.jpg")}
    >
      <AccountBox>
        <Logo
          source={require("../../assets/resources/instaDaelim_title.png")}
        />
        <WelcomeTitle>
          🤗 Welcome!{"\n"}Here is a My Instagram for Daelim. Glad to meet you
          guys!!
        </WelcomeTitle>
        <InputField>
          <UserId
            placeholder="Email *"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              onChangeText(text, "email");
            }}
          />
          <UserPW
            placeholder="Password *"
            keyboardType="default"
            returnKeyType="done"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => {
              onChangeText(text, "password");
            }}
          />
        </InputField>
        <LoginBtn onPress={loading ? undefined : onLogin}>
          <LoginBtnTitle>{loading ? "Loading..." : "Log in"}</LoginBtnTitle>
        </LoginBtn>
        <CreateAccountBox>
          <SubTitle>Already have an accont?</SubTitle>
          <CreateAccountBtn onPress={goTo}>
            <SubTitle
              style={{
                color: "#1785f3",
                fontWeight: "600",
                fontSize: 12.5,
                textDecorationLine: "underline",
              }}
            >
              Create Account
            </SubTitle>
          </CreateAccountBtn>
        </CreateAccountBox>
      </AccountBox>
    </ImgContainer>
  );
};

// --- Firebase Login ErrorCode ----
// auth/invalid-credential : 유효하지 않은 이메일/암호
// auth/invalid-email : 유효하지 않은 이메일 형식
// auth/missing-password : 비밀번호를 입력하지 않은 경우

// Firebase 로그인 에러코드 Type
type ErrorCodeType = {
  "auth/invalid-credential": string;
  "auth/invalid-email": string;
  "auth/missing-password": string;
};
// Firebase의 로그인 에러코드를 담은 변수
const ErrorCode: ErrorCodeType = {
  "auth/invalid-credential": "유효하지 않은 이메일/암호",
  "auth/invalid-email": "유효하지 않은 이메일 형식",
  "auth/missing-password": "비밀번호를 입력하지 않은 경우",
};
