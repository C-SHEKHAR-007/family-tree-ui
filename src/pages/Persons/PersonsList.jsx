import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  VStack,
  IconButton,
  Badge,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Card,
  CardBody,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiMoreVertical,
  FiFilter,
  FiLock,
} from 'react-icons/fi';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { usePersons, useAuth } from '../../hooks';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function PersonsList() {
  const { persons, fetchPersons, deletePerson, loading, error } = usePersons();
  const { canWrite, canDelete, isViewer } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deletePerson(deleteId);
      toast({
        title: 'Person deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Delete failed',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDeleteId(null);
      onClose();
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    onOpen();
  };

  const filteredPersons = persons.filter((person) => {
    const search = searchTerm.toLowerCase();
    return (
      person.first_name.toLowerCase().includes(search) ||
      person.last_name.toLowerCase().includes(search) ||
      person.email?.toLowerCase().includes(search) ||
      person.mobile?.includes(search)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && persons.length === 0) {
    return <LoadingSpinner message="Loading persons..." />;
  }

  return (
    <Container maxW="container.xl">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" wrap="wrap" spacing={4}>
          <Box>
            <Heading size="lg">Family Members</Heading>
            <Text color="gray.500">
              {persons.length} total members
              {isViewer && (
                <Badge ml={2} colorScheme="gray" variant="subtle">
                  <HStack spacing={1}>
                    <FiLock size={10} />
                    <Text>Read-only</Text>
                  </HStack>
                </Badge>
              )}
            </Text>
          </Box>
          {canWrite ? (
            <Button
              as={RouterLink}
              to="/persons/new"
              leftIcon={<FiPlus />}
              colorScheme="teal"
            >
              Add Person
            </Button>
          ) : (
            <Tooltip label="Viewers cannot add new persons" placement="left">
              <Button
                leftIcon={<FiLock />}
                colorScheme="gray"
                isDisabled
              >
                Add Person
              </Button>
            </Tooltip>
          )}
        </HStack>

        {/* Search */}
        <Card>
          <CardBody>
            <HStack spacing={4}>
              <InputGroup maxW="400px">
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by name, email, or mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </HStack>
          </CardBody>
        </Card>

        {/* Table */}
        <Card>
          <CardBody p={0}>
            <TableContainer>
              <Table variant="simple">
                <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Gender</Th>
                    <Th>Birth Date</Th>
                    <Th>Contact</Th>
                    <Th>Birth Place</Th>
                    <Th width="100px">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredPersons.length === 0 ? (
                    <Tr>
                      <Td colSpan={6}>
                        <Box textAlign="center" py={8}>
                          <Text color="gray.500">
                            {searchTerm ? 'No matching persons found' : 'No family members added yet'}
                          </Text>
                          {!searchTerm && canWrite && (
                            <Button
                              as={RouterLink}
                              to="/persons/new"
                              mt={4}
                              size="sm"
                              colorScheme="teal"
                            >
                              Add Your First Family Member
                            </Button>
                          )}
                          {!searchTerm && isViewer && (
                            <Text mt={4} fontSize="sm" color="gray.400">
                              Contact an admin to add family members
                            </Text>
                          )}
                        </Box>
                      </Td>
                    </Tr>
                  ) : (
                    filteredPersons.map((person) => (
                      <Tr key={person.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                        <Td>
                          <HStack spacing={3}>
                            <Avatar
                              size="sm"
                              name={`${person.first_name} ${person.last_name}`}
                              bg={person.gender === 'MALE' ? 'blue.400' : 'pink.400'}
                            />
                            <Box>
                              <Text fontWeight="medium">
                                {person.first_name} {person.last_name}
                              </Text>
                            </Box>
                          </HStack>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={person.gender === 'MALE' ? 'blue' : person.gender === 'FEMALE' ? 'pink' : 'gray'}
                          >
                            {person.gender}
                          </Badge>
                        </Td>
                        <Td>{formatDate(person.date_of_birth)}</Td>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm">{person.email || '-'}</Text>
                            <Text fontSize="xs" color="gray.500">
                              {person.mobile || '-'}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Text fontSize="sm" noOfLines={1}>
                            {person.birth_place || '-'}
                          </Text>
                        </Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<FiMoreVertical />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem
                                icon={<FiEye />}
                                onClick={() => navigate(`/persons/${person.id}`)}
                              >
                                View
                              </MenuItem>
                              {canWrite && (
                                <MenuItem
                                  icon={<FiEdit2 />}
                                  onClick={() => navigate(`/persons/${person.id}/edit`)}
                                >
                                  Edit
                                </MenuItem>
                              )}
                              {canDelete && (
                                <MenuItem
                                  icon={<FiTrash2 />}
                                  color="red.500"
                                  onClick={() => confirmDelete(person.id)}
                                >
                                  Delete
                                </MenuItem>
                              )}
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </VStack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Person
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this person? This action cannot be undone and will also remove any associated relationships.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}
