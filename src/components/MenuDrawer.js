import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Flex,
  Image,
  Text,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";

const MenuDrawer = ({ isOpen, onClose, menuItems, isLoggedIn, handleLogout }) => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  return (
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
            {(menuItems || []).map((item) => (
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
  );
};

export default MenuDrawer;