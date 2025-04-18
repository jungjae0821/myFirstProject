import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { MainStackScreenList } from "../stacks/MainStack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function Home() {
  // 0. Initialized
  // Hook: navigation 기능을 사용하기 위한 Hook 불러오기
  const navi = useNavigation<NativeStackNavigationProp<MainStackScreenList>>();

  // A. Logic Process
  const goToPage = () => {
    // Alert.alert("페이지 이동");
    navi.navigate("CreatePost");
  };

  // B. Page UI Rendering
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Instagram</Text>
        <Button onPress={goToPage} title={"CREATE"}></Button>
      </View>
    </View>
  );
} // <view>는 컴포넌트

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "flex-start",
  },
  header: {
    backgroundColor: "tomato",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
});
