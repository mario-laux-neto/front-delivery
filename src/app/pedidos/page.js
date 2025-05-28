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
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Skeleton,
  SkeletonText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { FaArrowLeft, FaShoppingBag, FaMapMarkerAlt, FaCreditCard, FaMoneyBill, FaReceipt } from "react-icons/fa";

export default function Pedidos() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Verificar se o usuário está logado
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      // Em produção, descomentar a requisição abaixo
      // const response = await axios.get("/orders");
      // setOrders(response.data);
      
      // Dados simulados
      const mockOrders = [
        {
          id: 1,
          order_number: "PED-001",
          created_at: "2025-05-28T10:30:00",
          status: "delivered",
          total: 76.80,
          delivery_fee: 5.99,
          discount: 0,
          payment_method: "credit",
          address: {
            street: "Rua das Flores",
            number: "123",
            complement: "Apto 101",
            neighborhood: "Centro",
            city: "São Paulo",
            state: "SP"
          },
          items: [
            {
              id: 1,
              product_id: 1,
              name: "Hambúrguer Clássico",
              price: 25.90,
              quantity: 2,
              subtotal: 51.80
            },
            {
              id: 2,
              product_id: 4,
              name: "Milk Shake de Chocolate",
              price: 18.90,
              quantity: 1,
              subtotal: 18.90
            }
          ]
        },
        {
          id: 2,
          order_number: "PED-002",
          created_at: "2025-05-27T19:45:00",
          status: "in_progress",
          total: 55.89,
          delivery_fee: 5.99,
          discount: 0,
          payment_method: "money",
          address: {
            street: "Avenida Paulista",
            number: "1578",
            complement: "Sala 304",
            neighborhood: "Bela Vista",
            city: "São Paulo",
            state: "SP"
          },
          items: [
            {
              id: 3,
              product_id: 2,
              name: "Pizza Margherita",
              price: 45.90,
              quantity: 1,
              subtotal: 45.90
            },
            {
              id: 4,
              product_id: 3,
              name: "Salada Caesar",
              price: 22.90,
              quantity: 0.5,
              subtotal: 11.45
            }
          ]
        },
        {
          id: 3,
          order_number: "PED-003",
          created_at: "2025-05-25T12:15:00",
          status: "cancelled",
          total: 49.90,
          delivery_fee: 0,
          discount: 0,
          payment_method: "credit",
          address: {
            street: "Rua das Flores",
            number: "123",
            complement: "Apto 101",
            neighborhood: "Centro",
            city: "São Paulo",
            state: "SP"
          },
          items: [
            {
              id: 5,
              product_id: 6,
              name: "Pizza Quatro Queijos",
              price: 49.90,
              quantity: 1,
              subtotal: 49.90
            }
          ]
        }
      ];
      
      setOrders(mockOrders);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Erro ao carregar pedidos",
        description: error.response?.data?.message || "Erro inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleReorder = (order) => {
    // Adicionar itens do pedido ao carrinho
    const cartItems = order.items.map(item => ({
      id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));
    
    localStorage.setItem("cart", JSON.stringify(cartItems));
    
    toast({
      title: "Itens adicionados ao carrinho",
      description: "Os itens do pedido foram adicionados ao carrinho",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    
    router.push("/carrinho");
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return { label: "Pendente", color: "yellow" };
      case "confirmed":
        return { label: "Confirmado", color: "blue" };
      case "in_progress":
        return { label: "Em preparo", color: "orange" };
      case "out_for_delivery":
        return { label: "Saiu para entrega", color: "purple" };
      case "delivered":
        return { label: "Entregue", color: "green" };
      case "cancelled":
        return { label: "Cancelado", color: "red" };
      default:
        return { label: "Desconhecido", color: "gray" };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredOrders = () => {
    if (activeTab === 0) return orders;
    if (activeTab === 1) return orders.filter(order => ["pending", "confirmed", "in_progress", "out_for_delivery"].includes(order.status));
    if (activeTab === 2) return orders.filter(order => order.status === "delivered");
    if (activeTab === 3) return orders.filter(order => order.status === "cancelled");
    return orders;
  };

  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < 3; i++) {
      skeletons.push(
        <Box 
          key={i}
          borderWidth="1px" 
          borderRadius="lg" 
          overflow="hidden"
          bg={colorMode === "dark" ? "#2d3748" : "white"}
          p={4}
          mb={4}
        >
          <Flex justify="space-between" mb={3}>
            <Skeleton height="24px" width="120px" />
            <Skeleton height="24px" width="80px" />
          </Flex>
          <SkeletonText mt="2" noOfLines={2} spacing="4" />
          <Flex mt={4} justify="space-between" align="center">
            <Skeleton height="20px" width="100px" />
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
            Meus Pedidos
          </Heading>
          
          <Button 
            variant="ghost" 
            leftIcon={<FaArrowLeft />}
            onClick={() => router.push("/home")}
          >
            Voltar 
          </Button>
        </Flex>

        {/* Tabs de filtro */}
        <Tabs 
          variant="soft-rounded" 
          colorScheme="teal" 
          mb={8}
          bg={colorMode === "dark" ? "#2d3748" : "white"}
          p={4}
          borderRadius="lg"
          boxShadow="sm"
          onChange={(index) => setActiveTab(index)}
        >
          <TabList overflowX="auto" pb={2}>
            <Tab>Todos</Tab>
            <Tab>Em andamento</Tab>
            <Tab>Entregues</Tab>
            <Tab>Cancelados</Tab>
          </TabList>
        </Tabs>

        {/* Lista de pedidos */}
        {loading ? (
          renderSkeletons()
        ) : (
          <>
            {filteredOrders().length === 0 ? (
              <Box 
                textAlign="center" 
                py={10}
                bg={colorMode === "dark" ? "#2d3748" : "white"}
                borderRadius="lg"
                boxShadow="sm"
              >
                <FaShoppingBag size={50} color={colorMode === "dark" ? "#90CDF4" : "#3182CE"} />
                <Text fontSize="xl" mt={4} color={colorMode === "dark" ? "white" : "gray.700"}>
                  Nenhum pedido encontrado
                </Text>
                <Text color={colorMode === "dark" ? "gray.400" : "gray.500"} mt={2}>
                  Faça seu primeiro pedido agora
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
              <VStack spacing={4} align="stretch">
                {filteredOrders().map(order => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <Box 
                      key={order.id}
                      borderWidth="1px" 
                      borderRadius="lg" 
                      overflow="hidden"
                      bg={colorMode === "dark" ? "#2d3748" : "white"}
                      p={5}
                    >
                      <Flex 
                        justify="space-between" 
                        align="center" 
                        mb={4}
                        direction={{ base: "column", sm: "row" }}
                        gap={{ base: 2, sm: 0 }}
                      >
                        <VStack align="flex-start" spacing={1}>
                          <Heading size="md" color={colorMode === "dark" ? "white" : "gray.700"}>
                            Pedido #{order.order_number}
                          </Heading>
                          <Text fontSize="sm" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                            {formatDate(order.created_at)}
                          </Text>
                        </VStack>
                        
                        <Badge 
                          colorScheme={statusInfo.color}
                          fontSize="md"
                          px={2}
                          py={1}
                        >
                          {statusInfo.label}
                        </Badge>
                      </Flex>
                      
                      <Divider mb={4} />
                      
                      <VStack align="stretch" spacing={3} mb={4}>
                        {order.items.slice(0, 2).map(item => (
                          <Flex key={item.id} justify="space-between">
                            <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                              {item.quantity}x {item.name}
                            </Text>
                            <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                              R$ {item.subtotal.toFixed(2)}
                            </Text>
                          </Flex>
                        ))}
                        
                        {order.items.length > 2 && (
                          <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                            + {order.items.length - 2} outros itens
                          </Text>
                        )}
                      </VStack>
                      
                      <Flex 
                        justify="space-between" 
                        align="center"
                        direction={{ base: "column", sm: "row" }}
                        gap={{ base: 2, sm: 0 }}
                      >
                        <Text 
                          fontWeight="bold" 
                          fontSize="lg"
                          color={colorMode === "dark" ? "teal.200" : "teal.600"}
                        >
                          Total: R$ {order.total.toFixed(2)}
                        </Text>
                        
                        <HStack spacing={2}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewOrderDetails(order)}
                          >
                            Ver Detalhes
                          </Button>
                          
                          {order.status !== "cancelled" && (
                            <Button 
                              colorScheme="teal" 
                              size="sm"
                              onClick={() => handleReorder(order)}
                            >
                              Pedir Novamente
                            </Button>
                          )}
                        </HStack>
                      </Flex>
                    </Box>
                  );
                })}
              </VStack>
            )}
          </>
        )}
      </Box>

      {/* Modal de detalhes do pedido */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={colorMode === "dark" ? "#2d3748" : "white"}>
          <ModalHeader color={colorMode === "dark" ? "white" : "gray.700"}>
            Detalhes do Pedido #{selectedOrder?.order_number}
          </ModalHeader>
          <ModalCloseButton color={colorMode === "dark" ? "white" : "gray.700"} />
          
          <ModalBody>
            {selectedOrder && (
              <VStack align="stretch" spacing={6}>
                <Box>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Heading size="sm" color={colorMode === "dark" ? "white" : "gray.700"}>
                      Status
                    </Heading>
                    <Badge 
                      colorScheme={getStatusInfo(selectedOrder.status).color}
                      fontSize="md"
                      px={2}
                      py={1}
                    >
                      {getStatusInfo(selectedOrder.status).label}
                    </Badge>
                  </Flex>
                  <Text fontSize="sm" color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                    Pedido realizado em {formatDate(selectedOrder.created_at)}
                  </Text>
                </Box>
                
                <Divider />
                
                <Box>
                  <Heading size="sm" mb={3} color={colorMode === "dark" ? "white" : "gray.700"}>
                    <Flex align="center">
                      <FaShoppingBag size={16} style={{ marginRight: '8px' }} />
                      Itens do Pedido
                    </Flex>
                  </Heading>
                  <VStack align="stretch" spacing={2}>
                    {selectedOrder.items.map(item => (
                      <Flex key={item.id} justify="space-between">
                        <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                          {item.quantity}x {item.name}
                        </Text>
                        <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                          R$ {item.subtotal.toFixed(2)}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
                
                <Divider />
                
                <Box>
                  <Heading size="sm" mb={3} color={colorMode === "dark" ? "white" : "gray.700"}>
                    <Flex align="center">
                      <FaMapMarkerAlt size={16} style={{ marginRight: '8px' }} />
                      Endereço de Entrega
                    </Flex>
                  </Heading>
                  <VStack align="stretch" spacing={1}>
                    <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                      {selectedOrder.address.street}, {selectedOrder.address.number}
                    </Text>
                    {selectedOrder.address.complement && (
                      <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                        {selectedOrder.address.complement}
                      </Text>
                    )}
                    <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                      {selectedOrder.address.neighborhood}, {selectedOrder.address.city}/{selectedOrder.address.state}
                    </Text>
                  </VStack>
                </Box>
                
                <Divider />
                
                <Box>
                  <Heading size="sm" mb={3} color={colorMode === "dark" ? "white" : "gray.700"}>
                    <Flex align="center">
                      {selectedOrder.payment_method === "credit" ? (
                        <FaCreditCard size={16} style={{ marginRight: '8px' }} />
                      ) : (
                        <FaMoneyBill size={16} style={{ marginRight: '8px' }} />
                      )}
                      Pagamento
                    </Flex>
                  </Heading>
                  <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                    {selectedOrder.payment_method === "credit" ? "Cartão de Crédito" : "Dinheiro"}
                  </Text>
                </Box>
                
                <Divider />
                
                <Box>
                  <Heading size="sm" mb={3} color={colorMode === "dark" ? "white" : "gray.700"}>
                    <Flex align="center">
                      <FaReceipt size={16} style={{ marginRight: '8px' }} />
                      Resumo do Pedido
                    </Flex>
                  </Heading>
                  <VStack align="stretch" spacing={2}>
                    <Flex justify="space-between">
                      <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                        Subtotal:
                      </Text>
                      <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                        R$ {(selectedOrder.total - selectedOrder.delivery_fee + selectedOrder.discount).toFixed(2)}
                      </Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                        Taxa de entrega:
                      </Text>
                      <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                        R$ {selectedOrder.delivery_fee.toFixed(2)}
                      </Text>
                    </Flex>
                    {selectedOrder.discount > 0 && (
                      <Flex justify="space-between">
                        <Text color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                          Desconto:
                        </Text>
                        <Text color="green.500">
                          - R$ {selectedOrder.discount.toFixed(2)}
                        </Text>
                      </Flex>
                    )}
                    <Divider my={2} />
                    <Flex justify="space-between" fontWeight="bold">
                      <Text color={colorMode === "dark" ? "white" : "gray.700"}>
                        Total:
                      </Text>
                      <Text fontSize="lg" color={colorMode === "dark" ? "teal.200" : "teal.600"}>
                        R$ {selectedOrder.total.toFixed(2)}
                      </Text>
                    </Flex>
                  </VStack>
                </Box>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Fechar
            </Button>
            {selectedOrder && selectedOrder.status !== "cancelled" && (
              <Button 
                colorScheme="teal" 
                onClick={() => {
                  handleReorder(selectedOrder);
                  onClose();
                }}
              >
                Pedir Novamente
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
