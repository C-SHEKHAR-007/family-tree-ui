import React from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Navbar from '../Navbar';
import Footer from '../Footer';

export default function Layout({ children }) {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Box
        as="main"
        flex="1"
        bg={useColorModeValue('gray.50', 'gray.800')}
        py={8}
      >
        {children}
      </Box>
      <Footer />
    </Flex>
  );
}
