import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Profile from "../screens/Profile";

// 하단 Tab을 위한 TabNavigator 컴포넌트생성
const Tab = createBottomTabNavigator();

export default () => {
  // TabNavigator 로 내가 원하는 하단Tab들을 감싸준다.
  return (
    <Tab.Navigator>
      {/* 1번째 Main Tab */}
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      {/* 2번째 Tab */}
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};
