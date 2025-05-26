'use client';

import {
  Box,
  Flex,
  Text,
  Heading,
  Avatar,
  AvatarBadge,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack,
  Image,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { IoMenu } from 'react-icons/io5';
import { BsCart4 } from "react-icons/bs";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from '@/utils/axios';

export default function PerfilPage() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast({
            title: 'Acesso negado',
            description: 'Por favor, faça login para acessar o perfil.',
            status: 'warning',
            duration: 4000,
            isClosable: true,
          });
          router.push('/login'); // Redirecionar para login se o token não existir
          return;
        }

        const response = await axios.get('/user/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.data);
      } catch (error) {
        toast({
          title: 'Erro ao carregar perfil',
          description: error.response?.data?.message || 'Não foi possível carregar as informações do usuário.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        router.push('/login'); // Redirecionar para login em caso de erro
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [toast, router]);

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#1a202c">
        <Spinner size="xl" color="white" />
      </Flex>
    );
  }

  if (!user) {
    return null; // Retornar nulo se o usuário não estiver carregado
  }

  return (
    <Box minH="100vh" bg="#1a202c" p={{ base: 4, md: 6 }} position="relative">
      {/* Botão de Menu e Ícone de Carrinho no canto superior esquerdo */}
      <HStack position="absolute" top={4} left={4} spacing={4} zIndex="dropdown">
        <Menu>
          <MenuButton as={IconButton} icon={<IoMenu />} variant="outline" colorScheme="whiteAlpha" />
          <MenuList bg="#2d3748" borderColor="gray.700">
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => router.push('/home')}
            >
              Home
            </MenuItem>
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => console.log('Acessar Produtos')}
            >
              Produtos
            </MenuItem>
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => console.log('Acessar Pedidos')}
            >
              Pedidos
            </MenuItem>
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => console.log('Endereços')}
            >
              Endereços
            </MenuItem>
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => router.push('/perfil')}
            >
              Perfil
            </MenuItem>
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => console.log('Excluir Conta')}
            >
              Excluir Conta
            </MenuItem>
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => console.log('Sair')}
            >
              Sair
            </MenuItem>
          </MenuList>
        </Menu>
        <IconButton
          icon={<BsCart4 />}
          aria-label="Carrinho"
          variant="outline"
          colorScheme="whiteAlpha"
          onClick={() => console.log('Abrir Carrinho')}
        />
      </HStack>

      {/* Card para a logo no canto superior direito */}
      <Box
        position="absolute"
        top={4}
        right={4}
        bg="#4a5568"
        p={0}
        borderRadius="full"
        boxShadow="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image src="/images/logo_transparente.png" alt="Logo" boxSize="120px" objectFit="contain" />
      </Box>

      {/* Perfil */}
      <Flex direction="column" align="center" justify="center" w="100%">
        <Box bg="#2d3748" p={{ base: 4, md: 8 }} rounded="lg" shadow="xl" w={{ base: '95%', md: '600px' }} maxW="600px">
          <Flex justify="center" mb={6}>
            <Avatar
              size="2xl"
              name={user?.name}
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=random&size=150`}
            >
              <AvatarBadge boxSize="1em" bg="green.500" borderColor="white" />
            </Avatar>
          </Flex>
          <VStack spacing={5} align="stretch">
            <Heading size="lg" textAlign="center" mb={2} color="white">
              Perfil de Usuário
            </Heading>
            <Box>
              <Text fontWeight="bold" color="white">Nome:</Text>
              <Text color="gray.300">{user?.name || 'Não informado'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="white">Usuário:</Text>
              <Text color="gray.300">{user?.username || 'Não informado'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="white">Email:</Text>
              <Text color="gray.300">{user?.email || 'Não informado'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="white">CPF:</Text>
              <Text color="gray.300">{user?.cpf || 'Não informado'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="white">Telefone:</Text>
              <Text color="gray.300">{user?.phone || 'Não informado'}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" color="white">Tipo de Usuário:</Text>
              <Text color="gray.300">{user?.role || 'Não informado'}</Text>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}