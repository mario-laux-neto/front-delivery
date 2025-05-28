"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  useColorMode,
  VStack,
  HStack,
  Avatar,
  FormControl,
  FormLabel,
  Input,
  Divider,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import api from "@/utils/axios.js";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";

export default function Perfil() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const cancelRef = React.useRef();
  
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    cpf: "",
  });
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Carregar dados do usuário
    fetchUserData(token);
  }, [router]);

  const fetchUserData = async (token) => {
    try {
      const response = await api.get("/user/:id", {
        headers: {
          Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
        },
      });

      if (response.status === 200) {
        setUserData(response.data);
        setFormData({
          name: response.data.name,
          username: response.data.username,
          email: response.data.email,
          phone: response.data.phone,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: error.response?.data?.message || "Erro inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar senha nova
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A nova senha e a confirmação devem ser iguais",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      // Simulando atualização para desenvolvimento
      // Em produção, descomentar a requisição abaixo
      // const response = await api.put("/user/profile", {
      //   name: formData.name,
      //   username: formData.username,
      //   email: formData.email,
      //   phone: formData.phone,
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword || undefined,
      // });
      
      // Simulando sucesso
      setUserData({
        ...userData,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
      });
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
      
      // Limpar campos de senha
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.response?.data?.message || "Erro inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Simulando exclusão para desenvolvimento
      // Em produção, descomentar a requisição abaixo
      // const response = await api.delete("/user/profile");
      
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Limpar localStorage e redirecionar para login
      localStorage.removeItem("token");
      localStorage.removeItem("cart");
      router.push("/login");
    } catch (error) {
      toast({
        title: "Erro ao excluir conta",
        description: error.response?.data?.message || "Erro inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsDeleteAlertOpen(false);
    }
  };

  return (
    <>
      <Box minH="100vh" bg={colorMode === "dark" ? "#1a202c" : "gray.50"} p={4}>
        <Box maxW="1200px" mx="auto" pt={8}>
          <Heading size="lg" mb={6} color={colorMode === "dark" ? "white" : "gray.700"}>
            Meu Perfil
          </Heading>
          <Button 
            colorScheme="teal" 
            mb={4} 
            onClick={() => router.push("/home")}
          >
            Voltar
          </Button>
          <Flex 
            direction={{ base: "column", md: "row" }} 
            gap={8}
            bg={colorMode === "dark" ? "#2d3748" : "white"}
            p={6}
            borderRadius="lg"
            boxShadow="md"
          >
            {/* Lado esquerdo - Avatar e informações básicas */}
            <VStack 
              spacing={4} 
              align="center" 
              flex="1"
              p={4}
              bg={colorMode === "dark" ? "#1a202c" : "gray.50"}
              borderRadius="md"
            >
              <Avatar 
                size="2xl" 
                name={userData.name} 
                src="/images/avatar-placeholder.png"
                mb={2}
                icon={<FaUser size={64} />}
              />
              <Heading size="md" color={colorMode === "dark" ? "white" : "gray.700"}>
                {userData.name}
              </Heading>
              <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                @{userData.username}
              </Text>
              <Button 
                colorScheme="teal" 
                variant="outline" 
                onClick={onOpen}
                w="full"
                leftIcon={<FaEdit />}
              >
                Editar Perfil
              </Button>
              <Button 
                colorScheme="red" 
                variant="outline" 
                onClick={() => setIsDeleteAlertOpen(true)}
                w="full"
                leftIcon={<FaTrash />}
              >
                Excluir Conta
              </Button>
            </VStack>

            {/* Lado direito - Detalhes do perfil */}
            <VStack 
              spacing={4} 
              align="stretch" 
              flex="2"
            >
              <Heading size="md" mb={2} color={colorMode === "dark" ? "white" : "gray.700"}>
                Informações Pessoais
              </Heading>
              
              <HStack>
                <Text fontWeight="bold" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                  Nome:
                </Text>
                <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                  {userData.name}
                </Text>
              </HStack>
              
              <HStack>
                <Text fontWeight="bold" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                  Usuário:
                </Text>
                <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                  {userData.username}
                </Text>
              </HStack>
              
              <HStack>
                <Text fontWeight="bold" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                  Email:
                </Text>
                <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                  {userData.email}
                </Text>
              </HStack>
              
              <HStack>
                <Text fontWeight="bold" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                  Telefone:
                </Text>
                <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                  {userData.phone}
                </Text>
              </HStack>
              
              <HStack>
                <Text fontWeight="bold" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                  CPF:
                </Text>
                <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                  {userData.cpf}
                </Text>
              </HStack>
              
              <Divider my={4} />
              
              <Heading size="md" mb={2} color={colorMode === "dark" ? "white" : "gray.700"}>
                Ações Rápidas
              </Heading>
              
              <HStack spacing={4}>
                <Button 
                  colorScheme="teal" 
                  onClick={() => router.push("/pedidos")}
                >
                  Meus Pedidos
                </Button>
                <Button 
                  colorScheme="teal" 
                  variant="outline"
                  onClick={() => router.push("/enderecos")}
                >
                  Meus Endereços
                </Button>
              </HStack>
            </VStack>
          </Flex>
        </Box>

        {/* Modal de edição de perfil */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent bg={colorMode === "dark" ? "#2d3748" : "white"}>
            <ModalHeader color={colorMode === "dark" ? "white" : "gray.700"}>
              Editar Perfil
            </ModalHeader>
            <ModalCloseButton color={colorMode === "dark" ? "white" : "gray.700"} />
            
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                      Nome
                    </FormLabel>
                    <Input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      bg={colorMode === "dark" ? "#4a5568" : "white"}
                      color={colorMode === "dark" ? "white" : "black"}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                      Usuário
                    </FormLabel>
                    <Input 
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      bg={colorMode === "dark" ? "#4a5568" : "white"}
                      color={colorMode === "dark" ? "white" : "black"}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                      Email
                    </FormLabel>
                    <Input 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      bg={colorMode === "dark" ? "#4a5568" : "white"}
                      color={colorMode === "dark" ? "white" : "black"}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                      Telefone
                    </FormLabel>
                    <Input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      bg={colorMode === "dark" ? "#4a5568" : "white"}
                      color={colorMode === "dark" ? "white" : "black"}
                    />
                  </FormControl>
                  
                  <Divider my={2} />
                  
                  <Heading size="sm" alignSelf="flex-start" color={colorMode === "dark" ? "white" : "gray.700"}>
                    Alterar Senha (opcional)
                  </Heading>
                  
                  <FormControl>
                    <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                      Senha Atual
                    </FormLabel>
                    <Input 
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      bg={colorMode === "dark" ? "#4a5568" : "white"}
                      color={colorMode === "dark" ? "white" : "black"}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                      Nova Senha
                    </FormLabel>
                    <Input 
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      bg={colorMode === "dark" ? "#4a5568" : "white"}
                      color={colorMode === "dark" ? "white" : "black"}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                      Confirmar Nova Senha
                    </FormLabel>
                    <Input 
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      bg={colorMode === "dark" ? "#4a5568" : "white"}
                      color={colorMode === "dark" ? "white" : "black"}
                    />
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button colorScheme="teal" type="submit">
                  Salvar Alterações
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>

        {/* Alerta de confirmação para excluir conta */}
        <AlertDialog
          isOpen={isDeleteAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsDeleteAlertOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent bg={colorMode === "dark" ? "#2d3748" : "white"}>
              <AlertDialogHeader fontSize="lg" fontWeight="bold" color={colorMode === "dark" ? "white" : "gray.700"}>
                Excluir Conta
              </AlertDialogHeader>

              <AlertDialogBody color={colorMode === "dark" ? "white" : "gray.700"}>
                Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                  Cancelar
                </Button>
                <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                  Excluir
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </>
  );
}
