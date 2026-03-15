import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiUsers, FiGitBranch, FiShield, FiLock } from 'react-icons/fi';
import { useAuth } from '../../hooks';

function Feature({ icon, title, description }) {
  return (
    <VStack
      p={6}
      bg={useColorModeValue('white', 'gray.700')}
      borderRadius="lg"
      boxShadow="sm"
      spacing={4}
      align="center"
      textAlign="center"
    >
      <Icon as={icon} boxSize={10} color="teal.500" />
      <Heading size="md">{title}</Heading>
      <Text color="gray.500">{description}</Text>
    </VStack>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg={useColorModeValue('teal.500', 'teal.700')}
        color="white"
        py={{ base: 16, md: 24 }}
      >
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight="bold"
              lineHeight="shorter"
            >
              Build & Explore Your
              <br />
              <Text as="span" color="teal.100">
                Family Tree
              </Text>
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              maxW="2xl"
              color="teal.100"
            >
              Create, manage, and visualize your family history. Connect with
              your roots and preserve memories for future generations.
            </Text>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              spacing={4}
              pt={4}
            >
              {isAuthenticated ? (
                <Button
                  as={RouterLink}
                  to="/dashboard"
                  size="lg"
                  colorScheme="whiteAlpha"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.300' }}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/register"
                    size="lg"
                    colorScheme="whiteAlpha"
                    color="white"
                    _hover={{ bg: 'whiteAlpha.300' }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/login"
                    size="lg"
                    variant="outline"
                    color="white"
                    borderColor="white"
                    _hover={{ bg: 'whiteAlpha.200' }}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </Stack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={{ base: 16, md: 24 }}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl">Powerful Features</Heading>
            <Text color="gray.500" maxW="2xl">
              Everything you need to document and explore your family history
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="100%">
            <Feature
              icon={FiUsers}
              title="Family Members"
              description="Add and manage all your family members with detailed profiles and information."
            />
            <Feature
              icon={FiGitBranch}
              title="Visual Tree"
              description="Interactive family tree visualization showing relationships across generations."
            />
            <Feature
              icon={FiShield}
              title="Relationships"
              description="Define parent-child, spouse, and sibling relationships with ease."
            />
            <Feature
              icon={FiLock}
              title="Secure & Private"
              description="Your family data is protected with secure authentication and authorization."
            />
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg={useColorModeValue('gray.100', 'gray.800')} py={{ base: 16, md: 20 }}>
        <Container maxW="container.md" textAlign="center">
          <VStack spacing={6}>
            <Heading size="lg">Ready to Start Your Family Tree?</Heading>
            <Text color="gray.500">
              Join thousands of families preserving their history
            </Text>
            {!isAuthenticated && (
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                colorScheme="teal"
              >
                Create Your Free Account
              </Button>
            )}
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
