import {Badge, Box, Button, Divider, Flex, Heading, Spinner, Text, useDisclosure, VStack} from "@chakra-ui/react";
import React, {useContext, useEffect, useState} from "react";
import {LoginContext} from "../../component/LoginProvider.jsx";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {ReviewModal} from "./ReviewModal.jsx";

export function OrderList() {
    const account = useContext(LoginContext);
    const userId = account.id;
    const [orderList, setOrderList] = useState(null);
    const [restaurantInfo, setRestaurantInfo] = useState({});
    const navigate = useNavigate();
    const {onClose, onOpen, isOpen} = useDisclosure();
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    useEffect(() => {
        axios.get(`/api/orders/${userId}`).then((res) => {
            console.log(res.data);
            const groupedOrders = groupOrders(res.data);
            setOrderList(groupedOrders);

            const restaurantIds = [...new Set(res.data.map(order => order.restaurantId))];
            console.log("레스토랑 ID들:", restaurantIds);

            Promise.all(
                restaurantIds.map((id) =>
                    axios.get(`/api/menus/${id}`)
                        .then((res) => ({
                            id,
                            data: res.data
                        }))
                )
            )
                .then((responses) => {
                    console.log("응답 데이터들:", responses);
                    const info = {};
                    responses.forEach(({id, data}) => {
                        info[id] = data.basicInfo;
                    });
                    setRestaurantInfo(info);
                })
                .catch((err) => {
                    console.error("가게 데이터 조회 실패:", err);
                });
        })
            .catch((err) => {
                console.error("주문 데이터 조회 실패:", err);
            });
    }, []);

    const groupOrders = (orders) => {
        return orders.reduce((acc, order) => {
            const key = `${order.orderId}`;
            if (!acc[key]) {
                acc[key] = {
                    restaurantId: order.restaurantId,
                    inserted: order.inserted,
                    pickUpStatus: order.pickUpStatus,
                    paymentStatus: order.paymentStatus,
                    items: []
                };
            }
            acc[key].items.push(order);
            return acc;
        }, {});
    };

    if (orderList === null || Object.keys(restaurantInfo).length === 0) {
        return <Spinner/>;
    }

    function handleOpenModal(restaurantId) {
        setSelectedRestaurant(restaurantId);
        onOpen();
    }

    return (
        <Box maxW="800px" margin="auto" p={5}>
            <Heading mb={6}>주문 내역</Heading>
            <VStack spacing={6} align="stretch">
                {Object.values(orderList).map((group, index) => (
                    <Box key={index} borderWidth={1} borderRadius="lg" p={4} boxShadow="md">
                        <Box>
                            {group.pickUpStatus ?
                                <Badge>픽업완료</Badge> : <Badge>픽업대기</Badge>
                            }
                            {group.orderId !== null ?
                                <Button onClick={() => handleOpenModal(group.restaurantId)}>리뷰쓰기</Button> :
                                <Badge>리뷰 작성 불가</Badge>
                            }
                        </Box>
                        <Flex justify="space-between" align="center" mb={3}>
                            <Text
                                cursor="pointer"
                                fontSize="2xl"
                                fontWeight="bold"
                                onClick={() => navigate(`/menu/${group.restaurantId}`)}
                                color="teal.500"
                            >
                                가게 이름 : {restaurantInfo[group.restaurantId]?.placenamefull || "정보 없음"}
                            </Text>
                            <Badge colorScheme="green">{new Date(group.inserted).toLocaleString()}</Badge>
                        </Flex>
                        <Divider mb={3}/>
                        {group.items.map((item, itemIndex) => (
                            <Box key={itemIndex} mb={2}>
                                <Flex justify="space-between">
                                    <Text fontWeight="bold">{item.menuName}</Text>
                                    <Text>{item.menuCount}개</Text>
                                </Flex>
                                {item.menuPrice === null || <Text color="gray.600">가격: {item.menuPrice}원</Text>}
                            </Box>
                        ))}
                        <Divider mt={3} mb={3}/>
                        <Flex justify="flex-end">
                            <Text fontWeight="bold">
                                총 금액: {group.items.reduce((sum, item) => {
                                return sum + item.menuCount * item.menuPrice;
                            }, 0).toLocaleString()}원
                            </Text>
                        </Flex>
                        <ReviewModal
                            restaurantName={restaurantInfo[group.restaurantId]?.placenamefull || "정보 없음"}
                            isOpen={isOpen}
                            onClose={onClose}
                            selectedRestaurant={selectedRestaurant}
                            userId={userId}
                        />
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}