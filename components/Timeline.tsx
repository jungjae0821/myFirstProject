import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import styled from "styled-components";
import { firestore } from "../firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { IPost } from "./Timeline.d";

const Container = styled(View)``;
const Title = styled(Text)``;
const Timeline = () => {
  // 불러온 게시글들을 저장할 State
  const [posts, setPosts] = useState<IPost[]>([]);
  // 서버 (Firebase)로부터 Post(게시글) 데이터를 불러옴
  const getPosts = async () => {
    // 1. 특정 데이터를 가져오기 위한 Query문 생성
    // 다른 사람들이 올린 Post(게시글) 불러오기
    // 1-1. 경로
    const path = collection(firestore, "posts");
    // 1-2. 조건
    const condition = orderBy("createdAt", "desc");
    const postsQuery = query(path, condition);
    // 2. 1번에 해당하는 데이터 불러오기
    const snapshot = await getDocs(postsQuery);
    // 3. 해당 데이터를 분류
    const newPosts = snapshot.docs.map((doc) => {
      // 3-1. doc 안에 존재하는 Field를 가져옴
      const { userId, caption, createdAt, nickname, photos } =
        doc.data() as IPost;
      // 3-2. 가져온 Field를 새롭게 그룹화시킴
      return {
        id: doc.id,
        userId,
        caption,
        createdAt,
        nickname,
        photos,
      };
    });
    // 4. 분류된 데이터를 화면에 그려주기 위해 State 할당/저장
    setPosts(newPosts);
  };
  // 페이지가 실행될때 (Timeline 컴포넌트가 생성될 때)
  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Container>
      <Title>Timeline ----------</Title>
      {/* 서버에서 가져온 데이터를 최신순으로 정렬해 보여주기 */}
      {posts.map((post) => {
        return (
          <View>
            <Title>{post.id}</Title>
            <Title>{post.userId}</Title>
            <Title>{post.createdAt}</Title>
            <Title>{post.nickname}</Title>
            <Title>{post.caption}</Title>
            {post.photos && (
              <Image
                source={{ uri: post.photos[0] }}
                style={{ width: 100, height: 100 }}
              />
            )}
          </View>
        );
      })}
    </Container>
  );
};
export default Timeline;
