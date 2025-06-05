import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import styled from "styled-components";
import LoadingScreen from "./LoadingScreen";
import * as MediaLibrary from "expo-media-library";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NaviProps } from "../stacks/MainStack";
import HeaderBtn from "../components/HeaderBtn";

const Container = styled(View)`
  flex: 1;
`;

// My Gallery Photo styled-compoent
const PhotoBtn = styled(TouchableOpacity)`
  width: 100px;
  height: 100px;
`;
const PhotoImg = styled(Image)`
  width: 100%;
  height: 100%;
`;
// Selected Photo
const SelectedPhoto = styled(View)`
  width: 200px;
  height: 200px;
`;
const SelectedPhotoImg = styled(Image)`
  width: 100%;
  height: 100%;
`;
// Select Icon
const InnerCircle = styled(View)`
  width: 25px;
  height: 25px;
  background-color: #ffd000;
  position: absolute;
  border-radius: 50%;
  margin: 5px;
  right: 0px;
  justify-content: center;
  align-items: center;
`;

const AlbumMenuTitle = styled(Text)`
  font-weight: 600;
  font-size: 18px;
  color: black;
  margin: 15px 20px;
`;

// 한 줄에 띄울 Gallery Photo 사진 수
const numColumns = 3;

export default () => {
  // state 는 'useState'라는 Hook을 이용해 만듦
  // A. Loading : 로딩 여부
  const [loading, setLoading] = useState<boolean>(true);
  // B. 갤러리에서 불러온 사진들
  const [myPhotos, setMyPhotos] = useState<DummyDataType[]>([]);
  // C. 불러온 사진 중에서 선택한 사진들
  const [selectedPhotos, setSelectedPhotos] = useState<DummyDataType[]>([]);
  // Hook : 스마트폰 화면의 넓이를 가져오는 기능
  const { width: WIDTH } = useWindowDimensions();
  // Hook : Page이동을 하기 위한 Navigation Hook
  const navi = useNavigation<NaviProps>();

  // Gallery Photo Size(in Flatlist)
  const itemSize = WIDTH / numColumns;
  // Selected Photo Size(in ScrollView)
  const photoSize = WIDTH * 0.75;
  const photoPadding = (WIDTH - photoSize) / 2;

  // 내가 선택한 사진인지 아닌지 확인(true/false)
  const isSelect = (photo: DummyDataType): boolean => {
    const findPhotoIndex = selectedPhotos.findIndex(
      (asset) => asset.id === photo.id
    );
    // findPhoto : 0보다 작으면 내가 선택하지 않은 녀석 -> false
    // findPhoto : 0이거나 0보다 크면, 내가 선택한 녀석 -> true
    return findPhotoIndex < 0 ? false : true;
  };

  // 불러온 사진 선택하기
  const onSelectPhoto = (photo: DummyDataType) => {
    // 1. 선택한 사진인지, 아닌지 확인
    // =>'photo'가 selectedPhotos 안에 존재하는지 확인하자
    const findPhotoIndex = selectedPhotos.findIndex(
      (asset) => asset.id === photo.id
    );

    // A.한 번도 선택하지 않은 사진 => 선택한 사진 리스트(selectedPhotos)에 '추가'
    if (findPhotoIndex < 0) {
      // 내가 선택한 사진이 추가된 새로운 리스트 생성
      // ... ?? * Spread 문법. 배열/리스트에 요소를 모두 꺼내준다.
      const newPhotos = [...selectedPhotos, photo];
      // selectedPhotos State에 '선택한 사진'을 추가
      setSelectedPhotos(newPhotos);
    }
    // B.이미 선택했던 사진 => 선택한 사진 리스트(selectedPhotos)에서 '삭제'
    else {
      // 1. 지우고 싶은 사진의 index 번호 알아오기-> findPhotoIndex
      // 2. 선택사진 리스트에서 해당 index번호의 item(사진) 지우기
      const removedPhotos = selectedPhotos.concat();
      const deleteCount = 1;
      removedPhotos.splice(findPhotoIndex, deleteCount);
      // 3. 해당 사진이 지원진 새로운 선택사진 리스트롤 갱신(Update)
      setSelectedPhotos(removedPhotos);
    }
  };

  // 갤러리에서 사진'들' 불러오기(비동기 처리)
  const getMyPhotos = async () => {
    // 1.사진첩에 접근 권한 요청
    const { status } = await MediaLibrary.requestPermissionsAsync();
    // [방어코드] 만일, 접근 권한을 거절한 경우
    if (status === MediaLibrary.PermissionStatus.DENIED) {
      // -> 접근 권한을 변경할 수 있도록 권한설정창으로 이동
      Alert.alert(
        "사진 접근 권한",
        "기능을 사용하시려면 사진 접근권한을 허용해주세요.",
        [{ onPress: async () => await Linking.openSettings() }]
      );
      // -> 함수 더이상 실행하지 않고 .. 종료
      return;
    }

    // 2.접근 수락한 경우) 사진첩에서 사진들 불러오기
    const { assets } = await MediaLibrary.getAssetsAsync();
    // 3.불러온 사진들을 myPhotos State에 저장/할당
    setMyPhotos(dummyPhotoDatas);

    // Final : 로딩 종료
    setLoading(false);
  };

  // 현재 페이지 접속 시, 1번 실행되는 Hook
  useEffect(() => {
    // 3초 후에, getMyPhotos실행
    setTimeout(() => {
      getMyPhotos();
    }, 500);
  }, []);

  // Header 의 Style을 변경하기 위해 사용하는 Hook
  useLayoutEffect(() => {
    // 페이지 이동을 위한 함수 + 데이터 전달
    // [*문제 발생] : 페이지 생성 시, 비어있는 selectedPhotos를 1번 집어넣고,
    //               끝나기 때문에 나중에 사진을 선택하더라도 goTo-selectedPhotos 값이
    //               갱신이 되지 않는다... -> 의존성배열 [selectedPhotos] 넣어서
    //               selectePhotos 안의 값이, 사진을 선택할때마다 useEffect가 새로 실행되어서
    //               갱신되도록 코드를 수정한다.
    const goTo = () => {
      // 선택한 사진이 없으면 이동하지 않고, 알림!
      if (selectedPhotos.length < 1) {
        Alert.alert("알림", "선택하진 사진이 없습니다. 사진을 선택해주세요");
        return;
      }

      // 페이지 이동
      // navigation(param1(이동할스크린이름), param2(전달할데이터))
      navi.navigate("UploadPost", {
        assets: selectedPhotos,
      });
    };

    // navigagionHook을 사용해 Header 접근
    navi.setOptions({
      headerRight: () => <HeaderBtn title="Next" onPress={goTo} />,
    });
  }, [selectedPhotos]);

  // Page UI Rendering
  // > 로딩인 경우 LoadingScreen, 로딩 끝나면 현재page
  return loading ? (
    <LoadingScreen />
  ) : (
    <Container>
      {/* A.내가 선택한 사진'들' 보여줄 가로 ScrollView */}
      <ScrollView
        style={{ width: WIDTH, height: WIDTH }}
        contentContainerStyle={{
          paddingHorizontal: photoPadding,
          alignItems: "center",
          gap: 10,
        }}
        snapToInterval={photoSize + 10}
        decelerationRate={"fast"}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {/*map:selectedPhotos가 가지고 있는 데이터만큼 반복*/}
        {selectedPhotos.map((photo, index) => {
          return (
            <SelectedPhoto
              key={index}
              style={{
                width: photoSize,
                height: photoSize,
              }}
            >
              <SelectedPhotoImg source={{ uri: photo.uri }} />
            </SelectedPhoto>
          );
        })}
      </ScrollView>

      <AlbumMenuTitle>최근 순 ▾</AlbumMenuTitle>

      {/* B.내 갤러리의 사진들 보여줄 세로 FlatList */}
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        // keyExtractor={(item) => item.id}
        numColumns={numColumns} // 한 줄에 띄울 아이템 수
        data={myPhotos} // 스크롤할 데이터
        //renderItem : data를 어떻게 보여줄지
        renderItem={({ item }) => {
          return (
            <PhotoBtn
              onPress={() => onSelectPhoto(item)}
              style={{ width: itemSize, height: itemSize }}
            >
              <PhotoImg source={{ uri: item.uri }} />
              {isSelect(item) && (
                <InnerCircle>
                  <FontAwesome name="check" size={18} color={"black"} />
                </InnerCircle>
              )}
            </PhotoBtn>
          );
        }}
      />
    </Container>
  );
};

