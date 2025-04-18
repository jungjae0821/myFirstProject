import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Profile from "../screens/Profile";

// 하단 Tab을 위한 TabNavigator 컴포넌트 생성
const Tab = createBottomTabNavigator();

export default () => {
  // TabNavigator로 내가 원하는 하단 Tab들을 감싸줌
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};
