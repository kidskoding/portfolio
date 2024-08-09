import { Heading, HStack, Image, Text, VStack, Box } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Card = ({ title, description, imageSrc }) => (
  <Box
    p={4}
    borderRadius="lg"
    overflow="hidden"
    boxShadow="lg"
    backgroundColor="white"
  >
    <Image
      src={imageSrc}
      alt={title}
      borderRadius="md"
      mb={4}
    />
    <VStack align="start" spacing={3}>
      <Heading as="h3" size="md" color="gray.800">
        {title}
      </Heading>
      <Text color="gray.600">
        {description}
      </Text>
      <HStack spacing={2} mt={3}>
        <Text color="gray.900">
          See More
        </Text>
        { /* icon is included. I dont know why it's not rendering in browser */ }
        <FontAwesomeIcon icon={faArrowRight} size="1x" />
      </HStack>
    </VStack>
  </Box>
);

export default Card;