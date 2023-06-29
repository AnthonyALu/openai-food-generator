import { Box, Flex, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import React from "react";
import { FC } from "react";

const Footer: FC = () => {
  return (
    <Flex
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      p="2rem"
      bg="black"
      color="white"
      justify="space-between"
    >
      <Box>Powered by Open Ai</Box>

      <Link
        textAlign={"right"}
        color="white"
        href="https://www.freepik.com/free-vector/coloured-chefdesign_951860.htm#query=cartoon%20chef&position=1&from_view=keyword&track=ais"
      >
        Image by ajipebriana on Freepik <ExternalLinkIcon mx="2px" />
      </Link>
    </Flex>
  );
};

export default Footer;
