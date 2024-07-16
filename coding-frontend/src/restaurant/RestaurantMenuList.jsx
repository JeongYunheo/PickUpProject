import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MenuList } from "./MenuList.jsx";
import { CartList } from "./CartList.jsx";
import { LoginContext } from "../component/LoginProvider.jsx";

export function RestaurantMenuList() {
  const { placeId } = useParams();
  const [placeInfo, setPlaceInfo] = useState(null);
  const [cart, setCart] = useState({});
  const account = useContext(LoginContext);
  const userId = account.id;

  useEffect(() => {
    axios
      .get(`/api/menus/${placeId}`)
      .then((res) => {
        console.log(res.data);
        setPlaceInfo(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch menu data", err);
      });

    axios
      .get(`/api/cart/${userId}/${placeId}`)
      .then((res) => {
        console.log(res.data);
        const cartData = res.data.reduce((acc, item) => {
          acc[item.menuName] = {
            menu: item.menuName,
            price: item.menuPrice,
            count: item.menuCount,
          };
          return acc;
        }, {});
        setCart(cartData);
      })
      .catch((err) => {
        console.error("Failed to fetch cart data", err);
      });
  }, [placeId]);

  const handleRemove = (menu) => {
    setCart((preCart) => {
      const newCart = { ...preCart };
      if (newCart[menu.menu] && newCart[menu.menu].count > 0) {
        newCart[menu.menu].count -= 1;
        if (newCart[menu.menu].count === 0) {
          delete newCart[menu.menu];
        }
      }
      return newCart;
    });
  };

  const handleAdd = (menu) => {
    setCart((preCart) => {
      const newCart = { ...preCart };
      if (newCart[menu.menu]) {
        newCart[menu.menu].count += 1;
      } else {
        newCart[menu.menu] = { ...menu, count: 1 };
      }
      return newCart;
    });
  };

  if (placeInfo === null) {
    return <Spinner />;
  }

  return (
    <Box p={4}>
      <Flex spacing={6} align="stretch" justifyContent="space-between">
        <Box flex="1" mr={4}>
          <Heading size="lg" mb={4}>
            메뉴 정보
          </Heading>
          <Text mb={4}>메뉴 개수: {placeInfo.menuInfo.menucount}</Text>
          <MenuList
            menuList={placeInfo.menuInfo.menuList}
            cart={cart}
            handleAdd={handleAdd}
            handleRemove={handleRemove}
          />
        </Box>
        <Box
          flex="1"
          position="sticky"
          top="0"
          maxHeight="calc(100vh - 100px)"
          overflowY="auto"
        >
          <Heading size="lg" mb={4}>
            장바구니
          </Heading>
          <Text mb={4}>주문내역</Text>
          <CartList
            cart={cart}
            menuList={placeInfo.menuInfo.menuList}
            placeId={placeId}
          />
        </Box>
      </Flex>
    </Box>
  );
}
