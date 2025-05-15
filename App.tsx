import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainStack from "./stacks/MainStack";
import MainTabs from "./stacks/MainTabs";
import AuthStack from "./stacks/AuthStack";

const stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
}
