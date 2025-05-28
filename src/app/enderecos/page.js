"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  useColorMode,
  VStack,
  HStack,
  Divider,
  Badge,
  useToast,
  Skeleton,
  SkeletonText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Switch,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Grid,
  GridItem
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { FaArrowLeft, FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaStar } from "react-icons/fa";

export default function Enderecos() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const cancelRef = React.useRef();
  
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipcode: "",
    main: false
  });
  
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchAddresses();
  }, [router]);

  const fetchAddresses = async () => {
    try {
      // Em produção, descomentar a requisição abaixo
      // const response = await axios.get("/user/addresses");
      // setAddresses(response.data);
      
      // Dados simulados
      const mockAddresses = [
        { 
          id: 1, 
          street: "Rua das Flores", 
          number: "123", 
          complement: "Apto 101", 
          neighborhood: "Centro", 
          city: "São Paulo", 
          state: "SP", 
          zipcode: "01001-000", 
          main: true 
        },
        { 
          id: 2, 
          street: "Avenida Paulista", 
          number: "1578", 
          complement: "Sala 304", 
          neighborhood: "Bela Vista", 
          city: "São Paulo", 
          state: "SP", 
          zipcode: "01310-200", 
          main: false 
        },
        { 
          id: 3, 
          street: "Rua Augusta", 
          number: "789", 
          complement: "", 
          neighborhood: "Consolação", 
          city: "São Paulo", 
          state: "SP", 
          zipcode: "01305-000", 
          main: false 
        }
      ];
      
      setAddresses(mockAddresses);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Erro ao carregar endereços",
        description: error.response?.data?.message || "Erro inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleOpenAddressForm = (address = null) => {
    if (address) {
      setIsEditing(true);
      setSelectedAddress(address);
      setFormData({
        street: address.street,
        number: address.number,
        complement: address.complement || "",
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipcode: address.zipcode,
        main: address.main
      });
    } else {
      setIsEditing(false);
      setSelectedAddress(null);
      setFormData({
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipcode: "",
        main: addresses.length === 0 // Se for o primeiro endereço, marca como principal
      });
    }
    
    setFormErrors({});
    onOpen();
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "main" ? checked : value
    });
    
    // Limpar erro do campo quando o usuário digita
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.street.trim()) errors.street = "Rua é obrigatória";
    if (!formData.number.trim()) errors.number = "Número é obrigatório";
    if (!formData.neighborhood.trim()) errors.neighborhood = "Bairro é obrigatório";
    if (!formData.city.trim()) errors.city = "Cidade é obrigatória";
    if (!formData.state.trim()) errors.state = "Estado é obrigatório";
    if (!formData.zipcode.trim()) errors.zipcode = "CEP é obrigatório";
    
    // Validação básica de CEP (formato: 00000-000)
    const cepRegex = /^\d{5}-\d{3}$/;
    if (formData.zipcode && !cepRegex.test(formData.zipcode)) {
      errors.zipcode = "CEP inválido. Use o formato: 00000-000";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (isEditing) {
        // Em produção, descomentar a requisição abaixo
        // const response = await axios.put(`/user/addresses/${selectedAddress.id}`, formData);
        
        // Simulando atualização
        const updatedAddresses = addresses.map(addr => {
          if (addr.id === selectedAddress.id) {
            return { ...addr, ...formData };
          }
          
          // Se o endereço atual foi marcado como principal, desmarca os outros
          if (formData.main && addr.id !== selectedAddress.id) {
            return { ...addr, main: false };
          }
          
          return addr;
        });
        
        setAddresses(updatedAddresses);
        
        toast({
          title: "Endereço atualizado",
          description: "O endereço foi atualizado com sucesso",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } else {
        // Em produção, descomentar a requisição abaixo
        // const response = await axios.post("/user/addresses", formData);
        // const newAddress = response.data;
        
        // Simulando criação
        const newAddress = {
          id: addresses.length + 1,
          ...formData
        };
        
        let updatedAddresses;
        
        if (formData.main) {
          // Se o novo endereço é principal, desmarca os outros
          updatedAddresses = addresses.map(addr => ({
            ...addr,
            main: false
          }));
        } else {
          updatedAddresses = [...addresses];
        }
        
        updatedAddresses.push(newAddress);
        setAddresses(updatedAddresses);
        
        toast({
          title: "Endereço adicionado",
          description: "O endereço foi adicionado com sucesso",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: isEditing ? "Erro ao atualizar endereço" : "Erro ao adicionar endereço",
        description: error.response?.data?.message || "Erro inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAddress = (address) => {
    setAddressToDelete(address);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteAddress = async () => {
    try {
      // Em produção, descomentar a requisição abaixo
      // await axios.delete(`/user/addresses/${addressToDelete.id}`);
      
      // Simulando exclusão
      const updatedAddresses = addresses.filter(addr => addr.id !== addressToDelete.id);
      setAddresses(updatedAddresses);
      
      toast({
        title: "Endereço excluído",
        description: "O endereço foi excluído com sucesso",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir endereço",
        description: error.response?.data?.message || "Erro inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsDeleteAlertOpen(false);
      setAddressToDelete(null);
    }
  };

  const handleSetMainAddress = async (address) => {
    try {
      // Em produção, descomentar a requisição abaixo
      // await axios.put(`/user/addresses/${address.id}/main`);
      
      // Simulando atualização
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        main: addr.id === address.id
      }));
      
      setAddresses(updatedAddresses);
      
      toast({
        title: "Endereço principal definido",
        description: "O endereço principal foi atualizado com sucesso",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao definir endereço principal",
        description: error.response?.data?.message || "Erro inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < 3; i++) {
      skeletons.push(
        <Box 
          key={i}
          borderRadius="lg" 
          overflow="hidden"
          bg={colorMode === "dark" ? "#2d3748" : "white"}
          p={4}
          mb={4}
          borderWidth="1px"
        >
          <Flex justify="space-between" mb={3}>
            <Skeleton height="24px" width="120px" />
            <Skeleton height="24px" width="80px" />
          </Flex>
          <SkeletonText mt="2" noOfLines={3} spacing="4" />
          <Flex mt={4} justify="flex-end" align="center">
            <Skeleton height="40px" width="100px" borderRadius="md" mr={2} />
            <Skeleton height="40px" width="100px" borderRadius="md" />
          </Flex>
        </Box>
      );
    }
    return skeletons;
  };

  return (
    <Box minH="100vh" bg={colorMode === "dark" ? "#1a202c" : "gray.50"} p={4}>
      <Box maxW="1200px" mx="auto" pt={8}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color={colorMode === "dark" ? "white" : "gray.700"}>
            Meus Endereços
          </Heading>
          
          <Button 
            variant="ghost" 
            leftIcon={<FaArrowLeft />}
            onClick={() => router.push("/home")}
          >
            Voltar
          </Button>
        </Flex>

        {/* Botão para adicionar novo endereço */}
        <Button 
          leftIcon={<FaPlus />} 
          colorScheme="teal" 
          mb={6}
          onClick={() => handleOpenAddressForm()}
        >
          Adicionar Novo Endereço
        </Button>

        {/* Lista de endereços */}
        {loading ? (
          renderSkeletons()
        ) : (
          <>
            {addresses.length === 0 ? (
              <Box 
                textAlign="center" 
                py={10}
                bg={colorMode === "dark" ? "#2d3748" : "white"}
                borderRadius="lg"
                boxShadow="sm"
                borderWidth="1px"
              >
                <FaMapMarkerAlt size={50} color={colorMode === "dark" ? "#90CDF4" : "#3182CE"} />
                <Text fontSize="xl" mt={4} color={colorMode === "dark" ? "white" : "gray.700"}>
                  Você não possui endereços cadastrados
                </Text>
                <Text color={colorMode === "dark" ? "gray.400" : "gray.500"} mt={2}>
                  Adicione um endereço para facilitar suas compras
                </Text>
                <Button 
                  mt={6} 
                  colorScheme="teal" 
                  leftIcon={<FaPlus />}
                  onClick={() => handleOpenAddressForm()}
                >
                  Adicionar Endereço
                </Button>
              </Box>
            ) : (
              <Grid 
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={6}
              >
                {addresses.map(address => (
                  <GridItem key={address.id}>
                    <Box 
                      borderRadius="lg" 
                      overflow="hidden"
                      bg={colorMode === "dark" ? "#2d3748" : "white"}
                      p={5}
                      position="relative"
                      borderColor={address.main ? "teal.500" : undefined}
                      borderWidth={address.main ? "2px" : "1px"}
                    >
                      {address.main && (
                        <Badge 
                          colorScheme="teal" 
                          position="absolute" 
                          top={2} 
                          right={2}
                        >
                          <Flex align="center">
                            <FaStar size={12} style={{ marginRight: '4px' }} />
                            Principal
                          </Flex>
                        </Badge>
                      )}
                      
                      <VStack align="stretch" spacing={2} mb={4}>
                        <Heading size="md" color={colorMode === "dark" ? "white" : "gray.700"}>
                          {address.street}, {address.number}
                        </Heading>
                        
                        {address.complement && (
                          <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                            {address.complement}
                          </Text>
                        )}
                        
                        <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                          {address.neighborhood}
                        </Text>
                        
                        <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                          {address.city}/{address.state}
                        </Text>
                        
                        <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                          CEP: {address.zipcode}
                        </Text>
                      </VStack>
                      
                      <Divider mb={4} />
                      
                      <Flex justify="space-between">
                        <HStack>
                          <Button 
                            leftIcon={<FaEdit />}
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenAddressForm(address)}
                          >
                            Editar
                          </Button>
                          
                          <Button 
                            leftIcon={<FaTrash />}
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAddress(address)}
                          >
                            Excluir
                          </Button>
                        </HStack>
                        
                        {!address.main && (
                          <Button 
                            colorScheme="teal" 
                            size="sm"
                            onClick={() => handleSetMainAddress(address)}
                          >
                            Definir como Principal
                          </Button>
                        )}
                      </Flex>
                    </Box>
                  </GridItem>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>

      {/* Modal de formulário de endereço */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={colorMode === "dark" ? "#2d3748" : "white"}>
          <ModalHeader color={colorMode === "dark" ? "white" : "gray.700"}>
            {isEditing ? "Editar Endereço" : "Adicionar Endereço"}
          </ModalHeader>
          <ModalCloseButton color={colorMode === "dark" ? "white" : "gray.700"} />
          
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired isInvalid={!!formErrors.zipcode}>
                  <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                    CEP
                  </FormLabel>
                  <Input 
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                    placeholder="00000-000"
                    bg={colorMode === "dark" ? "#4a5568" : "white"}
                    color={colorMode === "dark" ? "white" : "black"}
                  />
                  {formErrors.zipcode && (
                    <FormErrorMessage>{formErrors.zipcode}</FormErrorMessage>
                  )}
                </FormControl>
                
                <FormControl isRequired isInvalid={!!formErrors.street}>
                  <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                    Rua
                  </FormLabel>
                  <Input 
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    bg={colorMode === "dark" ? "#4a5568" : "white"}
                    color={colorMode === "dark" ? "white" : "black"}
                  />
                  {formErrors.street && (
                    <FormErrorMessage>{formErrors.street}</FormErrorMessage>
                  )}
                </FormControl>
                
                <Grid templateColumns="2fr 1fr" gap={4}>
                  <GridItem>
                    <FormControl isRequired isInvalid={!!formErrors.number}>
                      <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                        Número
                      </FormLabel>
                      <Input 
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        bg={colorMode === "dark" ? "#4a5568" : "white"}
                        color={colorMode === "dark" ? "white" : "black"}
                      />
                      {formErrors.number && (
                        <FormErrorMessage>{formErrors.number}</FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl>
                      <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                        Complemento
                      </FormLabel>
                      <Input 
                        name="complement"
                        value={formData.complement}
                        onChange={handleChange}
                        placeholder="Apto, sala, etc."
                        bg={colorMode === "dark" ? "#4a5568" : "white"}
                        color={colorMode === "dark" ? "white" : "black"}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>
                
                <FormControl isRequired isInvalid={!!formErrors.neighborhood}>
                  <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                    Bairro
                  </FormLabel>
                  <Input 
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    bg={colorMode === "dark" ? "#4a5568" : "white"}
                    color={colorMode === "dark" ? "white" : "black"}
                  />
                  {formErrors.neighborhood && (
                    <FormErrorMessage>{formErrors.neighborhood}</FormErrorMessage>
                  )}
                </FormControl>
                
                <Grid templateColumns="3fr 1fr" gap={4}>
                  <GridItem>
                    <FormControl isRequired isInvalid={!!formErrors.city}>
                      <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                        Cidade
                      </FormLabel>
                      <Input 
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        bg={colorMode === "dark" ? "#4a5568" : "white"}
                        color={colorMode === "dark" ? "white" : "black"}
                      />
                      {formErrors.city && (
                        <FormErrorMessage>{formErrors.city}</FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                  
                  <GridItem>
                    <FormControl isRequired isInvalid={!!formErrors.state}>
                      <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                        Estado
                      </FormLabel>
                      <Input 
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="UF"
                        maxLength={2}
                        bg={colorMode === "dark" ? "#4a5568" : "white"}
                        color={colorMode === "dark" ? "white" : "black"}
                      />
                      {formErrors.state && (
                        <FormErrorMessage>{formErrors.state}</FormErrorMessage>
                      )}
                    </FormControl>
                  </GridItem>
                </Grid>
                
                <FormControl display="flex" alignItems="center">
                  <Switch 
                    id="main-address" 
                    name="main"
                    isChecked={formData.main}
                    onChange={handleChange}
                    colorScheme="teal"
                    mr={3}
                  />
                  <FormLabel htmlFor="main-address" mb="0" color={colorMode === "dark" ? "white" : "gray.700"}>
                    Definir como endereço principal
                  </FormLabel>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="teal" type="submit">
                {isEditing ? "Salvar Alterações" : "Adicionar Endereço"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Alerta de confirmação para excluir endereço */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg={colorMode === "dark" ? "#2d3748" : "white"}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color={colorMode === "dark" ? "white" : "gray.700"}>
              Excluir Endereço
            </AlertDialogHeader>

            <AlertDialogBody color={colorMode === "dark" ? "white" : "gray.700"}>
              Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={confirmDeleteAddress} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
