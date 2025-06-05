import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
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
const UserName = styled(UserInput)``;
const SignupBtn = styled(TouchableOpacity)`
  background-color: dodgerblue;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
`;
const SignupBtnTitle = styled(Text)`
  color: white;
`;

const Footer = styled(View)`
  align-items: center;
`;
const FooterBtn = styled(TouchableOpacity)``;
const SubTitle = styled(Text)`
  font-size: 12px;
  color: #515151;
  text-align: center;
`;

export default () => {
  // User Email, PW, Error, Loading 관련 state 생성 및 초기화
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navi = useNavigation();

  // Email, PW Input Text 문자 state에 할당
  const onChangeText = (text: string, type: "email" | "password" | "name") => {
    // 내가 입력한 타입에 따라 state에 Text 할당
    switch (type) {
      case "email":
        setEmail(text);
        break;
      case "password":
        setPassword(text);
        break;
      case "name":
        setName(text);
        break;
    }
  };

  // Login 버튼 클릭 시, 서버와 통신하여 로그인 프로세스 진행
  const onSubmit = async () => {
    // [방어코드] : Email&Password 입력 안한 경우,
    // [방어코드] : 아직 로딩 중인 경우

    // 1. 로그인에 필요한 정보(email,password + auth(Firebase인증))
    setLoading(true);

    // 2. 서버랑 소통(try-catch, async)
    try {
      // 1.User ID/PW/Auth 정보를 통해 Firebase에 회원가입 요청
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // 2.회원가입 완료 시, 해당 계정의 닉네임 갱신
      await updateProfile(result.user, {
        displayName: name,
      });

      if (result) {
        Alert.alert("회원가입 성공");
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
  // 뒤로가기 버튼 클릭 시, 로그인(이전) 페이지로 이동
  const goBack = () => {
    navi.goBack();
  };

  return (
    <ImgContainer
      source={require("../../assets/resources/instaDaelim_background.jpg")}
    >
      <AccountBox>
        {/* 로고 이미지 */}
        <Logo
          source={require("../../assets/resources/instaDaelim_title.png")}
        />
        {/* 안내 문구 */}
        <WelcomeTitle>
          🤗 환영합니다!{"\n"} 이곳은 회원가입 페이지 입니다. 당신의 닉네임,
          이메일 등을 작성해서 회원가입을 완료해주세요.
        </WelcomeTitle>
        {/* 글 작성 영역 */}
        <InputField>
          {/* 계정 닉네임 작성 */}
          <UserName
            placeholder="Nickname *"
            keyboardType="default"
            value={name}
            onChangeText={(text) => {
              onChangeText(text, "name");
            }}
          />
          {/* 유저 이메일 작성 */}
          <UserId
            placeholder="Email *"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              onChangeText(text, "email");
            }}
          />
          {/* 유저 패스워드 작성 */}
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
        <View style={{ gap: 5 }}>
          {/* 회원가입 버튼 */}
          <SignupBtn onPress={loading ? undefined : onSubmit}>
            <SignupBtnTitle>
              {loading ? "Loading..." : "Create Account"}
            </SignupBtnTitle>
          </SignupBtn>
          {/* 뒤로가기 버튼 */}
          <SignupBtn onPress={goBack} style={{ backgroundColor: "#9ac5f0" }}>
            <SignupBtnTitle>go back</SignupBtnTitle>
          </SignupBtn>
        </View>
        {/* 하단 영역 */}
        <Footer>
          <SubTitle>CopyRight 2025{"\n"}REPiiCA all rights reserved</SubTitle>
        </Footer>
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
