"use client";

import {
  Box,
  Flex,
  VStack,
  Image,
  Heading,
  Text,
  Button,
  Input,
  useToast,
  FormControl,
  FormLabel,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";

export default function Login() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUsuario = async () => {
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios.",
        description: "Por favor, preencha e-mail e senha.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.post("/user/login", {
        email,
        password,
      });

      if (response.status === 200) {
        toast({
          title: "Login realizado com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        localStorage.setItem("token", response.data.response);
        router.push("/home"); // Redireciona para a página home
      } else {
        toast({
          title: "Erro ao fazer login",
          description: response.data?.message || "Credenciais inválidas",
          status: "error",
          duration: 4000,
          isClosable: true,
        }); 
      }
    } catch (error) {
      toast({
        title: "Erro no servidor",
        description: error.response?.data?.message || "Erro inesperado.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex minH="100vh" bg="#1a202c" align="center" justify="center">
      <Flex
        bg="#2d3748" // Cor do card
        borderRadius="lg"
        boxShadow="lg"
        overflow="hidden"
        w={{ base: "90%", md: "800px" }}
      >
        {/* Lado da logo */}
        <Box
          bg="#4a5568" // Cor do fundo da logo
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          justifyContent="center"
          w="50%"
          p={6}
        >
          <Image src="/images/logo.jpeg" alt="Logo" maxW="350px" />
        </Box>

        {/* Lado do formulário */}
        <Box w={{ base: "100%", md: "50%" }} p={8}>
          <VStack spacing={6} align="stretch">
            <Heading color="white" textAlign="center">
              Bem-vindo
            </Heading>
            <Text color="gray.300" textAlign="center">
              Faça login para acessar o sistema
            </Text>

            <form onSubmit={loginUsuario}>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="white">Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="#4a5568"
                    border="none"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    _hover={{ bg: "#2d3748" }}
                    _focus={{ bg: "#2d3748" }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="white">Senha</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="#4a5568"
                    border="none"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                    _hover={{ bg: "#2d3748" }}
                    _focus={{ bg: "#2d3748" }}
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="teal"
                  mt={4}
                  w="full"
                  onClick={loginUsuario}
                  _hover={{ opacity: 0.9 }}
                >
                  Entrar
                </Button>
                <Button
                  colorScheme="teal"
                  w="full"
                  onClick={() => router.push("/cadastro")}
                  _hover={{ opacity: 0.9 }}
                >
                  Cadastre-se
                </Button>
              </Stack>
            </form>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}
