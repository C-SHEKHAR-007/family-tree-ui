import React, { useState } from 'react';
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
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  SimpleGrid,
  Divider,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSave, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../../hooks';

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    mobile: user?.mobile || '',
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Here you would call the API to update the profile
      // await userService.updateProfile(formData);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been saved successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
      // Refresh user data
      // await refreshProfile();
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      mobile: user?.mobile || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container maxW="container.md">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg">My Profile</Heading>
          <Text color="gray.500">Manage your account settings</Text>
        </Box>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md">Personal Information</Heading>
              {!isEditing && (
                <Button
                  leftIcon={<FiEdit2 />}
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              )}
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={6} align="stretch">
              {/* Avatar Section */}
              <HStack spacing={4}>
                <Avatar
                  size="xl"
                  name={`${user?.first_name} ${user?.last_name}`}
                  bg="teal.500"
                />
                <Box>
                  <Text fontWeight="bold" fontSize="xl">
                    {user?.first_name} {user?.last_name}
                  </Text>
                  <Text color="gray.500">{user?.email}</Text>
                  <Badge colorScheme="teal" mt={1}>
                    {user?.role}
                  </Badge>
                </Box>
              </HStack>

              <Divider />

              {/* Form Fields */}
              {isEditing ? (
                <VStack spacing={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                    <FormControl isInvalid={!!errors.first_name} isRequired>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.first_name}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.last_name} isRequired>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                      <FormErrorMessage>{errors.last_name}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl>
                    <FormLabel>Mobile</FormLabel>
                    <Input
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="+1234567890"
                    />
                  </FormControl>

                  <HStack spacing={4} w="100%" justify="flex-end" pt={4}>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      leftIcon={<FiSave />}
                      colorScheme="teal"
                      onClick={handleSave}
                      isLoading={isSaving}
                    >
                      Save Changes
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      First Name
                    </Text>
                    <Text fontWeight="medium">{user?.first_name}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Last Name
                    </Text>
                    <Text fontWeight="medium">{user?.last_name}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Email
                    </Text>
                    <Text fontWeight="medium">{user?.email}</Text>
                  </Box>
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
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Role
                    </Text>
                    <Badge colorScheme="teal">{user?.role}</Badge>
                  </Box>
                </SimpleGrid>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Account Info Card */}
        <Card>
          <CardHeader>
            <Heading size="md">Account Information</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Account Created
                </Text>
                <Text fontWeight="medium">{formatDate(user?.created_at)}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Last Updated
                </Text>
                <Text fontWeight="medium">{formatDate(user?.updated_at)}</Text>
              </Box>
              {user?.person_id && (
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Linked Person ID
                  </Text>
                  <Text fontWeight="medium" fontSize="sm">
                    {user.person_id}
                  </Text>
                </Box>
              )}
              {user?.family_root_id && (
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Family Root ID
                  </Text>
                  <Text fontWeight="medium" fontSize="sm">
                    {user.family_root_id}
                  </Text>
                </Box>
              )}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Security Card */}
        <Card>
          <CardHeader>
            <Heading size="md">Security</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="medium">Password</Text>
                  <Text fontSize="sm" color="gray.500">
                    Last changed: Unknown
                  </Text>
                </Box>
                <Button variant="outline" size="sm" isDisabled>
                  Change Password
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}
