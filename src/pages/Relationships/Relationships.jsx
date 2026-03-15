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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { usePersons, useRelationships } from '../../hooks';
import LoadingSpinner from '../../components/LoadingSpinner';

const relationshipTypes = [
  { value: 'FATHER', label: 'Father', color: 'blue' },
  { value: 'MOTHER', label: 'Mother', color: 'pink' },
  { value: 'SPOUSE', label: 'Spouse', color: 'purple' },
  { value: 'CHILD', label: 'Child', color: 'green' },
  { value: 'SIBLING', label: 'Sibling', color: 'orange' },
];

export default function RelationshipsPage() {
  const { persons, fetchPersons, loading: personsLoading } = usePersons();
  const {
    relationships,
    fetchRelationships,
    createRelationship,
    deleteRelationship,
    loading,
  } = useRelationships();

  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    person_id: '',
    related_person_id: '',
    relationship_type: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    fetchPersons();
    fetchRelationships();
  }, [fetchPersons, fetchRelationships]);

  const getPersonById = (id) => {
    return persons.find((p) => p.id === id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteRelationship(deleteId);
      toast({
        title: 'Relationship deleted',
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
      onDeleteClose();
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    onDeleteOpen();
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.person_id) {
      errors.person_id = 'Please select a person';
    }
    if (!formData.related_person_id) {
      errors.related_person_id = 'Please select a related person';
    }
    if (!formData.relationship_type) {
      errors.relationship_type = 'Please select a relationship type';
    }
    if (formData.person_id === formData.related_person_id) {
      errors.related_person_id = 'Cannot create relationship with self';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createRelationship(formData);
      toast({
        title: 'Relationship created',
        description: 'The family relationship has been added.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setFormData({
        person_id: '',
        related_person_id: '',
        relationship_type: '',
      });
      onCreateClose();
    } catch (err) {
      toast({
        title: 'Failed to create relationship',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const openCreateModal = () => {
    setFormData({
      person_id: '',
      related_person_id: '',
      relationship_type: '',
    });
    setFormErrors({});
    onCreateOpen();
  };

  if (loading && relationships.length === 0) {
    return <LoadingSpinner message="Loading relationships..." />;
  }

  return (
    <Container maxW="container.xl">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" wrap="wrap" spacing={4}>
          <Box>
            <Heading size="lg">Family Relationships</Heading>
            <Text color="gray.500">{relationships.length} total relationships</Text>
          </Box>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="teal"
            onClick={openCreateModal}
            isDisabled={persons.length < 2}
          >
            Add Relationship
          </Button>
        </HStack>

        {persons.length < 2 && (
          <Card bg="orange.50" borderColor="orange.200" borderWidth={1}>
            <CardBody>
              <Text color="orange.700">
                You need at least 2 family members to create relationships.{' '}
                <Button
                  as={RouterLink}
                  to="/persons/new"
                  variant="link"
                  colorScheme="orange"
                >
                  Add a person
                </Button>
              </Text>
            </CardBody>
          </Card>
        )}

        {/* Table */}
        <Card>
          <CardBody p={0}>
            <TableContainer>
              <Table variant="simple">
                <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                  <Tr>
                    <Th>Person</Th>
                    <Th>Relationship</Th>
                    <Th>Related Person</Th>
                    <Th>Created</Th>
                    <Th width="80px">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {relationships.length === 0 ? (
                    <Tr>
                      <Td colSpan={5}>
                        <Box textAlign="center" py={8}>
                          <Text color="gray.500">No relationships created yet</Text>
                          {persons.length >= 2 && (
                            <Button
                              mt={4}
                              size="sm"
                              colorScheme="teal"
                              onClick={openCreateModal}
                            >
                              Create Your First Relationship
                            </Button>
                          )}
                        </Box>
                      </Td>
                    </Tr>
                  ) : (
                    relationships.map((rel) => {
                      const person = getPersonById(rel.person_id);
                      const relatedPerson = getPersonById(rel.related_person_id);
                      const relType = relationshipTypes.find(
                        (t) => t.value === rel.relationship_type
                      );

                      return (
                        <Tr key={rel.id}>
                          <Td>
                            <HStack spacing={3}>
                              <Avatar
                                size="sm"
                                name={
                                  person
                                    ? `${person.first_name} ${person.last_name}`
                                    : 'Unknown'
                                }
                                bg={person?.gender === 'MALE' ? 'blue.400' : 'pink.400'}
                              />
                              <Box>
                                <Text fontWeight="medium">
                                  {person
                                    ? `${person.first_name} ${person.last_name}`
                                    : 'Unknown Person'}
                                </Text>
                              </Box>
                            </HStack>
                          </Td>
                          <Td>
                            <HStack>
                              <Badge colorScheme={relType?.color || 'gray'}>
                                {rel.relationship_type}
                              </Badge>
                              <FiArrowRight color="gray" />
                            </HStack>
                          </Td>
                          <Td>
                            <HStack spacing={3}>
                              <Avatar
                                size="sm"
                                name={
                                  relatedPerson
                                    ? `${relatedPerson.first_name} ${relatedPerson.last_name}`
                                    : 'Unknown'
                                }
                                bg={
                                  relatedPerson?.gender === 'MALE'
                                    ? 'blue.400'
                                    : 'pink.400'
                                }
                              />
                              <Box>
                                <Text fontWeight="medium">
                                  {relatedPerson
                                    ? `${relatedPerson.first_name} ${relatedPerson.last_name}`
                                    : 'Unknown Person'}
                                </Text>
                              </Box>
                            </HStack>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="gray.500">
                              {new Date(rel.created_at).toLocaleDateString()}
                            </Text>
                          </Td>
                          <Td>
                            <IconButton
                              icon={<FiTrash2 />}
                              variant="ghost"
                              colorScheme="red"
                              size="sm"
                              onClick={() => confirmDelete(rel.id)}
                              aria-label="Delete relationship"
                            />
                          </Td>
                        </Tr>
                      );
                    })
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </VStack>

      {/* Create Relationship Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Family Relationship</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!formErrors.person_id} isRequired>
                <FormLabel>Person</FormLabel>
                <Select
                  name="person_id"
                  placeholder="Select person"
                  value={formData.person_id}
                  onChange={handleFormChange}
                >
                  {persons.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{formErrors.person_id}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formErrors.relationship_type} isRequired>
                <FormLabel>Is the _____ of</FormLabel>
                <Select
                  name="relationship_type"
                  placeholder="Select relationship"
                  value={formData.relationship_type}
                  onChange={handleFormChange}
                >
                  {relationshipTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{formErrors.relationship_type}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formErrors.related_person_id} isRequired>
                <FormLabel>Related Person</FormLabel>
                <Select
                  name="related_person_id"
                  placeholder="Select related person"
                  value={formData.related_person_id}
                  onChange={handleFormChange}
                >
                  {persons
                    .filter((p) => p.id !== formData.person_id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name}
                      </option>
                    ))}
                </Select>
                <FormErrorMessage>{formErrors.related_person_id}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCreateClose}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              onClick={handleCreateSubmit}
              isLoading={isSubmitting}
            >
              Create Relationship
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Relationship
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this relationship? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
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
