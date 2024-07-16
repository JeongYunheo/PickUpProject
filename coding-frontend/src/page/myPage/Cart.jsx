import {
  Box,
  Button,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

export function Cart() {
  const account = useContext(LoginContext);
  const userId = account.id;
  const [cartItems, setCartItems] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/carts/${userId}`)
      .then((res) => {
        console.log("장바구니 데이터 조회 성공:", res.data);
        // 데이터를 가게별로 구분해서 처리하기
        const groupedByRestaurant = groupCartByRestaurant(res.data);
        setCartItems(groupedByRestaurant);
      })
      .catch((err) => {
        console.error("장바구니 데이터 조회 실패:", err);
      });
  }, [userId]);

  // 가게별로 장바구니 항목을 그룹화하는 함수
  const groupCartByRestaurant = (cartItems) => {
    const grouped = {};
    cartItems.forEach((item) => {
      const key = item.restaurantId;
      if (!grouped[key]) {
        grouped[key] = {
          items: [],
          totalPrice: 0,
        };
      }
      grouped[key].items.push(item);
      grouped[key].totalPrice += parseInt(item.totalPrice);
    });
    return grouped;
  };

  if (cartItems === null) {
    return <Spinner size="xl" />;
  }

  return (
    <VStack spacing={6} align="stretch">
      {Object.keys(cartItems).map((restaurantId) => (
        <Box
          key={restaurantId}
          borderWidth="1px"
          p={4}
          borderRadius="md"
          boxShadow="sm"
        >
          <Text
            cursor="pointer"
            fontSize="2xl"
            fontWeight="bold"
            mb={4}
            onClick={() => navigate(`/menu/${restaurantId}`)}
            color="teal.500"
          >
            가게 ID: {restaurantId}
          </Text>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>메뉴</Th>
                  <Th>수량</Th>
                  <Th>가격</Th>
                  <Th>합계 가격</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cartItems[restaurantId].items.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.menuName}</Td>
                    <Td>
                      <Button mr={2}>-</Button>
                      {item.menuCount}
                      <Button ml={2}>+</Button>
                    </Td>
                    <Td>{item.menuPrice} 원</Td>
                    <Td>
                      {(
                        item.menuCount *
                        parseInt(item.menuPrice.replace(/,/g, ""))
                      ).toLocaleString()}
                      원
                    </Td>
                  </Tr>
                ))}
                <Tr>
                  <Td colSpan={2} fontWeight="bold" textAlign="right">
                    총 가격:
                  </Td>
                  <Td fontWeight="bold">
                    {cartItems[restaurantId].totalPrice.toLocaleString()} 원
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Button w="full" colorScheme="teal" variant="solid" size="lg" mt={3}>
            주문하기
          </Button>
        </Box>
      ))}
    </VStack>
  );
}