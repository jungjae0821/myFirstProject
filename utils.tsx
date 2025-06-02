export const assetToBlob = async (uri: string) => {
  // fetch 함수를 활용해서 blob 데이터로 바꾸기 위한 응답데이터
  const response = await fetch(uri);
  // 응답 데이터로부터 blob 생성
  const blob = await response.blob();
  // 생성된 blob 데이터 반환 (return)
  return blob;
};
