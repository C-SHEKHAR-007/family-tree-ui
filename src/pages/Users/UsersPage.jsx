import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  VStack,
  HStack,
  Card,
  CardBody,
  useToast,
  SimpleGrid,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { AddIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useUsers } from '../../hooks';
import { useAuth } from '../../hooks';

// Role badge colors
const roleBadgeColors = {
  SUPER_ADMIN: 'red',
  FAMILY_ADMIN: 'purple',
  admin: 'purple',
  member: 'blue',
  viewer: 'green',
};

export default function UsersPage() {
  const { users, loading, error, fetchUsers, createUser } = useUsers();
  const { user: currentUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Get available roles based on current user's role
  const getAvailableRoles = () => {
    if (currentUser?.role === 'SUPER_ADMIN') {
      return [{ value: 'FAMILY_ADMIN', label: 'Family Admin' }];
    }
    // FAMILY_ADMIN can create member and viewer
    return [
      { value: 'member', label: 'Member' },
      { value: 'viewer', label: 'Viewer' },
    ];
  };

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Check if user can create users
  const canCreateUsers = currentUser?.role === 'FAMILY_ADMIN' || 
                         currentUser?.role === 'admin' || 
                         currentUser?.role === 'SUPER_ADMIN';


  // Handle button click
  const handleAddUser = () => {
    console.log('Add User button clicked');
    setFormData(prev => ({ ...prev, role: '' }));
    onOpen();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.role) {
      errors.role = 'Role is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await createUser(submitData);
      
      toast({
        title: 'User created successfully',
        description: `${formData.first_name} ${formData.last_name} has been added as ${formData.role}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Reset form and close modal
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        role: '',
      });
      onClose();
      fetchUsers(); // Refresh the list
    } catch (err) {
      toast({
        title: 'Failed to create user',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      role: '',
    });
    setFormErrors({});
    onClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="lg">User Management</Heading>
            <Text color="gray.500">
              {currentUser?.role === 'SUPER_ADMIN'
                ? 'Manage all users across all family trees'
                : 'Manage members of your family tree'}
            </Text>
          </Box>
          {canCreateUsers && (
            <Button
              leftIcon={<AddIcon />}
              colorScheme="green"
              onClick={handleAddUser}
            >
              Add User
            </Button>
          )}
        </HStack>

        {/* Error Alert */}
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Users Table */}
        <Card>
          <CardBody>
            {loading ? (
              <Box textAlign="center" py={10}>
                <Spinner size="xl" color="green.500" />
                <Text mt={4} color="gray.500">Loading users...</Text>
              </Box>
            ) : users.length === 0 ? (
              <Box textAlign="center" py={10}>
                <Text color="gray.500" fontSize="lg">
                  No users found.
                </Text>
                {canCreateUsers && (
                  <Button
                    mt={4}
                    leftIcon={<AddIcon />}
                    colorScheme="green"
                    onClick={handleAddUser}
                  >
                    Add Your First User
                  </Button>
                )}
              </Box>
            ) : (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Username</Th>
                      <Th>Role</Th>
                      <Th>Created</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map((user) => (
                      <Tr key={user.id}>
                        <Td fontWeight="medium">
                          {user.first_name} {user.last_name}
                        </Td>
                        <Td>{user.email}</Td>
                        <Td>{user.username}</Td>
                        <Td>
                          <Badge colorScheme={roleBadgeColors[user.role] || 'gray'}>
                            {user.role}
                          </Badge>
                        </Td>
                        <Td>{formatDate(user.created_at)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </CardBody>
        </Card>

        {/* Create User Modal */}
        <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {currentUser?.role === 'SUPER_ADMIN'
                ? 'Create New Family Admin'
                : 'Add Family Member'}
            </ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <VStack spacing={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                    <FormControl isInvalid={!!formErrors.first_name} isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        name="first_name"
                        placeholder="Enter first name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{formErrors.first_name}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!formErrors.last_name} isRequired>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        name="last_name"
                        placeholder="Enter last name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{formErrors.last_name}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isInvalid={!!formErrors.email} isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{formErrors.email}</FormErrorMessage>
                  </FormControl>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                    <FormControl isInvalid={!!formErrors.username} isRequired>
                      <FormLabel>Username</FormLabel>
                      <Input
                        name="username"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{formErrors.username}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Mobile (Optional)</FormLabel>
                      <Input
                        name="mobile"
                        placeholder="Enter mobile number"
                        value={formData.mobile}
                        onChange={handleChange}
                      />
                    </FormControl>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                    <FormControl isInvalid={!!formErrors.password} isRequired>
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <InputRightElement>
                          <IconButton
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{formErrors.password}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!formErrors.confirmPassword} isRequired>
                      <FormLabel>Confirm Password</FormLabel>
                      <InputGroup>
                        <Input
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        <InputRightElement>
                          <IconButton
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{formErrors.confirmPassword}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl isInvalid={!!formErrors.role} isRequired>
                    <FormLabel>Role</FormLabel>
                    <Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="Select a role"
                    >
                      {getAvailableRoles().map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>{formErrors.role}</FormErrorMessage>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      {currentUser?.role === 'SUPER_ADMIN'
                        ? 'Family Admin will have their own family tree'
                        : formData.role === 'member'
                        ? 'Members can view and edit the family tree'
                        : 'Viewers can only view the family tree'}
                    </Text>
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="green"
                  isLoading={isSubmitting}
                  loadingText="Creating..."
                >
                  Create User
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}
