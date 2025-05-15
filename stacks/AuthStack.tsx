import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Login/LoginScreen";

// AuthStack에 등록시킬 페이지 리스트
// 형태: 'screen이름' : '전달할 params'
export type AuthStackScreenList = {
  Login: undefined;
};
const Stack = createStackNavigator<AuthStackScreenList>();

export default () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={"Login"} component={LoginScreen} />
    </Stack.Navigator>
  );
};
