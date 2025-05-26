'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Image,
  Spinner,
  useToast,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { SiSearxng } from "react-icons/si";
import { IoMenu } from "react-icons/io5";
import { BsCart4 } from "react-icons/bs"; // Importar o ícone
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';

export default function HomePage() {
  const [pesquisa, setPesquisa] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const produtosResponse = await api.get('/produtos');
        setProdutos(produtosResponse.data.data);

        const bannersResponse = await api.get('/banners');
        setBanners(bannersResponse.data.data);
      } catch (error) {
        toast({
          title: 'Erro ao carregar dados',
          description: 'Não foi possível carregar os produtos e banners. Tente novamente mais tarde.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <Box minH="100vh" bg="#1a202c" p={8} position="relative">
      {/* Botão de Menu e Ícone de Carrinho no canto superior esquerdo */}
      <HStack position="absolute" top={4} left={4} spacing={4} zIndex="dropdown">
        <Menu>
          <MenuButton as={IconButton} icon={<IoMenu />} variant="outline" colorScheme="whiteAlpha" />
          <MenuList bg="#2d3748" borderColor="gray.700"> {/* Ajustar fundo e borda do menu */}
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => router.push('/home')}
            >
              Home
            </MenuItem>
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => router.push('/produtos')}
            >
              Produtos
            </MenuItem>
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => router.push('/pedidos')}
            >
              Pedidos
            </MenuItem>
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => router.push('/enderecos')}
            >
              Endereços
            </MenuItem>
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => router.push('/perfil')}
            >
              Perfil
            </MenuItem>
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => console.log('Excluir Conta')}
            >
              Excluir Conta
            </MenuItem>
            <MenuItem
              bg="#2d3748"
              color="white"
              _hover={{ bg: "#4a5568" }}
              _focus={{ bg: "#4a5568" }}
              onClick={() => console.log('Sair')}
            >
              Sair
            </MenuItem>
          </MenuList>
        </Menu>
        <IconButton
          icon={<BsCart4 />}
          aria-label="Carrinho"
          variant="outline"
          colorScheme="whiteAlpha"
          onClick={() => console.log('Abrir Carrinho')}
        />
      </HStack>

      {/* Card para a logo no canto superior direito com bordas arredondadas */}
      <Box
        position="absolute"
        top={4}
        right={4}
        bg="#4a5568" // Fundo mais claro
        p={0} // Reduzindo o padding
        borderRadius="full" // Bordas totalmente arredondadas
        boxShadow="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image src="/images/logo_transparente.png" alt="Logo" boxSize="120px" objectFit="contain" /> {/* Reduzindo o tamanho da imagem */}
      </Box>

      <VStack spacing={6} align="stretch" pt={16}>
        <Heading color="white" textAlign="center">
          Bem-vindo à DeliveXpress
        </Heading>

        {/* Campo de Pesquisa */}
        <InputGroup width="400px" alignSelf="center">
          <InputLeftElement pointerEvents="none">
            <SiSearxng color="gray" />
          </InputLeftElement>
          <Input
            placeholder="Pesquisar produtos, restaurantes..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            bg="#4a5568"
            border="none"
            color="white"
            _placeholder={{ color: "gray.400" }}
            _hover={{ bg: "#2d3748" }}
            _focus={{ bg: "#2d3748", boxShadow: "outline" }}
          />
        </InputGroup>

        {/* Banners */}
        <Box>
          {loading && !banners.length ? ( // Mostrar spinner para banners apenas se estiver carregando e não houver banners
            <Flex justify="center" align="center" minH="100px">
              <Spinner size="xl" color="white"/>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
              {banners.map((banner) => (
                <Box key={banner.id} bg="#2d3748" rounded="md" overflow="hidden" shadow="md"> {/* Ajustado bg e adicionado shadow */}
                  <Image src={banner.imagemUrl} alt={banner.titulo} w="100%" h={{ base: "150px", md: "200px" }} objectFit="cover" />
                  <Text color="white" fontWeight="bold" textAlign="center" p={3}>
                    {banner.titulo}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Lista de Produtos */}
        <Box>
          <Heading size="lg" color="white" mb={4} textAlign="center">Nossos Produtos</Heading> {/* Adicionado título para a seção de produtos */}
          {loading && !produtosFiltrados.length ? ( // Mostrar spinner para produtos apenas se estiver carregando e não houver produtos
            <Flex justify="center" align="center" minH="200px">
              <Spinner size="xl" color="white"/>
            </Flex>
          ) : (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}> {/* Ajustado o número de colunas e espaçamento */}
              {produtosFiltrados.map((produto) => (
                <Box
                  key={produto.id}
                  bg="#2d3748" // Cor de fundo mais escura para contraste
                  rounded="lg" // Bordas mais arredondadas
                  overflow="hidden"
                  p={4}
                  textAlign="center" // Centralizar todo o conteúdo do card
                  shadow="lg" // Sombra mais pronunciada
                  transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
                  _hover={{
                    transform: "translateY(-5px)",
                    shadow: "xl",
                  }}
                >
                  <Image
                    src={produto.imagem}
                    alt={produto.nome}
                    boxSize={{ base: "120px", md: "150px" }} // Tamanho da imagem responsivo
                    objectFit="contain" // Mudar para contain se as imagens estiverem cortadas
                    mx="auto"
                    mb={4}
                    rounded="md"
                  />
                  <Text color="white" fontWeight="bold" fontSize={{ base: "md", md: "lg" }} noOfLines={2}> {/* Limitar número de linhas */}
                    {produto.nome}
                  </Text>
                  <Text color="teal.300" fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" mt={2}>
                    R$ {typeof produto.preco === 'number' ? produto.preco.toFixed(2) : 'N/A'}
                  </Text>
                  <Button 
                    mt={4} 
                    colorScheme="teal" 
                    size="sm"
                    onClick={() => router.push(`/produtos/${produto.id}`)} // Exemplo de navegação para detalhe do produto
                  >
                    Ver detalhes
                  </Button>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </Box>
  );
}