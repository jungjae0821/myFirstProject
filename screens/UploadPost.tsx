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
import { auth, firestore, storage } from "../firebaseConfig";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, StorageReference } from "firebase/storage";

const Container = styled(View)`
  background-color: black;
  flex: 1;
  padding: 12px;
`;
const Title = styled(Text)``;

const UploadBox = styled(View)`
  flex-direction: row;
  background-color: tomato;
`;

const Caption = styled(View)`
  flex: 1;
  background-color: yellow;
`;
const Input = styled(TextInput)`
  color: black;
  font-size: 20px;
  padding: 15px;
`;

const PhotoBox = styled(View)`
  width: 150px;
  height: 150px;
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
  // params.assets 안 값이 null이라면 [] 빈 배열을 할당함
  const assets = params.assets === null ? [] : params.assets;
  // INPUT TEXT(Caption)을 관리하는 State
  const [caption, setCaption] = useState<string>("");
  // Hook: Loading State
  const [loading, setLoading] = useState<boolean>(false);
  // Hook: NavigationHook
  const navi = useNavigation();
  // Input Text 입력시, State에 반영
  const onChangeCaption = (text: string) => {
    // 발생된 이벤트에서 변경된 Text를 추출
    // 추출한 Text(입력한 caption)를 state에 저장
    setCaption(text);
  };

  // 사진, 글을 업로드하기 위한 함수
  const onUpload = async () => {
    // [방어코드]: text 작성 안한 경우 작성하도록 알람
    if (caption === "" || caption.length < 10) {
      Alert.alert("엄로드 오류", "글을 작성한 경우에만 업로드 가능합니다.");
      return;
    }
    // [방어코드2]
    // 업로드중 업로드를 방지하기 위해 loading 중인 경우에는 기능 종료
    if (loading) return;
    // 1. 로딩 시작
    setLoading(true);
    try {
      // 2. 서버에 데이터 업로드
      // 업로드할 데이터 (asset[사진], captions 등)
      const uploadData = {
        caption: caption,
        userId: auth.currentUser?.uid,
        createdAt: Date.now(),
        nickname: auth.currentUser?.displayName,
      };
      // 업로드할 DB의 경로
      const path = collection(firestore, "posts");
      // Firebase DB(Firestore)의 해당경로에 업로드
      const doc = await addDoc(path, uploadData);
      // 2-1. Firebase Storage에 이미지를 URL형식으로 변환 (convert)해서 업로드
      // - 여러 사진들을 업로드할 배열 생성
      const photoURLs = [];
      // - 여러 사진들을 반복해서 서버에 업로드하고 배열에 넣음
      for (const asset of assets) {
        //   ㄴ 여러 사진들을 서버 (Storage)에 업로드
        // - path
        const path = `posts/${auth.currentUser?.uid}}/${doc.id}/${asset.id}.png`;
        const locationRef = ref(storage, path);
        // - blob 형태 추가 변환
        const blob = await assetToBlob(asset.uri);
        // - 서버 업로드
        const result = await uploadBytesResumable(locationRef, blob);
        //   ㄴ 서버에 업로드한 사진을 URL로 변환
        const url = await getDownloadURL(result.ref);
        //   ㄴ URL로 변환된 사진을을 배열에 추가
        photoURLs.push(url);
      }
      await updateDoc(doc, {
        photos: photoURLs,
      });
      // 3. 서버에 업로드 완료시 Loading 종료
      // Exception (예외): 업로드 실패시 -- error
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "${error}");
      // 에러 발생 시에도 Loading 종료
      setLoading(false);
    }
  };

  // Header Right 만들기 위해서 useLayoutEffect(랜더링 되기전 1번 실행)
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
        {/*선택한 사진 보여주는 영역 */}
        <PhotoBox>
          <Photo source={{ uri: assets[0].uri }} />
          <PhotoBlack />
          {assets.length > 1 && (
            <AntDesign
              style={{ position: "absolute", right: 0, margin: 7 }}
              name="switcher"
              size={25}
              color={"white"}
            />
          )}
        </PhotoBox>
        {/*글 작성하는 영역 */}
        <Caption>
          <Input
            multiline={true}
            value={caption}
            placeholder="Input Caption Here"
            placeholderTextColor={"383838"}
            onChange={(event) => {
              onChangeCaption(event.nativeEvent.text);
            }}
          />
        </Caption>
      </UploadBox>
      {loading && (
        <LoadingBox>
          <ActivityIndicator size={"large"} color={"white"} />
          <Text style={{ color: "white" }}>Uploading...</Text>
        </LoadingBox>
      )}
    </Container>
  );
};
function assetToBlob(uri: string): Promise<Blob> {
  return fetch(uri).then((response) => response.blob());
}
import { uploadBytes } from "firebase/storage";

async function uploadBytesResumable(locationRef: StorageReference, blob: Blob) {
  // Use Firebase's uploadBytes to upload the blob and return the result
  return await uploadBytes(locationRef, blob);
}
