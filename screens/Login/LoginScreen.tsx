import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import styled from "styled-components";
import { auth } from "../../firebaseConfig";
import { FirebaseError } from "firebase/app";

const ImgContainer = styled(ImageBackground)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: black;
`;
const WelcomeTitle = styled(Text)`
  font-size: 14px;
  color: black;
`;

const AccountBox = styled(View)`
  background-color: white;
  width: 70%;
  padding: 20px;
  border-radius: 10px;
  gap: 20px;
`;
const Logo = styled(Image)`
  background-color: tomato;
  width: 100%;
  height: 30px;
`;
const InputField = styled(View)`
  gap: 10px;
`;
const CreateAccountBox = styled(View)`
  align-items: center;
`;
const CreateAccountBtn = styled(TouchableOpacity)``;
const SubTitle = styled(Text)`
  font-size: 12px;
  color: black;
`;
const UserInput = styled(TextInput)`
  background-color: white;
  padding: 12px;
  border-radius: 5px;
  color: black;
`;
const UserId = styled(UserInput)``;
const UserPW = styled(UserInput)``;
const LoginBtn = styled(TouchableOpacity)`
  background-color: skyblue;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
`;
const LoginBtnTitle = styled(Text)``;

export default () => {
  // User Email, PW, Error, Loading 관련 state 생성 및 초기화
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Email, PW Input Text 문자 state에 할당
  const onChangeText = (text: string, type: "email" | "password") => {
    // 내가 읿력한 타입에 따라 state에 Text 할당
    switch (type) {
      case "email":
        setEmail(text);
        break;
      case "password":
        setPassword(text);
        break;
    }
    setEmail(text);
  };

  // 로그인 버튼 클릭시 서버와 통신하여 로그인 프로세스 진행
  const onLogin = async () => {
    // [방어코드]: Email, PW 입력하지 않은 경우
    // [방어코드]: 아직 로딩중인 경우

    // 1. 로그인에 필요한 정보 (email, password + auth(인증))
    setLoading(true);
    // 2. 서버와 소통 (try-catch)
    try {
      // User ID/PW/Auth 정보를 통해 Firebase Auth에 로그인 요청
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result) {
        Alert.alert("로그인 성공", result.user.email);
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        Alert.alert(error.code);
      }
    } finally {
      // 로그인 프로세스 종료 시 에러 여부에 관계없이 종료료
      setLoading(false);
    }
    // 3. Error & Loading
  };
  // CreateAccount 버튼 클릭시 회원가입 페이지로 이동
  const goTo = () => {};

  return (
    <ImgContainer
      source={require("../../assets/resources/instaDaelim_background.jpg")}
    >
      <AccountBox>
        <Logo source={require("../../assets/resources/instaDaelim_logo.png")} />
        <WelcomeTitle>Welcome!</WelcomeTitle>
        <InputField>
          <SubTitle>ID</SubTitle>
          <UserId
            placeholder="Email *"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              onChangeText(text, "email");
            }}
          />
          <SubTitle>PW</SubTitle>
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
        <LoginBtn onPress={onLogin}>
          <LoginBtnTitle>Login</LoginBtnTitle>
        </LoginBtn>
        <CreateAccountBox>
          <SubTitle>Already have an account?</SubTitle>
          <CreateAccountBtn>
            <SubTitle
              style={{
                color: "#1785f3",
                fontWeight: "600",
                fontSize: 13,
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
