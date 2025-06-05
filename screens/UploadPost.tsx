import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  View,
} from "react-native";
import styled from "styled-components";
import { MainStackScreenList } from "../stacks/MainStack";
import { AntDesign } from "@expo/vector-icons";
import { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import HeaderBtn from "../components/HeaderBtn";
import { auth, firestore as firestoreDB, storage } from "../firebaseConfig";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { assetToBlob } from "../utils";

const Container = styled(View)`
  background-color: black;
  flex: 1;
  padding: 12px;
`;
const Title = styled(Text)``;

const UploadBox = styled(View)`
  flex-direction: row;
`;

const Caption = styled(View)`
  flex: 1;
`;
const Input = styled(TextInput)`
  color: white;
  font-size: 20px;
  padding: 10px;
`;

const PhotoBox = styled(View)`
  width: 110px;
  height: 110px;
`;
const Photo = styled(Image)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;
const PhotoBlack = styled(View)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: black;
  opacity: 0.3;
  position: absolute;
`;
const LoadingBox = styled(View)`
  gap: 10px;
  width: 100%;
  height: 100%;
  position: absolute;
  align-items: center;
  justify-content: center;
  background-color: #000000b8;
`;

// route.params -> useNavigation에서 전달받은 데이터가 들어있음
export default ({
  route: { params },
}: NativeStackScreenProps<MainStackScreenList, "UploadPost">) => {
  // params.assets안 값이 null 이라면 [] 빈배열을 할당한다.
  const assets = params.assets ?? [];
  // Hook : INPUT TEXT(Caption)을 관리하는 State
  const [caption, setCaption] = useState<string>("");
  // Hook : LOADING STATE
  const [loading, setLoading] = useState<boolean>(false);
  // Hook : NavigationHook
  const navi = useNavigation();
  // Input Text 입력/변경 시, State에 반영 함수
  const onChangeCaption = (text: string) => {
    // 추출한 Text(입력한 caption)를 state에 저장
    setCaption(text);
  };

  // 사진 & 글을 업로드하기 위한 '비동기' 함수
  const onUpload = async () => {
    // [방어코드1] : text 작성 안한 경우, 작성하도록 알람
    if (caption.trim() === "") {
      Alert.alert("업로드 오류", "글을 작성한 경우에만 업로드 가능합니다");
      return;
    }
    // [방어코드2]
    // 업로드 중, 업로드를 방지하기 위해, loading 중인 경우에는 기능 종료
    if (loading) return;

    // 1. Loading 시작
    setLoading(true);
    try {
      // 2. Server 에 데이터 업로드
      // - 업로드할 데이터(asset[사진], captions 등)
      const uploadData = {
        caption: caption,
        userId: auth.currentUser?.uid,
        createdAt: Date.now(),
        nickname: auth.currentUser?.displayName,
      };
      // - 업로드할 DB의 경로
      const path = collection(firestoreDB, "posts");
      // - Firebase DB(firestore)의 해당경로에 데이터 업로드!
      const doc = await addDoc(path, uploadData);

      // 2-B. Firebase Storage에 이미지를 URL 변환(Convert)해서 업로드
      // 1.여러 사진들을 URL 형식으로 변환해서 업로드할 배열 생성
      const photoURLs = [];
      // 2.여러 사진들을 반복해서 서버에 업로드하고 배열에 넣는다.
      for (const asset of assets) {
        //  ㄴ 여러 사진들 서버(Storage)에 업로드
        //   - path
        const path = `posts/${auth.currentUser?.uid}/${doc.id}/${asset.id}.png`;
        const locationRef = ref(storage, path);
        //   - blob 형태 추가 변환
        const blob = await assetToBlob(asset.uri);
        //   - 서버(=Storage) 업로드
        const result = await uploadBytesResumable(locationRef, blob);
        //  ㄴ 서버에 업로드한 사진을 URL 로 변환
        const url = await getDownloadURL(result.ref);
        //  ㄴ URL로 변환된 사진들 배열에 추가
        photoURLs.push(url);
      }
      // 3. URL로 변환된 사진들을 모아놓은 배열 서버(=firestore)에 업로드
      await updateDoc(doc, {
        photos: photoURLs,
      });
      // 4. 홈화면(메인화면)으로 이동
      if (navi.canGoBack()) {
        navi.goBack();
        navi.goBack();
      }
    } catch (error) {
      // Exception(예외) : 업로드 실패 시 -- Error
      Alert.alert("Error", `${error}`);
    } finally {
      // 정상동작해도 에러발생해도 Loading 종료
      setLoading(false);
    }
  };

  // Header Right 만들기 위해서 useLayoutEffect(랜더링 되기 전, 1번 실행)
  useLayoutEffect(() => {
    // Header 수정/편집 need to Navigation
    navi.setOptions({
      headerStyle: {
        backgroundColor: "black",
      },
      headerTintColor: "white",
      headerTitle: "Caption",
      headerRight: () => <HeaderBtn title="Upload" onPress={onUpload} />,
    });
  }, [loading, caption, assets]);

  return (
    <Container>
      <Title>Upload Post Page</Title>
      <UploadBox>
        {/* 선택한 사진 보여주는 영역 */}
        <PhotoBox>
          <Photo source={{ uri: assets[0].uri }} />
          <PhotoBlack />
          {/* 선택한 사진이 2장 이상인 경우(여러장)에만, 아이콘을 표시 */}
          {assets.length > 1 && (
            <AntDesign
              style={{ position: "absolute", right: 0, margin: 7 }}
              name="switcher"
              size={25}
              color={"white"}
            />
          )}
        </PhotoBox>
        {/* 글 작성하는 영역 */}
        <Caption>
          <Input
            multiline={true}
            value={caption}
            placeholder="글을 작성해주세요..."
            placeholderTextColor={"#383838"}
            onChangeText={(text) => {
              onChangeCaption(text);
            }}
          />
        </Caption>
      </UploadBox>
      {/* 업로드 중.. 로딩 화면 */}
      {loading && (
        <LoadingBox>
          <ActivityIndicator size={"large"} color={"white"} />
          <Text style={{ color: "white" }}>Uploading</Text>
        </LoadingBox>
      )}
    </Container>
  );
};
