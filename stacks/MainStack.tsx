import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import CreatePost, { DummyDataType } from "../screens/CreatePost";
import MainTabs from "./MainTabs";
import UploadPost from "../screens/UploadPost";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// MainStack에 등록된 Screen 리스트 (type)
export type MainStackScreenList = {
  // 화면이름 : 전달할 데이터
  MainTabs: undefined;
  CreatePost: undefined;
  UploadPost: {
    assets: DummyDataType[];
  };
};
// NavigationHook에게 이동할 페이지 정보를 알려주기 위한 Type 생성
export type NaviProps = NativeStackNavigationProp<MainStackScreenList>;

// Stack을 사용하기 위란 navigation 컴포넌트
const Stack = createStackNavigator<MainStackScreenList>();

export default () => {
  // 1. Stack.Container로 관리하기 원하는 Screen들을 감싸줌
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="CreatePost" component={CreatePost} />
      <Stack.Screen name="UploadPost" component={UploadPost} />
    </Stack.Navigator>
  );
};
