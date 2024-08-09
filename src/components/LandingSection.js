import React from "react";
import { Avatar, Box, Center, Heading, VStack } from "@chakra-ui/react";
import FullScreenSection from "./FullScreenSection";

const greeting = "Hello, I am Anirudh Konidala!";
const bio1 = "An undergrad CS student";
const bio2 = "at the University of Illinois at Urbana-Champaign!";

const LandingSection = () => (
  <FullScreenSection
    justifyContent="center"
    alignItems="center"
    isDarkBackground
    backgroundColor="#13294B"
  >
    <VStack spacing={4} align="center">
      <Avatar
        size="xl"
        name="Anirudh Konidala"
        src="../images/kidskoding.png"
        mb={-1}
      />
      <Heading as="h2" size="xs" color="white">{greeting}</Heading>
    </VStack>
    <Box mt={8}>
      <VStack spacing={2} align="center">
        <Heading as="h2" size="xl" color="white">{bio1}</Heading>
        <Heading as="h2" size="xl" color="white">{bio2}</Heading>
      </VStack>
    </Box>
  </FullScreenSection>
);

export default LandingSection;
