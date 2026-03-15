import React, { useEffect, useState } from 'react';
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  SimpleGrid,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { personService } from '../../services';
import { usePersons } from '../../hooks';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function PersonEdit() {
  const { id } = useParams();
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { updatePerson } = usePersons();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const loadPerson = async () => {
      try {
        const person = await personService.getById(id);
        setFormData({
          first_name: person.first_name || '',
          last_name: person.last_name || '',
          gender: person.gender || '',
          date_of_birth: person.date_of_birth ? person.date_of_birth.split('T')[0] : '',
          mobile: person.mobile || '',
          email: person.email || '',
          birth_place: person.birth_place || '',
        });
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
    loadPerson();
  }, [id, navigate, toast]);

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

    setIsSaving(true);
    try {
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

      await updatePerson(id, submitData);
      toast({
        title: 'Person updated',
        description: 'Changes have been saved successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/persons');
    } catch (error) {
      toast({
        title: 'Failed to update person',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading person details..." />;
  }

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
            <BreadcrumbLink>Edit</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <Box>
          <Heading size="lg">Edit Family Member</Heading>
          <Text color="gray.500">
            Update the details for {formData.first_name} {formData.last_name}
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
                    isLoading={isSaving}
                    loadingText="Saving..."
                  >
                    Save Changes
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
