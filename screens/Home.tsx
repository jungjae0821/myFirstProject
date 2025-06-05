import { useNavigation } from "@react-navigation/native";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native";
import { NaviProps } from "../stacks/MainStack";
import { auth } from "../firebaseConfig";
import styled from "styled-components/native";
import Timeline from "../components/Timeline";

const Logo = styled(Image)`
  width: 200px;
  height: 50px;
`;
const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

export default function Home() {
  // 0.Initialized
  // Hook : navigation 기능을 사용하기 위한 Hook
  const navi = useNavigation<NaviProps>();

  // A.Logic Process
  const goToPage = () => {
    // Alert.alert("페이지 이동!");
    navi.navigate("CreatePost");
  };

  // B.Page UI Rendering
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo source={require("../assets/resources/instaDaelim_title.png")} />
        <Button onPress={goToPage} title={"CREATE"}></Button>
      </View>
      {/* 서버에 저장된 데이터 타임라인 순으로 정렬 */}
      <ScrollView>
        <Timeline />
      </ScrollView>
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
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 10,
  },
});
