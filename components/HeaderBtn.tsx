import { TouchableOpacity, Text } from "react-native";
import styled from "styled-components";

const BtnContainer = styled(TouchableOpacity)`
  padding: 10px 15px;
`;
const Title = styled(Text)`
  font-size: 18px;
  color: tomato;
`;

// 전달받을 props의 타입
type Props = {
  title: string;
  onPress: () => void;
};

export default ({ title, onPress }: Props) => {
  return (
    <BtnContainer
      onPress={() => {
        onPress();
      }}
    >
      <Title></Title>
    </BtnContainer>
  );
};
