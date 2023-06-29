import { Box, Button, Flex, Image, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { FC } from "react";
import ChefImg from "../assets/chef.jpg";
import SpeechBubble from "./SpeechBubble";
import dotenv from "dotenv";
dotenv.config();

const chefDialogue = {
  greeting: `Greetings! My name is Steve and I'm here to help you think of something
to eat! Just tell me 4 things in your fridge and I'll create a tasty
dish for you!`,
  thinking: `Alright! Please hold on while I cook up something...`,
};

const Chef: FC = () => {
  const [inputValues, setInputValues] = useState(["", "", "", ""]);
  console.log(process.env.OPENAIURL);
  const [chefText, setChefText] = useState(chefDialogue.greeting);
  const handleChange = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const placeholders = ["Chicken", "Avocado", "Potato", "Cabbage"];

  const handleSubmit = () => {
    setChefText(chefDialogue.thinking);
  };

  return (
    <Flex direction="column" m="auto">
      <SpeechBubble>{chefText}</SpeechBubble>
      <Image w="8rem" src={ChefImg} ml="9rem" mt="-2rem" />
      <Flex direction="column">
        {inputValues.map((value, index) => (
          <Input
            key={index}
            value={value}
            onChange={(event) => handleChange(index, event.target.value)}
            placeholder={placeholders[index]}
            size="sm"
          />
        ))}
      </Flex>
      <Button onClick={handleSubmit}>Cook!</Button>
    </Flex>
  );
};

export default Chef;
