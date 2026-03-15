import React from 'react';
import { Center, Spinner, Text, VStack } from '@chakra-ui/react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <Center h="200px">
      <VStack spacing={4}>
        <Spinner size="xl" color="teal.500" thickness="4px" speed="0.8s" />
        <Text color="gray.500">{message}</Text>
      </VStack>
    </Center>
  );
}
