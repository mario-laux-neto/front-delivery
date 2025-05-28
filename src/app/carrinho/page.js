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
  Divider,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { FaTrash, FaArrowLeft, FaShoppingCart, FaCreditCard, FaMoneyBill, FaMapMarkerAlt } from "react-icons/fa";

export default function Carrinho() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const toast = useToast();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [step, setStep] = useState(1); // 1: Carrinho, 2: Endereço, 3: Pagamento, 4: Confirmação
  const [orderTotal, setOrderTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(5.99);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    loadCartItems();
    fetchAddresses();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems, discount]);

  const loadCartItems = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  };

  const fetchAddresses = async () => {
    try {
      // Em produção, descomentar a requisição abaixo
      // const response = await axios.get("/user/addresses");
      // setAddresses(response.data);
      
      // Dados simulados
      const mockAddresses = [
        { id: 1, street: "Rua das Flores", number: "123", complement: "Apto 101", neighborhood: "Centro", city: "São Paulo", state: "SP", zipcode: "01001-000", main: true },
        { id: 2, street: "Avenida Paulista", number: "1578", complement: "Sala 304", neighborhood: "Bela Vista", city: "São Paulo", state: "SP", zipcode: "01310-200", main: false }
      ];
      
      setAddresses(mockAddresses);
      setSelectedAddress(mockAddresses.find(addr => addr.main)?.id || "");
    } catch (error) {
      toast({
        title: "Erro ao carregar endereços",
        description: error.response?.data?.message || "Erro inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee - discount;
    setOrderTotal(total);
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) quantity = 1;
    
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const handleRemoveItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    
    toast({
      title: "Item removido",
      description: "O item foi removido do carrinho",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    
    // Simulando validação de cupom
    if (couponCode.toUpperCase() === "DESCONTO10") {
      const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const discountValue = subtotal * 0.1; // 10% de desconto
      setDiscount(discountValue);
      
      toast({
        title: "Cupom aplicado",
        description: "Desconto de 10% aplicado com sucesso",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Cupom inválido",
        description: "O código informado não é válido",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleNextStep = () => {
    if (step === 1 && cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho para continuar",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    if (step === 2 && !selectedAddress) {
      toast({
        title: "Selecione um endereço",
        description: "Escolha um endereço para entrega",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      handlePlaceOrder();
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      // Em produção, descomentar a requisição abaixo
      // const response = await axios.post("/orders", {
      //   items: cartItems,
      //   address_id: selectedAddress,
      //   payment_method: paymentMethod,
      //   total: orderTotal,
      //   delivery_fee: deliveryFee,
      //   discount
      // });
      
      // Simulando sucesso
      toast({
        title: "Pedido realizado com sucesso!",
        description: "Seu pedido foi recebido e está sendo processado",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Limpar carrinho
      setCartItems([]);
      localStorage.removeItem("cart");
      
      // Redirecionar para página de pedidos
      router.push("/pedidos");
    } catch (error) {
      toast({
        title: "Erro ao finalizar pedido",
        description: error.response?.data?.message || "Erro inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: // Carrinho
        return (
          <Box>
            <Heading size="md" mb={4} color={colorMode === "dark" ? "white" : "gray.700"}>
              Itens no Carrinho
            </Heading>
            
            {cartItems.length === 0 ? (
              <Box 
                textAlign="center" 
                py={10}
                bg={colorMode === "dark" ? "#2d3748" : "white"}
                borderRadius="lg"
                boxShadow="sm"
              >
                <FaShoppingCart size={50} color={colorMode === "dark" ? "#90CDF4" : "#3182CE"} />
                <Text fontSize="xl" mt={4} color={colorMode === "dark" ? "white" : "gray.700"}>
                  Seu carrinho está vazio
                </Text>
                <Text color={colorMode === "dark" ? "gray.400" : "gray.500"} mt={2}>
                  Adicione produtos para continuar
                </Text>
                <Button 
                  mt={6} 
                  colorScheme="teal" 
                  onClick={() => router.push("/produtos")}
                >
                  Ver Produtos
                </Button>
              </Box>
            ) : (
              <>
                <TableContainer 
                  bg={colorMode === "dark" ? "#2d3748" : "white"}
                  borderRadius="lg"
                  boxShadow="sm"
                  mb={6}
                >
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Produto</Th>
                        <Th isNumeric>Preço</Th>
                        <Th isNumeric>Quantidade</Th>
                        <Th isNumeric>Subtotal</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {cartItems.map(item => (
                        <Tr key={item.id}>
                          <Td>
                            <Flex align="center">
                              <Image 
                                src={item.image || "/images/placeholder-food.jpg"} 
                                alt={item.name}
                                boxSize="50px"
                                objectFit="cover"
                                borderRadius="md"
                                mr={3}
                                fallbackSrc="https://via.placeholder.com/50?text=Imagem"
                              />
                              <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                                {item.name}
                              </Text>
                            </Flex>
                          </Td>
                          <Td isNumeric color={colorMode === "dark" ? "white" : "gray.700"}>
                            R$ {item.price.toFixed(2 )}
                          </Td>
                          <Td isNumeric>
                            <NumberInput 
                              size="sm" 
                              maxW={20} 
                              min={1} 
                              value={item.quantity}
                              onChange={(_, value) => handleQuantityChange(item.id, value)}
                            >
                              <NumberInputField bg={colorMode === "dark" ? "#4a5568" : "white"} />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Td>
                          <Td isNumeric fontWeight="bold" color={colorMode === "dark" ? "teal.200" : "teal.600"}>
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </Td>
                          <Td>
                            <IconButton
                              aria-label="Remover item"
                              icon={<FaTrash />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => handleRemoveItem(item.id)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                
                <Flex 
                  direction={{ base: "column", md: "row" }} 
                  justify="space-between"
                  gap={6}
                  mb={6}
                >
                  <Box 
                    flex="1"
                    bg={colorMode === "dark" ? "#2d3748" : "white"}
                    p={4}
                    borderRadius="lg"
                    boxShadow="sm"
                  >
                    <Heading size="sm" mb={3} color={colorMode === "dark" ? "white" : "gray.700"}>
                      Cupom de Desconto
                    </Heading>
                    <Flex>
                      <Input 
                        placeholder="Código do cupom" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        bg={colorMode === "dark" ? "#4a5568" : "white"}
                        color={colorMode === "dark" ? "white" : "black"}
                        mr={2}
                      />
                      <Button colorScheme="teal" onClick={handleApplyCoupon}>
                        Aplicar
                      </Button>
                    </Flex>
                  </Box>
                  
                  <Box 
                    flex="1"
                    bg={colorMode === "dark" ? "#2d3748" : "white"}
                    p={4}
                    borderRadius="lg"
                    boxShadow="sm"
                  >
                    <Heading size="sm" mb={3} color={colorMode === "dark" ? "white" : "gray.700"}>
                      Resumo do Pedido
                    </Heading>
                    <VStack align="stretch" spacing={2}>
                      <Flex justify="space-between">
                        <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                          Subtotal:
                        </Text>
                        <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                          R$ {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                          Taxa de entrega:
                        </Text>
                        <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                          R$ {deliveryFee.toFixed(2)}
                        </Text>
                      </Flex>
                      {discount > 0 && (
                        <Flex justify="space-between">
                          <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                            Desconto:
                          </Text>
                          <Text color="green.500">
                            - R$ {discount.toFixed(2)}
                          </Text>
                        </Flex>
                      )}
                      <Divider my={2} />
                      <Flex justify="space-between" fontWeight="bold">
                        <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                          Total:
                        </Text>
                        <Text fontSize="lg" color={colorMode === "dark" ? "teal.200" : "teal.600"}>
                          R$ {orderTotal.toFixed(2)}
                        </Text>
                      </Flex>
                    </VStack>
                  </Box>
                </Flex>
                
                <Flex justify="space-between">
                  <Button 
                    variant="outline" 
                    colorScheme="red" 
                    leftIcon={<FaTrash />}
                    onClick={handleClearCart}
                  >
                    Limpar Carrinho
                  </Button>
                  <Button 
                    colorScheme="teal" 
                    onClick={handleNextStep}
                  >
                    Continuar para Entrega
                  </Button>
                </Flex>
              </>
            )}
          </Box>
        );
        
      case 2: // Endereço
        return (
          <Box>
            <Heading size="md" mb={4} color={colorMode === "dark" ? "white" : "gray.700"}>
              Endereço de Entrega
            </Heading>
            
            <Box 
              bg={colorMode === "dark" ? "#2d3748" : "white"}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              mb={6}
            >
              {addresses.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <FaMapMarkerAlt size={40} color={colorMode === "dark" ? "#90CDF4" : "#3182CE"} />
                  <Text mt={3} color={colorMode === "dark" ? "white" : "gray.700"}>
                    Você não possui endereços cadastrados
                  </Text>
                  <Button 
                    mt={4} 
                    colorScheme="teal"
                    onClick={() => router.push("/enderecos")}
                  >
                    Cadastrar Endereço
                  </Button>
                </Box>
              ) : (
                <VStack align="stretch" spacing={4}>
                  <FormControl isRequired>
                    <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                      Selecione um endereço
                    </FormLabel>
                    <Select 
                      placeholder="Escolha um endereço" 
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      bg={colorMode === "dark" ? "#4a5568" : "white"}
                      color={colorMode === "dark" ? "white" : "black"}
                    >
                      {addresses.map(address => (
                        <option key={address.id} value={address.id}>
                          {address.street}, {address.number} - {address.neighborhood}, {address.city}/{address.state}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  {selectedAddress && (
                    <Box 
                      p={4} 
                      borderWidth="1px" 
                      borderRadius="md"
                      bg={colorMode === "dark" ? "#1a202c" : "gray.50"}
                    >
                      {addresses.filter(addr => addr.id === parseInt(selectedAddress)).map(address => (
                        <VStack key={address.id} align="stretch" spacing={1}>
                          <Text fontWeight="bold" color={colorMode === "dark" ? "white" : "gray.700"}>
                            {address.street}, {address.number}
                          </Text>
                          {address.complement && (
                            <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                              {address.complement}
                            </Text>
                          )}
                          <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                            {address.neighborhood}
                          </Text>
                          <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                            {address.city}/{address.state} - CEP: {address.zipcode}
                          </Text>
                        </VStack>
                      ))}
                    </Box>
                  )}
                  
                  <Button 
                    colorScheme="teal" 
                    variant="outline"
                    onClick={() => router.push("/enderecos")}
                    alignSelf="flex-start"
                  >
                    Gerenciar Endereços
                  </Button>
                </VStack>
              )}
            </Box>
            
            <Flex justify="space-between">
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
                leftIcon={<FaArrowLeft />}
              >
                Voltar para o Carrinho
              </Button>
              <Button 
                colorScheme="teal" 
                onClick={handleNextStep}
                isDisabled={!selectedAddress}
              >
                Continuar para Pagamento
              </Button>
            </Flex>
          </Box>
        );
        
      case 3: // Pagamento
        return (
          <Box>
            <Heading size="md" mb={4} color={colorMode === "dark" ? "white" : "gray.700"}>
              Forma de Pagamento
            </Heading>
            
            <Box 
              bg={colorMode === "dark" ? "#2d3748" : "white"}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              mb={6}
            >
              <VStack align="stretch" spacing={4}>
                <FormControl isRequired>
                  <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                    Selecione uma forma de pagamento
                  </FormLabel>
                  <VStack align="stretch" spacing={3}>
                    <Box 
                      p={3} 
                      borderWidth="1px" 
                      borderRadius="md"
                      bg={paymentMethod === "credit" ? (colorMode === "dark" ? "teal.900" : "teal.50") : "transparent"}
                      borderColor={paymentMethod === "credit" ? "teal.500" : (colorMode === "dark" ? "gray.600" : "gray.200")}
                      onClick={() => setPaymentMethod("credit")}
                      cursor="pointer"
                    >
                      <Flex align="center">
                        <FaCreditCard size={20} color={colorMode === "dark" ? "#90CDF4" : "#3182CE"} />
                        <Text ml={3} color={colorMode === "dark" ? "white" : "gray.700"}>
                          Cartão de Crédito
                        </Text>
                      </Flex>
                    </Box>
                    
                    <Box 
                      p={3} 
                      borderWidth="1px" 
                      borderRadius="md"
                      bg={paymentMethod === "money" ? (colorMode === "dark" ? "teal.900" : "teal.50") : "transparent"}
                      borderColor={paymentMethod === "money" ? "teal.500" : (colorMode === "dark" ? "gray.600" : "gray.200")}
                      onClick={() => setPaymentMethod("money")}
                      cursor="pointer"
                    >
                      <Flex align="center">
                        <FaMoneyBill size={20} color={colorMode === "dark" ? "#90CDF4" : "#3182CE"} />
                        <Text ml={3} color={colorMode === "dark" ? "white" : "gray.700"}>
                          Dinheiro
                        </Text>
                      </Flex>
                    </Box>
                  </VStack>
                </FormControl>
                
                {paymentMethod === "credit" && (
                  <VStack align="stretch" spacing={4} mt={2}>
                    <FormControl isRequired>
                      <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                        Número do Cartão
                      </FormLabel>
                      <Input 
                        placeholder="0000 0000 0000 0000" 
                        bg={colorMode === "dark" ? "#4a5568" : "white"}
                        color={colorMode === "dark" ? "white" : "black"}
                      />
                    </FormControl>
                    
                    <Flex gap={4}>
                      <FormControl isRequired>
                        <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                          Validade
                        </FormLabel>
                        <Input 
                          placeholder="MM/AA" 
                          bg={colorMode === "dark" ? "#4a5568" : "white"}
                          color={colorMode === "dark" ? "white" : "black"}
                        />
                      </FormControl>
                      
                      <FormControl isRequired>
                        <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                          CVV
                        </FormLabel>
                        <Input 
                          placeholder="123" 
                          bg={colorMode === "dark" ? "#4a5568" : "white"}
                          color={colorMode === "dark" ? "white" : "black"}
                        />
                      </FormControl>
                    </Flex>
                    
                    <FormControl isRequired>
                      <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                        Nome no Cartão
                      </FormLabel>
                      <Input 
                        placeholder="Nome como aparece no cartão" 
                        bg={colorMode === "dark" ? "#4a5568" : "white"}
                        color={colorMode === "dark" ? "white" : "black"}
                      />
                    </FormControl>
                  </VStack>
                )}
                
                {paymentMethod === "money" && (
                  <VStack align="stretch" spacing={4} mt={2}>
                    <FormControl>
                      <FormLabel color={colorMode === "dark" ? "white" : "gray.700"}>
                        Troco para
                      </FormLabel>
                      <Input 
                        placeholder="R$ 0,00 (deixe em branco se não precisar de troco)" 
                        bg={colorMode === "dark" ? "#4a5568" : "white"}
                        color={colorMode === "dark" ? "white" : "black"}
                      />
                    </FormControl>
                  </VStack>
                )}
              </VStack>
            </Box>
            
            <Flex justify="space-between">
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
                leftIcon={<FaArrowLeft />}
              >
                Voltar para Endereço
              </Button>
              <Button 
                colorScheme="teal" 
                onClick={handleNextStep}
              >
                Continuar para Confirmação
              </Button>
            </Flex>
          </Box>
        );
        
      case 4: // Confirmação
        return (
          <Box>
            <Heading size="md" mb={4} color={colorMode === "dark" ? "white" : "gray.700"}>
              Confirmar Pedido
            </Heading>
            
            <Box 
              bg={colorMode === "dark" ? "#2d3748" : "white"}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              mb={6}
            >
              <VStack align="stretch" spacing={6}>
                <Box>
                  <Heading size="sm" mb={3} color={colorMode === "dark" ? "white" : "gray.700"}>
                    Itens do Pedido
                  </Heading>
                  <VStack align="stretch" spacing={2}>
                    {cartItems.map(item => (
                      <Flex key={item.id} justify="space-between">
                        <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                          {item.quantity}x {item.name}
                        </Text>
                        <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
                
                <Divider />
                
                <Box>
                  <Heading size="sm" mb={3} color={colorMode === "dark" ? "white" : "gray.700"}>
                    Endereço de Entrega
                  </Heading>
                  {addresses.filter(addr => addr.id === parseInt(selectedAddress)).map(address => (
                    <VStack key={address.id} align="stretch" spacing={1}>
                      <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                        {address.street}, {address.number}
                      </Text>
                      {address.complement && (
                        <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                          {address.complement}
                        </Text>
                      )}
                      <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                        {address.neighborhood}, {address.city}/{address.state}
                      </Text>
                      <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                        CEP: {address.zipcode}
                      </Text>
                    </VStack>
                  ))}
                </Box>
                
                <Divider />
                
                <Box>
                  <Heading size="sm" mb={3} color={colorMode === "dark" ? "white" : "gray.700"}>
                    Forma de Pagamento
                  </Heading>
                  <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                    {paymentMethod === "credit" ? "Cartão de Crédito" : "Dinheiro"}
                  </Text>
                </Box>
                
                <Divider />
                
                <Box>
                  <Heading size="sm" mb={3} color={colorMode === "dark" ? "white" : "gray.700"}>
                    Resumo do Pedido
                  </Heading>
                  <VStack align="stretch" spacing={2}>
                    <Flex justify="space-between">
                      <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                        Subtotal:
                      </Text>
                      <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                        R$ {cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                      </Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                        Taxa de entrega:
                      </Text>
                      <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                        R$ {deliveryFee.toFixed(2)}
                      </Text>
                    </Flex>
                    {discount > 0 && (
                      <Flex justify="space-between">
                        <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                          Desconto:
                        </Text>
                        <Text color="green.500">
                          - R$ {discount.toFixed(2)}
                        </Text>
                      </Flex>
                    )}
                    <Divider my={2} />
                    <Flex justify="space-between" fontWeight="bold">
                      <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                        Total:
                      </Text>
                      <Text fontSize="lg" color={colorMode === "dark" ? "teal.200" : "teal.600"}>
                        R$ {orderTotal.toFixed(2)}
                      </Text>
                    </Flex>
                  </VStack>
                </Box>
              </VStack>
            </Box>
            
            <Flex justify="space-between">
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
                leftIcon={<FaArrowLeft />}
              >
                Voltar para Pagamento
              </Button>
              <Button 
                colorScheme="teal" 
                onClick={handlePlaceOrder}
              >
                Finalizar Pedido
              </Button>
            </Flex>
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Box minH="100vh" bg={colorMode === "dark" ? "#1a202c" : "gray.50"} p={4}>
      <Box maxW="1200px" mx="auto" pt={8}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color={colorMode === "dark" ? "white" : "gray.700"}>
            {step === 1 ? "Meu Carrinho" : 
             step === 2 ? "Endereço de Entrega" : 
             step === 3 ? "Forma de Pagamento" : 
             "Confirmação do Pedido"}
          </Heading>
          
          <Button 
            variant="ghost" 
            leftIcon={<FaArrowLeft />}
            onClick={() => router.push("/produtos")}
          >
            Continuar Comprando
          </Button>
        </Flex>

        <Button 
          colorScheme="teal" 
          mb={4} 
          onClick={() => router.push("/home")}
        >
          Voltar
        </Button>

        {/* Indicador de etapas */}
        <Flex 
          justify="space-between" 
          mb={8}
          bg={colorMode === "dark" ? "#2d3748" : "white"}
          p={4}
          borderRadius="lg"
          boxShadow="sm"
        >
          {["Carrinho", "Endereço", "Pagamento", "Confirmação"].map((stepName, index) => (
            <Flex 
              key={index} 
              direction="column" 
              align="center"
              flex="1"
              position="relative"
            >
              <Box 
                w="10px" 
                h="10px" 
                borderRadius="full" 
                bg={index + 1 <= step ? "teal.500" : (colorMode === "dark" ? "gray.600" : "gray.300")}
                mb={2}
              />
              <Text 
                fontSize="sm" 
                color={index + 1 === step ? (colorMode === "dark" ? "teal.200" : "teal.600") : (colorMode === "dark" ? "gray.400" : "gray.500")}
                fontWeight={index + 1 === step ? "bold" : "normal"}
              >
                {stepName}
              </Text>
              
              {/* Linha conectora */}
              {index < 3 && (
                <Box 
                  position="absolute" 
                  h="2px" 
                  bg={index + 1 < step ? "teal.500" : (colorMode === "dark" ? "gray.600" : "gray.300")}
                  top="5px"
                  left="50%"
                  right="-50%"
                />
              )}
            </Flex>
          ))}
        </Flex>

        {/* Conteúdo da etapa atual */}
        {renderStepContent()}
      </Box>
    </Box>
  );
}
