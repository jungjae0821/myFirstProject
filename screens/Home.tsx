import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, Text, View } from "react-native";
import { NaviProps } from "../stacks/MainStack";
import { auth } from "../firebaseConfig";

export default function Home() {
  // 0.Initialized
  // Hook : navigation 기능을 사용하기 위한 Hook
  const navi = useNavigation<NaviProps>();

  // A.Logic Process
  const goToPage = () => {
    // Alert.alert("페이지 이동!");
    navi.navigate("CreatePost");
  };

  const signOut = async () => {
    await auth.signOut();
  };

  // B.Page UI Rendering
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>InstaDaelim</Text>
        <Button onPress={goToPage} title={"CREATE"}></Button>
      </View>
      {/* 테스트용 로그아웃버튼 */}
      <Button title="Log out" onPress={signOut} />
    </View>
  );
}

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
