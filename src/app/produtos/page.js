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
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Skeleton,
  SkeletonText
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { FaSearch, FaShoppingCart, FaStar, FaHeart } from "react-icons/fa";

export default function Produtos() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const toast = useToast();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Carregar produtos e categorias
    fetchProducts();
    fetchCategories();
    
    // Carregar carrinho do localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    // Carregar favoritos do localStorage
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const fetchProducts = async () => {
    try {
      // Em produção, descomentar a requisição abaixo
      // const response = await axios.get("/products");
      // setProducts(response.data);
      
      // Dados simulados
      const mockProducts = [
        {
          id: 1,
          name: "Hambúrguer Clássico",
          description: "Pão, hambúrguer, queijo, alface, tomate e molho especial",
          price: 25.90,
          image: "/images/burger1.jpg",
          category_id: 1,
          rating: 4.8,
          reviews: 120,
          popular: true
        },
        {
          id: 2,
          name: "Pizza Margherita",
          description: "Molho de tomate, mussarela, manjericão fresco e azeite",
          price: 45.90,
          image: "/images/pizza1.jpg",
          category_id: 2,
          rating: 4.5,
          reviews: 98,
          popular: true
        },
        {
          id: 3,
          name: "Salada Caesar",
          description: "Alface romana, croutons, parmesão e molho caesar",
          price: 22.90,
          image: "/images/salad1.jpg",
          category_id: 3,
          rating: 4.2,
          reviews: 45,
          popular: false
        },
        {
          id: 4,
          name: "Milk Shake de Chocolate",
          description: "Sorvete de chocolate, leite e calda de chocolate",
          price: 18.90,
          image: "/images/milkshake1.jpg",
          category_id: 4,
          rating: 4.7,
          reviews: 76,
          popular: true
        },
        {
          id: 5,
          name: "Hambúrguer Vegetariano",
          description: "Pão integral, hambúrguer de grão de bico, queijo, alface e tomate",
          price: 27.90,
          image: "/images/burger2.jpg",
          category_id: 1,
          rating: 4.3,
          reviews: 62,
          popular: false
        },
        {
          id: 6,
          name: "Pizza Quatro Queijos",
          description: "Molho de tomate, mussarela, parmesão, gorgonzola e catupiry",
          price: 49.90,
          image: "/images/pizza2.jpg",
          category_id: 2,
          rating: 4.9,
          reviews: 105,
          popular: true
        }
      ];
      
      setProducts(mockProducts);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: error.response?.data?.message || "Erro inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Em produção, descomentar a requisição abaixo
      // const response = await axios.get("/categories");
      // setCategories(response.data);
      
      // Dados simulados
      const mockCategories = [
        { id: 1, name: "Hambúrgueres", icon: "🍔" },
        { id: 2, name: "Pizzas", icon: "🍕" },
        { id: 3, name: "Saladas", icon: "🥗" },
        { id: 4, name: "Bebidas", icon: "🥤" }
      ];
      
      setCategories(mockCategories);
    } catch (error) {
      toast({
        title: "Erro ao carregar categorias",
        description: error.response?.data?.message || "Erro inesperado",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleToggleFavorite = (productId) => {
    let updatedFavorites;
    
    if (favorites.includes(productId)) {
      updatedFavorites = favorites.filter(id => id !== productId);
    } else {
      updatedFavorites = [...favorites, productId];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === "all" || product.category_id === parseInt(selectedCategory)) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      // Default: popularity
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return b.reviews - a.reviews;
    });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Box as="span" key={i} color={i <= rating ? "yellow.400" : "gray.300"}>
          <FaStar />
        </Box>
      );
    }
    return stars;
  };

  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < 6; i++) {
      skeletons.push(
        <GridItem key={i}>
          <Box 
            borderWidth="1px" 
            borderRadius="lg" 
            overflow="hidden"
            bg={colorMode === "dark" ? "#2d3748" : "white"}
          >
            <Skeleton height="200px" />
            <Box p={4}>
              <SkeletonText mt="2" noOfLines={3} spacing="4" />
              <Flex mt={4} justify="space-between" align="center">
                <Skeleton height="20px" width="80px" />
                <Skeleton height="40px" width="40px" borderRadius="md" />
              </Flex>
            </Box>
          </Box>
        </GridItem>
      );
    }
    return skeletons;
  };

  return (
    <Box minH="100vh" bg={colorMode === "dark" ? "#1a202c" : "gray.50"} p={4}>
      <Box maxW="1200px" mx="auto" pt={8}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color={colorMode === "dark" ? "white" : "gray.700"}>
            Produtos
          </Heading>
          
          <Button 
            colorScheme="teal" 
            leftIcon={<FaShoppingCart />}
            onClick={() => router.push("/carrinho")}
          >
            Carrinho ({cart.reduce((total, item) => total + item.quantity, 0)})
          </Button>
        </Flex>

        <Button 
          colorScheme="teal" 
          mb={4} 
          onClick={() => router.push("/home")}
        >
          Voltar
        </Button>

        {/* Filtros e busca */}
        <Flex 
          direction={{ base: "column", md: "row" }} 
          gap={4} 
          mb={8}
          bg={colorMode === "dark" ? "#2d3748" : "white"}
          p={4}
          borderRadius="lg"
          boxShadow="sm"
        >
          <InputGroup flex="2">
            <InputLeftElement pointerEvents="none">
              <FaSearch color={colorMode === "dark" ? "white" : "gray.300"} />
            </InputLeftElement>
            <Input 
              placeholder="Buscar produtos..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={colorMode === "dark" ? "#4a5568" : "white"}
              color={colorMode === "dark" ? "white" : "black"}
            />
          </InputGroup>
          
          <Select 
            placeholder="Categoria" 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            flex="1"
            bg={colorMode === "dark" ? "#4a5568" : "white"}
            color={colorMode === "dark" ? "white" : "black"}
          >
            <option value="all">Todas as categorias</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </Select>
          
          <Select 
            placeholder="Ordenar por" 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            flex="1"
            bg={colorMode === "dark" ? "#4a5568" : "white"}
            color={colorMode === "dark" ? "white" : "black"}
          >
            <option value="popularity">Popularidade</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="rating">Melhor avaliação</option>
          </Select>
        </Flex>

        {/* Tabs de categorias */}
        <Tabs 
          variant="soft-rounded" 
          colorScheme="teal" 
          mb={8}
          bg={colorMode === "dark" ? "#2d3748" : "white"}
          p={4}
          borderRadius="lg"
          boxShadow="sm"
        >
          <TabList overflowX="auto" pb={2}>
            <Tab>Todos</Tab>
            {categories.map(category => (
              <Tab key={category.id} onClick={() => setSelectedCategory(category.id.toString())}>
                {category.icon} {category.name}
              </Tab>
            ))}
          </TabList>
        </Tabs>

        {/* Lista de produtos */}
        {loading ? (
          <Grid 
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={6}
          >
            {renderSkeletons()}
          </Grid>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <Box 
                textAlign="center" 
                py={10}
                bg={colorMode === "dark" ? "#2d3748" : "white"}
                borderRadius="lg"
                boxShadow="sm"
              >
                <Text fontSize="xl" color={colorMode === "dark" ? "white" : "gray.700"}>
                  Nenhum produto encontrado
                </Text>
                <Text color={colorMode === "dark" ? "gray.400" : "gray.500"} mt={2}>
                  Tente mudar os filtros ou a busca
                </Text>
              </Box>
            ) : (
              <Grid 
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                gap={6}
              >
                {filteredProducts.map(product => (
                  <GridItem key={product.id}>
                    <Box 
                      borderWidth="1px" 
                      borderRadius="lg" 
                      overflow="hidden"
                      bg={colorMode === "dark" ? "#2d3748" : "white"}
                      transition="transform 0.3s"
                      _hover={{ transform: "translateY(-5px)" }}
                      position="relative"
                    >
                      <Image 
                        src={product.image || "/images/placeholder-food.jpg"} 
                        alt={product.name}
                        height="200px"
                        width="100%"
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/300x200?text=Imagem+não+disponível"
                      />
                      
                      {product.popular && (
                        <Badge 
                          colorScheme="red" 
                          position="absolute" 
                          top={2} 
                          left={2}
                        >
                          Popular
                        </Badge>
                       )}
                      
                      <Button
                        position="absolute"
                        top={2}
                        right={2}
                        size="sm"
                        colorScheme={favorites.includes(product.id) ? "red" : "gray"}
                        variant="solid"
                        onClick={() => handleToggleFavorite(product.id)}
                      >
                        <FaHeart />
                      </Button>
                      
                      <Box p={4}>
                        <Heading size="md" mb={2} color={colorMode === "dark" ? "white" : "gray.700"}>
                          {product.name}
                        </Heading>
                        
                        <Text 
                          color={colorMode === "dark" ? "gray.300" : "gray.600"}
                          noOfLines={2}
                          mb={3}
                        >
                          {product.description}
                        </Text>
                        
                        <HStack mb={3}>
                          {renderStars(product.rating)}
                          <Text ml={1} color={colorMode === "dark" ? "gray.300" : "gray.600"}>
                            ({product.reviews})
                          </Text>
                        </HStack>
                        
                        <Flex justify="space-between" align="center">
                          <Text 
                            fontWeight="bold" 
                            fontSize="xl"
                            color={colorMode === "dark" ? "teal.200" : "teal.600"}
                          >
                            R$ {product.price.toFixed(2)}
                          </Text>
                          
                          <Button 
                            colorScheme="teal" 
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                          >
                            <FaShoppingCart />
                          </Button>
                        </Flex>
                      </Box>
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
