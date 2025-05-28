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
  Grid,
  GridItem,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
  Skeleton,
  SkeletonText,
  Divider,
  useClipboard
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { FaSearch, FaTicketAlt, FaCopy, FaArrowLeft } from "react-icons/fa";

export default function Cupons() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const toast = useToast();
  
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const { hasCopied, onCopy } = useClipboard("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      // Em produção, descomentar a requisição abaixo
      // const response = await axios.get("/coupons");
      // setCoupons(response.data);
      
      // Dados simulados
      const mockCoupons = [
        {
          id: 1,
          code: "DESCONTO10",
          description: "10% de desconto em qualquer pedido",
          discount_type: "percentage",
          discount_value: 10,
          min_order_value: 30,
          valid_until: "2025-12-31",
          is_active: true,
          usage_limit: 1,
          times_used: 0
        },
        {
          id: 2,
          code: "FRETEGRATIS",
          description: "Frete grátis para pedidos acima de R$ 50",
          discount_type: "shipping",
          discount_value: 100,
          min_order_value: 50,
          valid_until: "2025-06-30",
          is_active: true,
          usage_limit: 1,
          times_used: 0
        },
        {
          id: 3,
          code: "BEMVINDO15",
          description: "15% de desconto no seu primeiro pedido",
          discount_type: "percentage",
          discount_value: 15,
          min_order_value: 0,
          valid_until: "2025-12-31",
          is_active: true,
          usage_limit: 1,
          times_used: 0
        },
        {
          id: 4,
          code: "MENOS20REAIS",
          description: "R$ 20 de desconto em pedidos acima de R$ 100",
          discount_type: "fixed",
          discount_value: 20,
          min_order_value: 100,
          valid_until: "2025-08-15",
          is_active: true,
          usage_limit: 1,
          times_used: 0
        }
      ];
      
      setCoupons(mockCoupons);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Erro ao carregar cupons",
        description: error.response?.data?.message || "Erro inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Cupom copiado!",
      description: `O código ${code} foi copiado para a área de transferência`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleApplyCoupon = (coupon) => {
    // Redirecionar para o carrinho com o cupom pré-selecionado
    localStorage.setItem("selected_coupon", coupon.code);
    router.push("/carrinho");
  };

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < 4; i++) {
      skeletons.push(
        <GridItem key={i}>
          <Box 
            borderWidth="1px" 
            borderRadius="lg" 
            overflow="hidden"
            bg={colorMode === "dark" ? "#2d3748" : "white"}
            p={4}
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
        </GridItem>
      );
    }
    return skeletons;
  };

  const formatDiscountValue = (coupon) => {
    if (coupon.discount_type === "percentage") {
      return `${coupon.discount_value}%`;
    } else if (coupon.discount_type === "fixed") {
      return `R$ ${coupon.discount_value.toFixed(2)}`;
    } else if (coupon.discount_type === "shipping") {
      return "Frete Grátis";
    }
    return "";
  };

  const formatValidUntil = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Box minH="100vh" bg={colorMode === "dark" ? "#1a202c" : "gray.50"} p={4}>
      <Box maxW="1200px" mx="auto" pt={8}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color={colorMode === "dark" ? "white" : "gray.700"}>
            Meus Cupons
          </Heading>
          
          <Button 
            variant="ghost" 
            leftIcon={<FaArrowLeft />}
            onClick={() => router.push("/home")}
          >
            Voltar
          </Button>
        </Flex>

        {/* Busca */}
        <Box 
          mb={8}
          bg={colorMode === "dark" ? "#2d3748" : "white"}
          p={4}
          borderRadius="lg"
          boxShadow="sm"
        >
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaSearch color={colorMode === "dark" ? "white" : "gray.300"} />
            </InputLeftElement>
            <Input 
              placeholder="Buscar cupons..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={colorMode === "dark" ? "#4a5568" : "white"}
              color={colorMode === "dark" ? "white" : "black"}
            />
          </InputGroup>
        </Box>

        {/* Lista de cupons */}
        {loading ? (
          <Grid 
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={6}
          >
            {renderSkeletons()}
          </Grid>
        ) : (
          <>
            {filteredCoupons.length === 0 ? (
              <Box 
                textAlign="center" 
                py={10}
                bg={colorMode === "dark" ? "#2d3748" : "white"}
                borderRadius="lg"
                boxShadow="sm"
              >
                <FaTicketAlt size={50} color={colorMode === "dark" ? "#90CDF4" : "#3182CE"} />
                <Text fontSize="xl" mt={4} color={colorMode === "dark" ? "white" : "gray.700"}>
                  Nenhum cupom encontrado
                </Text>
                <Text color={colorMode === "dark" ? "gray.400" : "gray.500"} mt={2}>
                  Tente outra busca ou volte mais tarde
                </Text>
              </Box>
            ) : (
              <Grid 
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={6}
              >
                {filteredCoupons.map(coupon => (
                  <GridItem key={coupon.id}>
                    <Box 
                      borderWidth="1px" 
                      borderRadius="lg" 
                      overflow="hidden"
                      bg={colorMode === "dark" ? "#2d3748" : "white"}
                      p={5}
                      position="relative"
                      transition="transform 0.3s"
                      _hover={{ transform: "translateY(-5px)" }}
                    >
                      <Flex justify="space-between" align="center" mb={3}>
                        <Badge 
                          colorScheme={coupon.discount_type === "percentage" ? "green" : coupon.discount_type === "shipping" ? "purple" : "blue"}
                          fontSize="md"
                          px={2}
                          py={1}
                        >
                          {formatDiscountValue(coupon)}
                        </Badge>
                        <Text 
                          fontSize="sm" 
                          color={colorMode === "dark" ? "gray.300" : "gray.500"}
                        >
                          Válido até {formatValidUntil(coupon.valid_until)}
                        </Text>
                      </Flex>
                      
                      <Heading size="md" mb={2} color={colorMode === "dark" ? "white" : "gray.700"}>
                        {coupon.code}
                      </Heading>
                      
                      <Text 
                        color={colorMode === "dark" ? "gray.300" : "gray.600"}
                        mb={4}
                      >
                        {coupon.description}
                      </Text>
                      
                      {coupon.min_order_value > 0 && (
                        <Text 
                          fontSize="sm" 
                          color={colorMode === "dark" ? "gray.400" : "gray.500"}
                          mb={4}
                        >
                          Pedido mínimo: R$ {coupon.min_order_value.toFixed(2)}
                        </Text>
                      )}
                      
                      <Divider mb={4} />
                      
                      <Flex justify="space-between">
                        <Button 
                          leftIcon={<FaCopy />}
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyCoupon(coupon.code)}
                        >
                          Copiar
                        </Button>
                        
                        <Button 
                          colorScheme="teal" 
                          size="sm"
                          onClick={() => handleApplyCoupon(coupon)}
                        >
                          Usar Agora
                        </Button>
                      </Flex>
                    </Box>
                  </GridItem>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
