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

export default function MotoboyLogin() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMotoboy = async () => {
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
      const response = await axios.post("/motoboy/login", {
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
        localStorage.setItem("userType", "motoboy");
        router.push("/motoboy"); // Redireciona para a página de motoboy
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
        bg="#2d3748"
        borderRadius="lg"
        boxShadow="lg"
        overflow="hidden"
        w={{ base: "90%", md: "800px" }}
      >
        {/* Lado da logo */}
        <Box
          bg="#4a5568"
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
              Área do Entregador
            </Heading>
            <Text color="gray.300" textAlign="center">
              Faça login para acessar suas entregas
            </Text>

            <form onSubmit={(e) => { e.preventDefault(); loginMotoboy(); }}>
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
                  _hover={{ opacity: 0.9 }}
                >
                  Entrar como Entregador
                </Button>

                <Button
                  variant="outline"
                  colorScheme="teal"
                  w="full"
                  onClick={() => router.push("/login")}
                  _hover={{ opacity: 0.9 }}
                >
                  Voltar para Login de Cliente
                </Button>
              </Stack>
            </form>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}
