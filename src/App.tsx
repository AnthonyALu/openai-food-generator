import React from "react";
import { Flex } from "@chakra-ui/react";
import Footer from "./components/Footer";
import Chef from "./components/Chef";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <Flex direction="column">
        <Chef />
        <Footer />
      </Flex>
    </ChakraProvider>
  );
}

export default App;
