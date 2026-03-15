import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Badge,
  SimpleGrid,
  Select,
  useToast,
  useColorModeValue,
  Flex,
  IconButton,
  Tooltip,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiRefreshCw, FiZoomIn, FiZoomOut, FiUsers } from 'react-icons/fi';
import { usePersons, useFamilyTree } from '../../hooks';
import LoadingSpinner from '../../components/LoadingSpinner';

// Tree Node Component
function TreeNode({ person, isRoot = false, onSelect }) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Box
      p={3}
      bg={bgColor}
      borderWidth={2}
      borderColor={isRoot ? 'teal.400' : borderColor}
      borderRadius="lg"
      cursor="pointer"
      onClick={() => onSelect(person)}
      _hover={{
        boxShadow: 'md',
        borderColor: 'teal.400',
      }}
      transition="all 0.2s"
      minW="180px"
    >
      <VStack spacing={2}>
        <Avatar
          size="md"
          name={`${person.first_name} ${person.last_name}`}
          bg={person.gender === 'MALE' ? 'blue.400' : 'pink.400'}
        />
        <Box textAlign="center">
          <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
            {person.first_name} {person.last_name}
          </Text>
          <Badge
            colorScheme={
              person.gender === 'MALE'
                ? 'blue'
                : person.gender === 'FEMALE'
                ? 'pink'
                : 'gray'
            }
            fontSize="xs"
          >
            {person.gender}
          </Badge>
        </Box>
      </VStack>
    </Box>
  );
}

// Generation Level Component
function GenerationLevel({ title, persons, onSelect, emptyMessage }) {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  
  return (
    <Box bg={bgColor} p={4} borderRadius="lg" minH="100px">
      <Text fontWeight="medium" color="gray.500" mb={3} fontSize="sm">
        {title}
      </Text>
      {persons.length > 0 ? (
        <Flex wrap="wrap" gap={4} justify="center">
          {persons.map((person, idx) => (
            <TreeNode
              key={person.id || idx}
              person={person}
              onSelect={onSelect}
            />
          ))}
        </Flex>
      ) : (
        <Text color="gray.400" textAlign="center" py={4} fontSize="sm">
          {emptyMessage}
        </Text>
      )}
    </Box>
  );
}

export default function FamilyTree() {
  const { persons, fetchPersons, loading: personsLoading } = usePersons();
  const {
    ancestors,
    descendants,
    siblings,
    fetchAncestors,
    fetchDescendants,
    fetchSiblings,
    loading: treeLoading,
  } = useFamilyTree();
  
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [maxDepth, setMaxDepth] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const loadPersons = async () => {
      try {
        await fetchPersons();
      } catch (error) {
        console.error('Failed to load persons:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPersons();
  }, [fetchPersons]);

  useEffect(() => {
    if (selectedPerson) {
      loadFamilyTree(selectedPerson.id);
    }
  }, [selectedPerson, maxDepth]);

  const loadFamilyTree = async (personId) => {
    try {
      await Promise.all([
        fetchAncestors(personId, maxDepth),
        fetchDescendants(personId, maxDepth),
        fetchSiblings(personId),
      ]);
    } catch (error) {
      toast({
        title: 'Failed to load family tree',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePersonSelect = (person) => {
    setSelectedPerson(person);
  };

  const handleRefresh = () => {
    if (selectedPerson) {
      loadFamilyTree(selectedPerson.id);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading family tree..." />;
  }

  return (
    <Container maxW="container.xl">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" wrap="wrap" spacing={4}>
          <Box>
            <Heading size="lg">Family Tree</Heading>
            <Text color="gray.500">
              Visualize family relationships across generations
            </Text>
          </Box>
          <HStack spacing={3}>
            <Select
              value={maxDepth}
              onChange={(e) => setMaxDepth(Number(e.target.value))}
              w="150px"
            >
              <option value={1}>1 Generation</option>
              <option value={2}>2 Generations</option>
              <option value={3}>3 Generations</option>
              <option value={5}>5 Generations</option>
            </Select>
            <Tooltip label="Refresh tree">
              <IconButton
                icon={<FiRefreshCw />}
                onClick={handleRefresh}
                isDisabled={!selectedPerson}
                aria-label="Refresh"
              />
            </Tooltip>
          </HStack>
        </HStack>

        {/* Person Selector */}
        <Card>
          <CardHeader>
            <Heading size="md">Select Root Person</Heading>
          </CardHeader>
          <CardBody pt={0}>
            {persons.length > 0 ? (
              <Flex wrap="wrap" gap={3}>
                {persons.slice(0, 20).map((person) => (
                  <Button
                    key={person.id}
                    size="sm"
                    variant={selectedPerson?.id === person.id ? 'solid' : 'outline'}
                    colorScheme={selectedPerson?.id === person.id ? 'teal' : 'gray'}
                    onClick={() => handlePersonSelect(person)}
                    leftIcon={
                      <Avatar
                        size="xs"
                        name={`${person.first_name} ${person.last_name}`}
                        bg={person.gender === 'MALE' ? 'blue.400' : 'pink.400'}
                      />
                    }
                  >
                    {person.first_name} {person.last_name}
                  </Button>
                ))}
                {persons.length > 20 && (
                  <Button
                    as={RouterLink}
                    to="/persons"
                    size="sm"
                    variant="ghost"
                    colorScheme="teal"
                  >
                    View all {persons.length} persons...
                  </Button>
                )}
              </Flex>
            ) : (
              <Box textAlign="center" py={6}>
                <Text color="gray.500">No family members added yet</Text>
                <Button
                  as={RouterLink}
                  to="/persons/new"
                  mt={4}
                  colorScheme="teal"
                >
                  Add Your First Family Member
                </Button>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* Tree Visualization */}
        {selectedPerson ? (
          <Card>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">
                  Family Tree for {selectedPerson.first_name} {selectedPerson.last_name}
                </Heading>
                <Button
                  as={RouterLink}
                  to={`/persons/${selectedPerson.id}`}
                  size="sm"
                  variant="outline"
                >
                  View Profile
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              {treeLoading ? (
                <LoadingSpinner message="Loading family connections..." />
              ) : (
                <VStack spacing={6} align="stretch">
                  {/* Ancestors */}
                  <GenerationLevel
                    title="Ancestors (Parents, Grandparents, etc.)"
                    persons={ancestors}
                    onSelect={handlePersonSelect}
                    emptyMessage="No ancestors found"
                  />

                  <Divider />

                  {/* Siblings */}
                  <HStack spacing={6} justify="center" align="flex-start" wrap="wrap">
                    {/* Siblings */}
                    <Box flex="1" minW="200px">
                      <GenerationLevel
                        title="Siblings"
                        persons={siblings}
                        onSelect={handlePersonSelect}
                        emptyMessage="No siblings found"
                      />
                    </Box>

                    {/* Selected Person */}
                    <Box minW="200px" textAlign="center">
                      <Text fontWeight="medium" color="gray.500" mb={3} fontSize="sm">
                        Selected Person
                      </Text>
                      <TreeNode
                        person={selectedPerson}
                        isRoot
                        onSelect={() => {}}
                      />
                    </Box>
                  </HStack>

                  <Divider />

                  {/* Descendants */}
                  <GenerationLevel
                    title="Descendants (Children, Grandchildren, etc.)"
                    persons={descendants}
                    onSelect={handlePersonSelect}
                    emptyMessage="No descendants found"
                  />
                </VStack>
              )}
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody>
              <VStack spacing={4} py={10}>
                <FiUsers size={48} color="gray" />
                <Text color="gray.500" textAlign="center">
                  Select a person above to view their family tree
                </Text>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  );
}
