"use client";

import {
  Box,
  Button,
  Flex,
  Stack,
  Image,
  Text,
  Input,
  InputGroup,
  IconButton,
  Link,
  Checkbox,
  InputRightElement,
  FormControl,
  FormLabel,
  useColorModeValue,
} from "@chakra-ui/react";
import { Divider } from "@chakra-ui/layout"; // Pode manter ou importar de chakra/react se preferir
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <Flex minH="100vh" bg={bgColor}>
      {/* Lado esquerdo com imagem */}
      <Flex
        flex={1}
        align="center"
        justify="center"
        bgGradient="linear(to-br, purple.600, blue.500)"
        display={{ base: "none", md: "flex" }}
      >
        <Image
          src="https://source.unsplash.com/random/600x800?tech"
          alt="Login Image"
          objectFit="cover"
          w="full"
          h="full"
        />
      </Flex>

      {/* Formulário de login */}
      <Flex flex={1} align="center" justify="center" p={8}>
        <Box bg={cardBg} p={8} rounded="lg" boxShadow="lg" w="full" maxW="md">
          <Stack spacing={6}>
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold">
                Acesse sua conta
              </Text>
            </Box>

            {/* Opções de login social */}
            <Stack spacing={4}>
              <Button
                leftIcon={<FcGoogle size={20} />}
                variant="outline"
                colorScheme="gray"
              >
                Entrar com Google
              </Button>
              <Button
                leftIcon={<FaGithub size={20} />}
                variant="outline"
                colorScheme="gray"
              >
                Entrar com GitHub
              </Button>
            </Stack>

            <Divider my={4} />

            {/* Formulário de login tradicional */}
            <form>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>E-mail</FormLabel>
                  <Input
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>

                <FormControl id="password">
                  <FormLabel>Senha</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        aria-label={
                          showPassword ? "Ocultar senha" : "Mostrar senha"
                        }
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Flex justify="space-between" align="center">
                  <Checkbox
                    isChecked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  >
                    Lembrar de mim
                  </Checkbox>
                  <Link color="blue.500" fontSize="sm">
                    Esqueci minha senha
                  </Link>
                </Flex>

                <Button
                  type="submit"
                  colorScheme="blue"
                  w="full"
                  fontWeight="bold"
                >
                  Entrar
                </Button>
              </Stack>
            </form>

            <Text textAlign="center" fontSize="sm">
              Não tem uma conta?{" "}
              <Link color="blue.500" fontWeight="medium">
                Crie a sua conta
              </Link>
            </Text>
          </Stack>
        </Box>
      </Flex>
    </Flex>
  );
}
