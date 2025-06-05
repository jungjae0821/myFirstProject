// 로그인 전에 사용할 수 있는 페이지 등록
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Login/LoginScreen";
import SignupScreen from "../screens/Login/SignupScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// AuthStack 에 등록시킬 페이지 리스트
// 형태 : 'screen이름' : '전달할 Params'
export type AuthStackScreenList = {
  Login: undefined;
  Signup: undefined;
};
const Stack = createStackNavigator<AuthStackScreenList>();

// Page 이동 시 필요한, Navigation Props 타입 생성
export type AuthNaviProp = NativeStackNavigationProp<AuthStackScreenList>;

export default () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name={"Login"} component={LoginScreen} />
      <Stack.Screen name={"Signup"} component={SignupScreen} />
    </Stack.Navigator>
  );
};
