import React from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Avatar,
  Text,
  Container,
  Badge,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon, SettingsIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiHome, FiUsers, FiGitBranch, FiLink, FiShield } from 'react-icons/fi';
import { useAuth } from '../../hooks';
import { getRoleDisplayName, getRoleColor } from '../../utils/permissions';

const NavLink = ({ children, to }) => {
  return (
    <Button
      as={RouterLink}
      to={to}
      variant="ghost"
      size="sm"
      fontWeight="medium"
    >
      {children}
    </Button>
  );
};

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColor = user ? getRoleColor(user.role) : 'gray';
  const roleDisplayName = user ? getRoleDisplayName(user.role) : '';

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} px={4} boxShadow="sm">
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          
          <HStack spacing={8} alignItems="center">
            <Box fontWeight="bold" fontSize="xl" color="teal.500">
              <RouterLink to="/">FamilyTree</RouterLink>
            </Box>
            
            {isAuthenticated && (
              <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
                <NavLink to="/dashboard">
                  <HStack spacing={1}>
                    <FiHome />
                    <Text>Dashboard</Text>
                  </HStack>
                </NavLink>
                <NavLink to="/persons">
                  <HStack spacing={1}>
                    <FiUsers />
                    <Text>Persons</Text>
                  </HStack>
                </NavLink>
                <NavLink to="/family-tree">
                  <HStack spacing={1}>
                    <FiGitBranch />
                    <Text>Family Tree</Text>
                  </HStack>
                </NavLink>
                <NavLink to="/relationships">
                  <HStack spacing={1}>
                    <FiLink />
                    <Text>Relationships</Text>
                  </HStack>
                </NavLink>
              </HStack>
            )}
          </HStack>

          <Flex alignItems="center">
            <HStack spacing={3}>
              <IconButton
                size="md"
                variant="ghost"
                aria-label="Toggle Color Mode"
                onClick={toggleColorMode}
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              />
              
              {isAuthenticated ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded="full"
                    variant="link"
                    cursor="pointer"
                    minW={0}
                  >
                    <Avatar
                      size="sm"
                      name={user ? `${user.first_name} ${user.last_name}` : 'User'}
                      bg="teal.500"
                    />
                  </MenuButton>
                  <MenuList>
                    <Box px={4} py={2}>
                      <Text fontWeight="medium">{user?.first_name} {user?.last_name}</Text>
                      <Text fontSize="sm" color="gray.500">{user?.email}</Text>
                      <Badge colorScheme={roleColor} fontSize="xs" mt={1}>
                        {roleDisplayName}
                      </Badge>
                    </Box>
                    <MenuDivider />
                    <MenuItem as={RouterLink} to="/profile" icon={<FiUser />}>
                      Profile
                    </MenuItem>
                    {isAdmin && (
                      <>
                        <MenuDivider />
                        <MenuItem as={RouterLink} to="/admin/users" icon={<FiShield />}>
                          Admin Panel
                        </MenuItem>
                      </>
                    )}
                    <MenuDivider />
                    <MenuItem onClick={handleLogout} icon={<FiLogOut />} color="red.500">
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <HStack spacing={2}>
                  <Button
                    as={RouterLink}
                    to="/login"
                    variant="ghost"
                    size="sm"
                  >
                    Login
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/register"
                    colorScheme="teal"
                    size="sm"
                  >
                    Register
                  </Button>
                </HStack>
              )}
            </HStack>
          </Flex>
        </Flex>

        {/* Mobile menu */}
        {isOpen && isAuthenticated && (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as="nav" spacing={4}>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/persons">Persons</NavLink>
              <NavLink to="/family-tree">Family Tree</NavLink>
              <NavLink to="/relationships">Relationships</NavLink>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
}
