import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FC } from "react";
import ChefImg from "../assets/chef.jpg";
import SpeechBubble from "./SpeechBubble";
import { Configuration, OpenAIApi } from "openai";

const chefDialogue = {
  greeting: `Greetings! My name is Steve and I'm here to help you think of something
to eat! Just tell me 4 things in your fridge and I'll create a tasty
dish for you!`,
  thinking: `Alright! Please hold on while I cook up something...`,
  notEnoughIngredients: `Short on ingredients eh? That's okay! I'll just think a bit harder...`,
  noIngredients: `Hmmm, you must be about to go grocery shopping! Let me think...`,
};

const Chef: FC = () => {
  const [ingredients, setIngredients] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [chefText, setChefText] = useState(chefDialogue.greeting);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipe, setRecipe] = useState("");
  const [recipeImage, setRecipeImage] = useState("");
  const placeholders = ["Chicken", "Avocado", "Potato", "Cabbage"];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAIKEY,
  });
  const openai = new OpenAIApi(configuration);

  const handleModalClose = () => {
    setRecipe("");
    setRecipeImage("");
    setRecipeTitle("");
    onClose();
  };
  const handleChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    fetchBotReply();
  };
  const validIngredients = ingredients.filter(
    (ingredient) => ingredient !== ""
  );
  const areAllValuesEmpty = validIngredients.length === 0;
  const fetchBotReply = async () => {
    if (areAllValuesEmpty) {
      setChefText(chefDialogue.noIngredients);
    }
    const areAllValuesFilled = ingredients.every((value) => value !== "");
    if (!areAllValuesFilled) {
      setChefText(chefDialogue.notEnoughIngredients);
    } else {
      setChefText(chefDialogue.thinking);
    }
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: areAllValuesEmpty
        ? `Generate an enthusiastic response saying that you'll think of something tasty and easy to make.`
        : `Generate an enthusiastic response that mentions all the ingredients in ${validIngredients} and how tasty they are. However, if there are any profane or unusual ingredients that are never found in recipes such as non-farm animals, say that you're not sure you can use that ingredient and say that you'll think of something easy to make instead.
        ###
        ingredients: bacon, chicken
        enthusiastic response: Oh wow, chicken, bacon, what an amazing combination! There are so many tasty meals that I can think of already!
        ###
        ingredients: bacon
        enthusiastic response: Wow, there are so many possibilities with bacon! I bet it'll be delicious no matter how you cook it!
        ###
        ingredients: human
        enthusiastic response: Hmm, I'm not sure if you should be adding a human to your meal... Not to worry, I'll think of something easy and tasty that you can make!
        ###
        ingredients: dog, cat
        enthusiastic response: Hmm, I'm not sure if you should be adding a dog or a cat to your meal... Not to worry, I'll think of something easy and tasty that you can make!
        ###
        ingredients: ${validIngredients}
        enthusiastic response:
        `,
      max_tokens: 60,
      temperature: 0.2,
    });
    if (response && response.data.choices[0].text) {
      setChefText(response.data.choices[0].text.trim());
    }
    fetchRecipeTitle();
  };

  const fetchRecipeTitle = async () => {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: areAllValuesEmpty
        ? `Generate a recipe name that can be made with basic ingredients from the local grocery store
        ###
        recipe name: Garden Salad
        ###
        recipe name: Pasta
        ###
        recipe name: `
        : `If all the ingredients in ${validIngredients} are normal and not profane or unusual, generate a recipe name that includes all the items in ${validIngredients} as core ingredients. Otherwise, generate a generic recipe name
        ###
        ingredients: pumpkin, bacon
        recipe name: Pumpkin Soup
        ###
        ingredients: ${validIngredients}
        recipe name: 
        `,
      temperature: 0.2,
    });
    if (response && response.data.choices[0].text) {
      setRecipeTitle(response.data.choices[0].text.trim());
    }
  };

  const fetchRecipe = async () => {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate an enthusiastic description of the meal ${recipeTitle} and provide a clickable link to make it. The link has to be working and does not lead to a 404 error. Navigate to the link yourself to make sure it is not a 404.`,
      max_tokens: 140,
    });
    if (response && response.data.choices[0].text) {
      setRecipe(response.data.choices[0].text.trim());
    }
  };

  const generateImage = async (prompt: string) => {
    const response = await openai.createImage({
      prompt: `An image of the meal ${prompt} which uses ${validIngredients}. There should be no text in this image.`,
      n: 1,
      size: "256x256",
      response_format: "url",
    });
    if (response && response.data.data[0].url) {
      setRecipeImage(response.data.data[0].url);
    }
  };

  useEffect(() => {
    if (!!recipeTitle) {
      generateImage(recipeTitle);
      fetchRecipe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeTitle]);

  useEffect(() => {
    if (recipeImage && recipe && !isOpen) {
      onOpen();
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeImage, recipe]);

  return (
    <Flex direction="column" m="auto">
      <SpeechBubble>{chefText}</SpeechBubble>

      <Image w="8rem" src={ChefImg} ml="9rem" mt="-2rem" />
      <Flex direction="column">
        {ingredients.map((value, index) => (
          <Input
            key={index}
            value={value}
            onChange={(event) => handleChange(index, event.target.value)}
            placeholder={placeholders[index]}
            size="sm"
          />
        ))}
      </Flex>
      <Button onClick={handleSubmit} isLoading={isLoading}>
        Cook!
      </Button>
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{recipeTitle && recipeTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={recipeImage} />
            <Box>{recipe}</Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Chef;
