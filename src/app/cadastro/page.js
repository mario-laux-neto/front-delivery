'use client';

import { useState } from 'react';
import {
  Flex,
  Box,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Stack,
  Text,
  Link,
  useToast,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function CadastroPage() {
  const toast = useToast();
  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    name: '',
    cpf: '',
    phone: '',
    email: '',
    password: '',
    role: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await api.post('/cadastros', form);

      if (response.status === 201) {
        toast({
          title: 'Cadastro realizado!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setForm({
          username: '',
          name: '',
          cpf: '',
          phone: '',
          email: '',
          password: '',
          role: '',
        });
        router.push('/login');
      } else {
        toast({
          title: 'Erro ao cadastrar',
          description: response.data?.message || 'Verifique os campos',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro no servidor',
        description: error.response?.data?.message || 'Tente novamente mais tarde.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      px={4}
      bg="#1a202c" // Alterado para a mesma cor de fundo das outras páginas
    >
      <Box
        bg="#2d3748" // Cor do card
        p={8}
        rounded="md"
        shadow="md"
        w={{ base: '100%', sm: '500px' }}
      >
        <Heading mb={6} textAlign="center" size="lg" color="white">
          Cadastro de Usuário
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="white">Nome completo</FormLabel>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                bg="#4a5568"
                border="none"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _hover={{ bg: "#2d3748" }}
                _focus={{ bg: "#2d3748" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="white">Usuário</FormLabel>
              <Input
                name="username"
                value={form.username}
                onChange={handleChange}
                bg="#4a5568"
                border="none"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _hover={{ bg: "#2d3748" }}
                _focus={{ bg: "#2d3748" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="white">CPF</FormLabel>
              <Input
                name="cpf"
                value={form.cpf}
                onChange={handleChange}
                bg="#4a5568"
                border="none"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _hover={{ bg: "#2d3748" }}
                _focus={{ bg: "#2d3748" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="white">Telefone</FormLabel>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                bg="#4a5568"
                border="none"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _hover={{ bg: "#2d3748" }}
                _focus={{ bg: "#2d3748" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="white">Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                bg="#4a5568"
                border="none"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _hover={{ bg: "#2d3748" }}
                _focus={{ bg: "#2d3748" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="white">Senha</FormLabel>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                bg="#4a5568"
                border="none"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _hover={{ bg: "#2d3748" }}
                _focus={{ bg: "#2d3748" }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="white">Tipo de Usuário</FormLabel>
              <Input
                as="select"
                name="role"
                value={form.role}
                onChange={handleChange}
                bg="#4a5568"
                border="none"
                color="white"
                _hover={{ bg: "#2d3748" }}
                _focus={{ bg: "#2d3748" }}
              >
                <option value="">Selecione...</option>
                <option value="cliente">Cliente</option>
                <option value="entregador">Entregador</option>
                <option value="restaurante">Restaurante</option>
              </Input>
            </FormControl>

            <Button type="submit" colorScheme="teal" mt={4}>
              Cadastrar
            </Button>
          </Stack>
        </form>

        <Text mt={4} textAlign="center" color="white">
          Já tem uma conta?{' '}
          <Link as={NextLink} href="/login" color="teal.300">
            Faça login
          </Link>
        </Text>
      </Box>
    </Flex>
  );
}
