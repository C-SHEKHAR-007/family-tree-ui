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
  Divider,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { FiEdit2, FiGitBranch, FiUsers } from 'react-icons/fi';
import { personService } from '../../services';
import { useFamilyTree, useRelationships } from '../../hooks';
import LoadingSpinner from '../../components/LoadingSpinner';

function InfoItem({ label, value }) {
  return (
    <Box>
      <Text fontSize="sm" color="gray.500" mb={1}>
        {label}
      </Text>
      <Text fontWeight="medium">{value || '-'}</Text>
    </Box>
  );
}

function RelatedPersonCard({ person, relationship }) {
  return (
    <HStack
      p={3}
      borderRadius="md"
      bg={useColorModeValue('gray.50', 'gray.700')}
      justify="space-between"
      as={RouterLink}
      to={`/persons/${person.id}`}
      _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
    >
      <HStack spacing={3}>
        <Avatar
          size="sm"
          name={`${person.first_name} ${person.last_name}`}
          bg={person.gender === 'MALE' ? 'blue.400' : 'pink.400'}
        />
        <Box>
          <Text fontWeight="medium" fontSize="sm">
            {person.first_name} {person.last_name}
          </Text>
          <Badge colorScheme="teal" fontSize="xs">
            {relationship}
          </Badge>
        </Box>
      </HStack>
    </HStack>
  );
}

export default function PersonView() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ancestors, descendants, siblings, fetchAncestors, fetchDescendants, fetchSiblings } = useFamilyTree();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const personData = await personService.getById(id);
        setPerson(personData);
        
        // Load family tree data
        await Promise.all([
          fetchAncestors(id, 2).catch(() => []),
          fetchDescendants(id, 2).catch(() => []),
          fetchSiblings(id).catch(() => []),
        ]);
      } catch (error) {
        toast({
          title: 'Failed to load person',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/persons');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id, navigate, toast, fetchAncestors, fetchDescendants, fetchSiblings]);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading person details..." />;
  }

  if (!person) {
    return (
      <Container maxW="container.md" textAlign="center" py={10}>
        <Text>Person not found</Text>
        <Button as={RouterLink} to="/persons" mt={4}>
          Back to Persons
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg">
      <VStack spacing={6} align="stretch">
        {/* Breadcrumb */}
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/persons">
              Persons
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{person.first_name} {person.last_name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Main Card */}
        <Card>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Header */}
              <HStack justify="space-between" wrap="wrap" spacing={4}>
                <HStack spacing={4}>
                  <Avatar
                    size="xl"
                    name={`${person.first_name} ${person.last_name}`}
                    bg={person.gender === 'MALE' ? 'blue.400' : 'pink.400'}
                  />
                  <Box>
                    <Heading size="lg">
                      {person.first_name} {person.last_name}
                    </Heading>
                    <HStack mt={2} spacing={2}>
                      <Badge
                        colorScheme={
                          person.gender === 'MALE'
                            ? 'blue'
                            : person.gender === 'FEMALE'
                            ? 'pink'
                            : 'gray'
                        }
                      >
                        {person.gender}
                      </Badge>
                      {person.date_of_birth && (
                        <Text color="gray.500" fontSize="sm">
                          Born: {formatDate(person.date_of_birth)}
                        </Text>
                      )}
                    </HStack>
                  </Box>
                </HStack>
                <Button
                  leftIcon={<FiEdit2 />}
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => navigate(`/persons/${id}/edit`)}
                >
                  Edit
                </Button>
              </HStack>

              <Divider />

              {/* Details Grid */}
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <InfoItem label="Email" value={person.email} />
                <InfoItem label="Mobile" value={person.mobile} />
                <InfoItem label="Birth Place" value={person.birth_place} />
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Family Relationships Tabs */}
        <Card>
          <CardHeader>
            <Heading size="md">Family Relationships</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <Tabs colorScheme="teal" variant="enclosed">
              <TabList>
                <Tab>
                  <HStack spacing={2}>
                    <FiUsers />
                    <Text>Ancestors ({ancestors.length})</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <FiGitBranch />
                    <Text>Descendants ({descendants.length})</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <FiUsers />
                    <Text>Siblings ({siblings.length})</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={3} align="stretch">
                    {ancestors.length > 0 ? (
                      ancestors.map((ancestor, index) => (
                        <RelatedPersonCard
                          key={ancestor.id || index}
                          person={ancestor}
                          relationship={`Generation ${ancestor.generation || index + 1}`}
                        />
                      ))
                    ) : (
                      <Text color="gray.500" textAlign="center" py={4}>
                        No ancestors found
                      </Text>
                    )}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack spacing={3} align="stretch">
                    {descendants.length > 0 ? (
                      descendants.map((descendant, index) => (
                        <RelatedPersonCard
                          key={descendant.id || index}
                          person={descendant}
                          relationship={`Generation ${descendant.generation || index + 1}`}
                        />
                      ))
                    ) : (
                      <Text color="gray.500" textAlign="center" py={4}>
                        No descendants found
                      </Text>
                    )}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack spacing={3} align="stretch">
                    {siblings.length > 0 ? (
                      siblings.map((sibling, index) => (
                        <RelatedPersonCard
                          key={sibling.id || index}
                          person={sibling}
                          relationship="Sibling"
                        />
                      ))
                    ) : (
                      <Text color="gray.500" textAlign="center" py={4}>
                        No siblings found
                      </Text>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}
