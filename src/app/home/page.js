"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  HStack,
  Text,
  Image,
  useDisclosure,
  Badge,
  useColorMode,
  Button,
  useToast
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { 
  HamburgerIcon, 
  SunIcon, 
  MoonIcon, 
  ShoppingCartIcon 
} from "@chakra-ui/icons";
import { 
  FaHome, 
  FaTicketAlt, 
  FaUtensils, 
  FaClipboardList, 
  FaMapMarkerAlt, 
  FaUser, 
  FaSignOutAlt,
  FaShoppingCart
} from "react-icons/fa";

const MainLayout = ({ children, cartItemCount = 0 }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const toast = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("cliente"); // cliente, admin, motoboy

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Aqui você pode decodificar o token JWT para obter o tipo de usuário
      // Por enquanto, vamos assumir que é um cliente
      setUserType("cliente");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
    toast({
      title: "Logout realizado com sucesso!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const menuItems = [
    { name: "Home", icon: <FaHome />, path: "/home", roles: ["cliente", "admin", "motoboy"] },
    { name: "Cupons", icon: <FaTicketAlt />, path: "/cupons", roles: ["cliente"] },
    { name: "Produtos", icon: <FaUtensils />, path: "/produtos", roles: ["cliente", "admin"] },
    { name: "Pedidos", icon: <FaClipboardList />, path: "/pedidos", roles: ["cliente", "admin", "motoboy"] },
    { name: "Endereços", icon: <FaMapMarkerAlt />, path: "/enderecos", roles: ["cliente"] },
    { name: "Perfil", icon: <FaUser />, path: "/perfil", roles: ["cliente", "admin", "motoboy"] },
  ];

  // Filtrar itens de menu com base no tipo de usuário
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userType));

  return (
    <Box minH="100vh" bg={colorMode === "dark" ? "#1a202c" : "gray.50"}>
      {/* Header */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding={4}
        bg={colorMode === "dark" ? "#2d3748" : "teal.500"}
        color="white"
        position="fixed"
        width="100%"
        zIndex="1000"
      >
        <Flex align="center">
          <IconButton
            icon={<HamburgerIcon />}
            variant="outline"
            onClick={onOpen}
            aria-label="Menu"
            mr={3}
          />
          <Image 
            src="/images/logo.jpeg" 
            alt="Logo" 
            height="40px"
            borderRadius="md"
            onClick={() => router.push("/home")}
            cursor="pointer"
          />
        </Flex>

        <HStack spacing={4}>
          <IconButton
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            aria-label="Toggle color mode"
            variant="ghost"
          />
          <Box position="relative" onClick={() => router.push("/carrinho")}>
            <IconButton
              icon={<FaShoppingCart />}
              aria-label="Carrinho"
              variant="ghost"
            />
            {cartItemCount > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="-2px"
                right="-2px"
              >
                {cartItemCount}
              </Badge>
            )}
          </Box>
        </HStack>
      </Flex>

      {/* Drawer / Menu lateral */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={colorMode === "dark" ? "#2d3748" : "white"}>
          <DrawerCloseButton color={colorMode === "dark" ? "white" : "black"} />
          <DrawerHeader borderBottomWidth="1px" color={colorMode === "dark" ? "white" : "black"}>
            <Flex align="center">
              <Image 
                src="/images/logo.jpeg" 
                alt="Logo" 
                height="40px" 
                mr={3}
                borderRadius="md"
              />
              <Text>Menu</Text>
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              {filteredMenuItems.map((item) => (
                <Button
                  key={item.name}
                  leftIcon={item.icon}
                  justifyContent="flex-start"
                  variant="ghost"
                  onClick={() => {
                    router.push(item.path);
                    onClose();
                  }}
                  color={colorMode === "dark" ? "white" : "black"}
                  _hover={{
                    bg: colorMode === "dark" ? "teal.700" : "teal.100",
                  }}
                >
                  {item.name}
                </Button>
              ))}
              
              {isLoggedIn && (
                <Button
                  leftIcon={<FaSignOutAlt />}
                  justifyContent="flex-start"
                  variant="ghost"
                  onClick={handleLogout}
                  color={colorMode === "dark" ? "white" : "black"}
                  _hover={{
                    bg: colorMode === "dark" ? "red.700" : "red.100",
                  }}
                >
                  Sair
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Conteúdo principal */}
      <Box pt="72px" pb="20px">
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
