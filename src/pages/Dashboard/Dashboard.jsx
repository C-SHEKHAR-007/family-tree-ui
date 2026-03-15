import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
  VStack,
  HStack,
  Avatar,
  Badge,
  Button,
  useColorModeValue,
  Icon,
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiUsers, FiGitBranch, FiLink, FiPlus, FiArrowRight, FiShield, FiLock, FiEye } from 'react-icons/fi';
import { useAuth, usePersons, useRelationships } from '../../hooks';
import { getRoleDisplayName, getRoleColor } from '../../utils/permissions';
import LoadingSpinner from '../../components/LoadingSpinner';

function StatsCard({ title, stat, icon, helpText, color = 'teal' }) {
  return (
    <Card>
      <CardBody>
        <Stat>
          <HStack spacing={4}>
            <Box
              p={3}
              bg={`${color}.100`}
              borderRadius="lg"
              color={`${color}.600`}
            >
              <Icon as={icon} boxSize={6} />
            </Box>
            <Box>
              <StatLabel fontWeight="medium" color="gray.500">
                {title}
              </StatLabel>
              <StatNumber fontSize="2xl">{stat}</StatNumber>
              {helpText && (
                <StatHelpText mb={0}>{helpText}</StatHelpText>
              )}
            </Box>
          </HStack>
        </Stat>
      </CardBody>
    </Card>
  );
}

function RecentPersonCard({ person }) {
  return (
    <HStack
      p={3}
      borderRadius="md"
      bg={useColorModeValue('gray.50', 'gray.700')}
      justify="space-between"
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
          <Text fontSize="xs" color="gray.500">
            {person.birth_place || 'No birth place'}
          </Text>
        </Box>
      </HStack>
      <Badge colorScheme={person.gender === 'MALE' ? 'blue' : 'pink'} fontSize="xs">
        {person.gender}
      </Badge>
    </HStack>
  );
}

export default function Dashboard() {
  const { user, canWrite, canDelete, isAdmin, isViewer } = useAuth();
  const { persons, fetchPersons, loading: personsLoading } = usePersons();
  const { relationships, fetchRelationships, loading: relLoading } = useRelationships();
  const [isLoading, setIsLoading] = useState(true);

  const roleColor = user ? getRoleColor(user.role) : 'gray';
  const roleDisplayName = user ? getRoleDisplayName(user.role) : '';

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchPersons(0, 100), fetchRelationships(0, 100)]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchPersons, fetchRelationships]);

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const recentPersons = persons.slice(0, 5);

  return (
    <Container maxW="container.xl">
      <VStack spacing={8} align="stretch">
        {/* Welcome Section */}
        <Box>
          <Heading size="lg" mb={2}>
            Welcome back, {user?.first_name}!
          </Heading>
          <Text color="gray.500">
            Here's an overview of your family tree data.
          </Text>
        </Box>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <StatsCard
            title="Total Persons"
            stat={persons.length}
            icon={FiUsers}
            helpText="Family members"
            color="teal"
          />
          <StatsCard
            title="Relationships"
            stat={relationships.length}
            icon={FiLink}
            helpText="Family connections"
            color="purple"
          />
          <StatsCard
            title="Generations"
            stat="--"
            icon={FiGitBranch}
            helpText="Tree depth"
            color="orange"
          />
        </SimpleGrid>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md">Quick Actions</Heading>
              {isViewer && (
                <Badge colorScheme="gray" variant="subtle">
                  <HStack spacing={1}>
                    <FiEye size={12} />
                    <Text>View-only mode</Text>
                  </HStack>
                </Badge>
              )}
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
              {canWrite ? (
                <Button
                  as={RouterLink}
                  to="/persons/new"
                  leftIcon={<FiPlus />}
                  colorScheme="teal"
                  variant="outline"
                >
                  Add Person
                </Button>
              ) : (
                <Tooltip label="Viewers cannot add persons">
                  <Button
                    leftIcon={<FiLock />}
                    colorScheme="gray"
                    variant="outline"
                    isDisabled
                  >
                    Add Person
                  </Button>
                </Tooltip>
              )}
              {canWrite ? (
                <Button
                  as={RouterLink}
                  to="/relationships"
                  leftIcon={<FiLink />}
                  colorScheme="purple"
                  variant="outline"
                >
                  Add Relationship
                </Button>
              ) : (
                <Tooltip label="Viewers cannot add relationships">
                  <Button
                    leftIcon={<FiLock />}
                    colorScheme="gray"
                    variant="outline"
                    isDisabled
                  >
                    Add Relationship
                  </Button>
                </Tooltip>
              )}
              <Button
                as={RouterLink}
                to="/family-tree"
                leftIcon={<FiGitBranch />}
                colorScheme="orange"
                variant="outline"
              >
                View Tree
              </Button>
              <Button
                as={RouterLink}
                to="/persons"
                leftIcon={<FiUsers />}
                colorScheme="blue"
                variant="outline"
              >
                {canWrite ? 'Manage Persons' : 'View Persons'}
              </Button>
            </SimpleGrid>
            {isAdmin && (
              <Box mt={4} pt={4} borderTopWidth={1}>
                <Text fontSize="sm" color="gray.500" mb={3}>Admin Actions</Text>
                <Button
                  as={RouterLink}
                  to="/admin/users"
                  leftIcon={<FiShield />}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                >
                  Manage Users
                </Button>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Recent Persons */}
          <Card>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Recent Family Members</Heading>
                <Button
                  as={RouterLink}
                  to="/persons"
                  size="sm"
                  variant="ghost"
                  rightIcon={<FiArrowRight />}
                >
                  View All
                </Button>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={3} align="stretch">
                {recentPersons.length > 0 ? (
                  recentPersons.map((person) => (
                    <RecentPersonCard key={person.id} person={person} />
                  ))
                ) : (
                  <Box textAlign="center" py={6}>
                    <Text color="gray.500">No family members added yet</Text>
                    {canWrite && (
                      <Button
                        as={RouterLink}
                        to="/persons/new"
                        mt={3}
                        size="sm"
                        colorScheme="teal"
                      >
                        Add Your First Family Member
                      </Button>
                    )}
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* User Info */}
          <Card>
            <CardHeader>
              <Heading size="md">Your Profile</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={4} align="stretch">
                <HStack spacing={4}>
                  <Avatar
                    size="lg"
                    name={`${user?.first_name} ${user?.last_name}`}
                    bg="teal.500"
                  />
                  <Box>
                    <Text fontWeight="bold" fontSize="lg">
                      {user?.first_name} {user?.last_name}
                    </Text>
                    <Text color="gray.500">{user?.email}</Text>
                    <Badge colorScheme={roleColor} mt={1}>
                      {roleDisplayName}
                    </Badge>
                  </Box>
                </HStack>
                <Divider />
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Username
                    </Text>
                    <Text fontWeight="medium">{user?.username}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Mobile
                    </Text>
                    <Text fontWeight="medium">{user?.mobile || 'Not set'}</Text>
                  </Box>
                </SimpleGrid>
                <Button
                  as={RouterLink}
                  to="/profile"
                  variant="outline"
                  size="sm"
                  alignSelf="flex-start"
                >
                  Edit Profile
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
