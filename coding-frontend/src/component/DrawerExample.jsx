// DrawerExample.jsx
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faHeart,
  faRightFromBracket,
  faShoppingCart,
  faStar,
  faStore,
} from "@fortawesome/free-solid-svg-icons";

export function DrawerExample() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  const handleNavigateTo = (path) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    { icon: faShoppingCart, text: "장바구니", path: "/carts" },
    { icon: faClipboardList, text: "주문 내역", path: "/orders" },
    { icon: faHeart, text: "찜한 가게", path: "/favorites" },
    { icon: faStar, text: "리뷰 내역", path: "/reviews" },
    { icon: faStore, text: "입점하기", path: "/register" },
  ];

  return (
    <>
      <Button
        ref={btnRef}
        onClick={onOpen}
        bg="transparent"
        _hover={{ bg: "whiteAlpha.300" }}
      >
        <FontAwesomeIcon icon={faRightFromBracket} color="white" size="lg" />
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton color="#2AC1BC" />
          <DrawerHeader borderBottomWidth="1px" color="#2AC1BC">
            {account.nickName}님 안녕하세요!
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              {menuItems.map((item, index) => (
                <Box
                  key={index}
                  p={3}
                  borderRadius="md"
                  _hover={{ bg: "gray.100", color: "#2AC1BC" }}
                  cursor="pointer"
                  onClick={() => handleNavigateTo(item.path)}
                >
                  <Icon as={FontAwesomeIcon} icon={item.icon} mr={3} />
                  <Text display="inline" fontWeight="bold">
                    {item.text}
                  </Text>
                </Box>
              ))}
            </VStack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" onClick={onClose} colorScheme="teal">
              닫기
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}