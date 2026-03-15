import React from 'react';
import { Box, Container, Stack, Text, Link, useColorModeValue, IconButton, HStack } from '@chakra-ui/react';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTopWidth={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container
        as={Stack}
        maxW="container.xl"
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text fontSize="sm">
          © {new Date().getFullYear()} FamilyTree App. All rights reserved.
        </Text>
        <HStack spacing={4}>
          <Link href="#" isExternal>
            <IconButton
              aria-label="GitHub"
              icon={<FiGithub />}
              size="sm"
              variant="ghost"
            />
          </Link>
          <Link href="#" isExternal>
            <IconButton
              aria-label="Twitter"
              icon={<FiTwitter />}
              size="sm"
              variant="ghost"
            />
          </Link>
          <Link href="#" isExternal>
            <IconButton
              aria-label="LinkedIn"
              icon={<FiLinkedin />}
              size="sm"
              variant="ghost"
            />
          </Link>
        </HStack>
      </Container>
    </Box>
  );
}
