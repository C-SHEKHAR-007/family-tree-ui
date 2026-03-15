import React, { useState } from 'react';
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
  Textarea,
  VStack,
  HStack,
  Card,
  CardBody,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { usePersons } from '../../hooks';

export default function PersonCreate() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    mobile: '',
    email: '',
    birth_place: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { createPerson } = usePersons();
  const navigate = useNavigate();
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
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Clean up empty fields
      const submitData = { ...formData };
      Object.keys(submitData).forEach((key) => {
        if (submitData[key] === '') {
          if (key === 'date_of_birth') {
            delete submitData[key];
          } else if (['mobile', 'email', 'birth_place'].includes(key)) {
            submitData[key] = null;
          }
        }
      });

      const newPerson = await createPerson(submitData);
      toast({
        title: 'Person created',
        description: `${newPerson.first_name} ${newPerson.last_name} has been added to your family tree.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/persons');
    } catch (error) {
      toast({
        title: 'Failed to create person',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md">
      <VStack spacing={6} align="stretch">
        {/* Breadcrumb */}
        <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/persons">
              Persons
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Add New</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <Box>
          <Heading size="lg">Add New Family Member</Heading>
          <Text color="gray.500">
            Fill in the details below to add a new person to your family tree.
          </Text>
        </Box>

        {/* Form */}
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
                  <FormControl isInvalid={!!errors.first_name} isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      name="first_name"
                      placeholder="Enter first name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.first_name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.last_name} isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      name="last_name"
                      placeholder="Enter last name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.last_name}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
                  <FormControl isInvalid={!!errors.gender} isRequired>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      name="gender"
                      placeholder="Select gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </Select>
                    <FormErrorMessage>{errors.gender}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Date of Birth</FormLabel>
                    <Input
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                    />
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Mobile</FormLabel>
                    <Input
                      name="mobile"
                      placeholder="+1234567890"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Birth Place</FormLabel>
                  <Input
                    name="birth_place"
                    placeholder="City, Country"
                    value={formData.birth_place}
                    onChange={handleChange}
                  />
                </FormControl>

                <HStack spacing={4} w="100%" justify="flex-end" pt={4}>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/persons')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="teal"
                    isLoading={isLoading}
                    loadingText="Creating..."
                  >
                    Create Person
                  </Button>
                </HStack>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}
