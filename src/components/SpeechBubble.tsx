import { Box, BoxProps, Flex } from "@chakra-ui/react";
import React, { FC } from "react";
import SpeechBubbleImg from "../assets/bubble.png";

interface SpeechBubbleProps extends BoxProps {
  children: React.ReactNode;
}

const SpeechBubble: FC<SpeechBubbleProps> = ({ children }) => {
  return (
    <Flex
      position="relative"
      p={"1.5rem"}
      color="black"
      bgImage={SpeechBubbleImg}
      bgSize="contain"
      bgRepeat="no-repeat"
      bgPosition="center"
      w="14rem"
      h="14rem"
      justify="center"
      fontSize="sm"
    >
      {children}
    </Flex>
  );
};

export default SpeechBubble;