// DummyData의 타입만들기
export type DummyDataType = {
  id: string;
  uri: string;
};
// [Type] => Union (값을 제한)
type AlignItemsType = "center" | "flex-end" | "flex-start";

// DummyData의 타입만들기 ver2
interface IDummyData {
  id: string;
  uri: string;
}

// DummyData(가짜데이터)
const dummyPhotoDatas: IDummyData[] = [
  {
    id: "1",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHfpvM3rbgUn1OSWm-aSPYVQn79Kb9CxV4iQ&s",
  },
  {
    id: "2",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc4LV9mrzG2dxxMTG6arMrHVC2J0-9XhYUqg&s",
  },
  {
    id: "3",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSj2ckcpx8RfSLITAx6pAW9MHh1H_lH1r1CJA&s",
  },
  {
    id: "4",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7CI3X2jANR-BHM9eACMHRZbDYWBQDPLm4hA&s",
  },
  {
    id: "5",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCqOTp8cG1koFX0t3Z-15UiGlZe0hyGbIi1w&s",
  },
  {
    id: "6",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO360xiJcfL9jJdNX2pBjNf35eT73wzmnelw&s",
  },
  {
    id: "7",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ_DVHqaGpceXvMOewjOzDgvO6grgk6obZfg&s",
  },
  {
    id: "8",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScWua6inI6Wddz5UcWJtsfbf4hveG97-US8Q&s",
  },
  {
    id: "9",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScWua6inI6Wddz5UcWJtsfbf4hveG97-US8Q&s",
  },
  {
    id: "10",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScWua6inI6Wddz5UcWJtsfbf4hveG97-US8Q&s",
  },
];
