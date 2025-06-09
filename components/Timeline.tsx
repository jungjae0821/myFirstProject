import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import styled from "styled-components/native";
import { firestore } from "../firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { IPost } from "./Timeline.d";

const Container = styled(View)`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
`;

const Title = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

const PostCard = styled(View)`
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 2;
`;

const PostText = styled(Text)`
  font-size: 16px;
  margin-bottom: 6px;
  color: #444;
`;

const PostImage = styled(Image)`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  margin-top: 10px;
`;

const Timeline = () => {
  const [posts, setPosts] = useState<IPost[]>([]);

  const getPosts = async () => {
    const path = collection(firestore, "posts");
    const condition = orderBy("createdAt", "desc");
    const postsQuery = query(path, condition);
    const snapshot = await getDocs(postsQuery);
    const newPosts = snapshot.docs.map((doc) => {
      const { userId, caption, createdAt, nickname, photos } =
        doc.data() as IPost;
      return {
        id: doc.id,
        userId,
        caption,
        createdAt,
        nickname,
        photos,
      };
    });
    setPosts(newPosts);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Container>
      <Title>📸 타임라인</Title>
      {posts.map((post) => (
        <PostCard key={post.id}>
          <PostText>👤 닉네임: {post.nickname}</PostText>
          <PostText>🆔 사용자 ID: {post.userId}</PostText>
          <PostText>📝 캡션: {post.caption}</PostText>
          <PostText>
            📅 작성일: {new Date(post.createdAt).toLocaleString()}
          </PostText>
          {post.photos && post.photos[0] && (
            <PostImage source={{ uri: post.photos[0] }} resizeMode="cover" />
          )}
        </PostCard>
      ))}
    </Container>
  );
};

export default Timeline;
