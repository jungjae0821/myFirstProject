/**
 * asset을 Blob 데이터로 변환
 * @param uri 특정 asset,photo등의 uri 값
 * @returns blob(Binary Larget OBject) 데이터
 */
export const assetToBlob = async (uri: string) => {
  // fetch 함수를 활용해서 blob데이터로 바꾸기 위한 응답데이터
  const respone = await fetch(uri);
  // 응답 데이터로부터 blob 생성
  const blob = await respone.blob();
  // 생성된 blob 데이터 반환(return)
  return blob;
};
