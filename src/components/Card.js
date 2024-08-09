import { Heading, HStack, Image, Text, VStack, Box } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Card = ({ title, description, imageSrc }) => (
  <Box
    borderRadius="lg"
    overflow="hidden"
    boxShadow="lg"
    p={4}
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
      <HStack spacing={2} mt={4}>
        <Text color="blue.500" fontWeight="bold">
          Learn More
        </Text>
        <FontAwesomeIcon icon={faArrowRight} size="sm" />
      </HStack>
    </VStack>
  </Box>
);

export default Card;