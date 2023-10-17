import {
  updateCartApi,
  getShippingValue,
  getPromoCodeDetails,
  validatePromoCode,
  getAllActivePromoCodes,
  validateCartApi,
  getCartValidationMsg,
  setCartValidationMsg,
  getPromoCodeDetailsById,
} from '../../services/cart';
import {getProduct} from '../../services/products';
import {updateCart, applyCoupon, setCoupons} from '../../redux/actions/cart';
import {Vibration} from 'react-native';
import Toast from 'react-native-toast-message';

export const removeProduct = async (
  msn,
  cart,
  itemsList,
  sessionId,
  token,
  dispatch,
) => {
  let settingData = {
    ...cart,
    itemsList: itemsList.filter(_ => _.productId !== msn),
    noOfItems: cart.noOfItems - 1,
    cart: {
      ...cart.cart,
      totalPayableAmount: itemsList
        .filter(_ => _.productId !== msn)
        .reduce((acc, curr) => acc + curr.totalPayableAmount, 0),
      shippingCharges: itemsList
        .filter(_ => _.productId !== msn)
        .reduce((acc, curr) => acc + curr.shippingCharges, 0),
      shipping: itemsList
        .filter(_ => _.productId !== msn)
        .reduce((acc, curr) => acc + curr.shippingCharges, 0),
    },
  };
  const {data} = await updateCartApi(settingData, sessionId, token);
  // if (data.status) {
  //   Toast.show({
  //     type: 'success',
  //     text2: 'Product removed from cart',
  //     visibilityTime: 2000,
  //     autoHide: true,
  //   });
  // }
  dispatch(updateCart(settingData));
};

export const removeMultipleProducts = async (
  msns,
  cart,
  itemsList,
  sessionId,
  token,
  dispatch,
) => {
  let updatedCart = {...cart};
  updatedCart = {
    ...updatedCart,
    itemsList: itemsList.filter(_ => !msns.includes(_.productId)),
    noOfItems: cart.noOfItems - msns.length,
    cart: {
      ...cart.cart,
      totalPayableAmount: itemsList
        .filter(_ => !msns.includes(_.productId))
        .reduce((acc, curr) => acc + curr.totalPayableAmount, 0),
      shippingCharges: itemsList
        .filter(_ => !msns.includes(_.productId))
        .reduce((acc, curr) => acc + curr.shippingCharges, 0),
      shipping: itemsList
        .filter(_ => !msns.includes(_.productId))
        .reduce((acc, curr) => acc + curr.shippingCharges, 0),
    },
  };

  const {data} = await updateCartApi(updatedCart, sessionId, token);
  dispatch(updateCart(updatedCart));
};

export const updateQuantity = async (
  msn,
  value,
  cart,
  itemsList,
  sessionId,
  token,
  dispatch,
  userId,
) => {
  let updatedItemsList = [...itemsList];
  updatedItemsList = updatedItemsList.map(_ => {
    if (_.productId == msn) {
      return {
        ..._,
        productQuantity: value,
        totalPayableAmount: Number(_.productUnitPrice) * Number(value),
      };
    }
    return {..._};
  });

  let updatingData = {
    ...cart,
    cart: {
      ...cart.cart,
      shippingCharges: updatedItemsList.reduce(
        (accum, curr) => accum + curr.shippingCharges,
        0,
      ),
      totalPayableAmount:
        updatedItemsList.reduce(
          (accum, curr) => accum + curr.totalPayableAmount,
          0,
        ) +
        updatedItemsList.reduce(
          (accum, curr) => accum + curr.shippingCharges,
          0,
        ),
    },
    itemsList: updatedItemsList,
  };

  const {data} = await updateCartApi(updatingData, sessionId, token);
  if (userId) {
    let shippingRes = await requestshippingValue(
      updatingData,
      sessionId,
      token,
    );
    await validateCart(shippingRes, userId, sessionId, token, dispatch);
    Toast.show({
      type: 'success',
      text2: 'Cart quantity updated successfully!',
      visibilityTime: 2000,
      autoHide: true,
    });
  } else {
    dispatch(updateCart(updatingData));
    Toast.show({
      type: 'success',
      text2: 'Cart quantity updated successfully!',
      visibilityTime: 2000,
      autoHide: true,
    });
  }
};

export const requestshippingValue = async (cart, sessionId, token) => {
  let requestbody = {};
  requestbody = {
    totalPayableAmount: cart.cart.totalPayableAmount,
    itemsList: cart.itemsList.map(_ => ({
      categoryId: _.categoryCode,
      productId: _.productId,
      taxonomy: _.taxonomyCode,
    })),
  };
  const {data} = await getShippingValue(requestbody, sessionId, token);
  let updatedcart = {...cart};
  let productIds = Object.keys(data.data.itemShippingAmount || {});

  updatedcart = {
    ...updatedcart,
    cart: {
      ...updatedcart.cart,
      shippingCharges: data.data.totalShippingAmount,
      totalPayableAmount:
        updatedcart.itemsList.reduce(
          (accum, curr) => accum + curr.totalPayableAmount,
          0,
        ) + data.data.totalShippingAmount,
    },
    itemsList: updatedcart.itemsList.map(_ => {
      if (productIds.includes(_.productId)) {
        return {
          ..._,
          shipping: data.data.itemShippingAmount[_.productId],
          shippingCharges: data.data.itemShippingAmount[_.productId],
        };
      }
      return {..._};
    }),
  };
  return updatedcart;
};

export const applyCouponCode = async (
  couponParam,
  cart,
  sessionId,
  token,
  dispatch,
  getFromApi,
  showToast,
  setCouponSuccessModal,
) => {
  try {
    let coupon = couponParam;
    if (!couponParam.promoId) {
      const promoDetails = await getPromoCodeDetails(
        coupon.promoCode,
        sessionId,
        token,
      );
      coupon = promoDetails.data.data.promoAttributes;
    }
    if (getFromApi) {
      const promoDetails = await getPromoCodeDetailsById(
        coupon.promoId,
        sessionId,
        token,
      );
      coupon = promoDetails.data.data.promoAttributes;
    }

    let updatedcart = {...cart};
    updatedcart.offersList = [{offerId: coupon.promoId, type: '15'}];
    const {data} = await validatePromoCode(
      {shoppingCartDto: updatedcart},
      sessionId,
      token,
    );
    if (data.data && data.status) {
      if (data.data.discount <= cart.cart.totalPayableAmount) {
        dispatch(applyCoupon(coupon));
        updatedcart.cart.totalOffer = data.data.discount;
        updatedcart.extraOffer = null;
        let productIds = Object.keys(data.data.productDis || {});
        updatedcart.itemsList = updatedcart.itemsList.map((_, i) => {
          if (productIds.includes(_.productId)) {
            return {..._, offer: data.data.productDis[_.productId]};
          }
          return {..._, offer: null};
        });

        const cartRes = await updateCartApi(updatedcart, sessionId, token);

        const shippingData = await getShippingValue(
          {
            itemsList: updatedcart.itemsList.map(_ => ({
              categoryId: _.categoryCode,
              productId: _.productId,
              taxonomy: _.taxonomyCode,
            })),
            totalPayableAmount: updatedcart.cart.totalPayableAmount,
          },
          sessionId,
          token,
        );
        productIds = Object.keys(
          shippingData.data.data.itemShippingAmount || {},
        );

        updatedcart = {
          ...updatedcart,
          cart: {
            ...updatedcart.cart,
            shippingCharges: shippingData.data.data.totalShippingAmount,
            totalPayableAmount:
              updatedcart.itemsList.reduce(
                (accum, curr) => accum + curr.totalPayableAmount,
                0,
              ) + shippingData.data.data.totalShippingAmount,
          },
          itemsList: updatedcart.itemsList.map(_ => {
            if (productIds.includes(_.productId)) {
              return {
                ..._,
                shipping:
                  shippingData.data.data.itemShippingAmount[_.productId],
                shippingCharges:
                  shippingData.data.data.itemShippingAmount[_.productId],
              };
            }
            return {..._};
          }),
        };
        dispatch(updateCart(updatedcart));
        if (showToast) {
          // Toast.show({
          //   type: 'success',
          //   text2: 'Coupon applied successfully!',
          //   visibilityTime: 3000,
          //   autoHide: true,
          // });
          setCouponSuccessModal(true);
        }
      } else {
        await removePromo(cart, [], sessionId, token, dispatch);
        Toast.show({
          type: 'error',
          text2: 'Your cart amount is less than ' + data.data.discount,
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } else {
      await removePromo(cart, [], sessionId, token, dispatch);
      Toast.show({
        type: 'error',
        text2: data.statusDescription,
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const removePromo = async (
  cart,
  itemsList,
  sessionId,
  token,
  dispatch,
) => {
  let removePromocart = {...cart};
  removePromocart = {
    ...removePromocart,
    cart: {...removePromocart.cart, totalOffer: 0},
    itemsList: removePromocart.itemsList.map(_ => ({
      ..._,
      offer: null,
    })),
    offersList: null,
  };

  const {data} = await updateCartApi({...removePromocart}, sessionId, token);

  const shippingData = await getShippingValue(
    {
      itemsList: removePromocart.itemsList.map(_ => ({
        categoryId: _.categoryCode,
        productId: _.productId,
        taxonomy: _.taxonomyCode,
      })),
      totalPayableAmount: removePromocart.cart.totalPayableAmount,
    },
    sessionId,
    token,
  );
  let productIds = Object.keys(shippingData.data.data.itemShippingAmount || {});

  removePromocart = {
    ...removePromocart,
    cart: {
      ...removePromocart.cart,
      shippingCharges: shippingData.data.data.totalShippingAmount,
      totalPayableAmount:
        removePromocart.itemsList.reduce(
          (accum, curr) => accum + curr.totalPayableAmount,
          0,
        ) + shippingData.data.data.totalShippingAmount,
    },
    itemsList: removePromocart.itemsList.map(_ => {
      if (productIds.includes(_.productId)) {
        return {
          ..._,
          shipping: shippingData.data.data.itemShippingAmount[_.productId],
          shippingCharges:
            shippingData.data.data.itemShippingAmount[_.productId],
        };
      }
      return {..._};
    }),
  };

  dispatch(applyCoupon({}));
  dispatch(updateCart(removePromocart));
};

export const viewOffers = async (userId, sessionId, token, dispatch) => {
  const {data} = await getAllActivePromoCodes(userId, sessionId, token);
  dispatch(setCoupons(data.data));
};

export const validateCart = async (
  shippingRes,
  userId,
  sessionId,
  token,
  dispatch,
) => {
  const {data} = await validateCartApi(
    {shoppingCartDto: shippingRes},
    sessionId,
    token,
  );

  const productIds = Object.keys(data.data || {});
  let updatedItemsList = [...shippingRes.itemsList];
  if (data.data && shippingRes.itemsList && shippingRes.itemsList.length) {
    updatedItemsList = updatedItemsList.map((_, i) => {
      if (productIds.includes(_.productId)) {
        return {
          ..._,
          msg: {
            ..._,
            data: {
              productName: _.productName,
              oPrice: data.data[_.productId].updates.outOfStockFlag
                ? ''
                : data.data[_.productId].updates.shipping
                ? ''
                : data.data[_.productId].updates.coupon
                ? ''
                : _ && _.priceWithoutTax,
              nPrice: data.data[_.productId].updates.outOfStockFlag
                ? ''
                : data.data[_.productId].updates.shipping
                ? ''
                : data.data[_.productId].updates.coupon
                ? ''
                : data.data[_.productId].productDetails &&
                  data.data[_.productId].productDetails.priceWithoutTax,
              text1: data.data[_.productId].updates.outOfStockFlag
                ? ' is currently Out of Stock. Please remove from cart'
                : data.data[_.productId].updates.shipping
                ? 'Shipping Charges have been updated'
                : data.data[_.productId].updates.coupon
                ? 'Applied Promo Code has been updated.'
                : data.data[_.productId].updates &&
                  data.data[_.productId].updates.priceWithoutTax
                ? ' Price has been updated from ₹'
                : '',
              text2: data.data[_.productId].updates.outOfStockFlag
                ? ''
                : data.data[_.productId].updates.shipping
                ? ''
                : data.data[_.productId].updates.coupon
                ? ''
                : data.data[_.productId].updates &&
                  data.data[_.productId].updates.priceWithoutTax
                ? 'to ₹'
                : '',
            },
            type: data.data[_.productId].updates.outOfStockFlag
              ? 'oos'
              : data.data[_.productId].updates.shipping
              ? 'shipping'
              : data.data[_.productId].updates.coupon
              ? 'coupon'
              : data.data[_.productId].updates &&
                data.data[_.productId].updates.priceWithoutTax
              ? 'price'
              : '',
          },
        };
      }
      return {..._};
    });

    // dispatch(updateCart({...shippingRes, itemsList: updatedItemsList}));
  }
  if (userId) {
    const validationMsgs = await getCartValidationMsg(userId, sessionId, token);

    updatedItemsList = updatedItemsList.map((_, i) => {
      return {
        ..._,
        msg: _.msg
          ? _.msg
          : validationMsgs.data.data.find(item => item.msnid == _.productId)
          ? validationMsgs.data.data.find(item => item.msnid == _.productId)
          : _.msg || null,
      };
    });

    updatedItemsList = updatedItemsList.map((_, i) => {
      return {
        ..._,
        msg: _.msg
          ? {
              ..._.msg,
              data: {
                ..._.msg.data,
                text1:
                  _.msg.type == 'price'
                    ? ' Price has been updated from ₹'
                    : _.msg.data.text1,
                text2: _.msg.type == 'price' ? 'to ₹' : _.msg.data.text2,
              },
            }
          : null,
      };
    });

    let postObj = [...updatedItemsList];
    postObj = postObj.filter(_ => _.msg).map(_ => _.msg);

    await setCartValidationMsg(postObj, userId, sessionId, token);
  }

  dispatch(updateCart({...shippingRes, itemsList: updatedItemsList}));
  if (shippingRes && shippingRes.offersList && shippingRes.offersList.length) {
    applyCouponCode(
      {promoId: shippingRes.offersList[0].offerId},
      {...shippingRes, itemsList: updatedItemsList},
      sessionId,
      token,
      dispatch,
      true,
    );
  }
};

export const addtoCart = async (
  cart,
  msn,
  product,
  dispatch,
  sessionId,
  token,
  navigation,
  quantity,
  getFromApi,
  showToast,
  navigateToBuyNow,
  authenticated,
  popUpFunction,
  webEngageEvent,
) => {
  let productData = {...product};
  if (getFromApi) {
    const productBoData = await getProduct(msn);
    productData = {...productBoData.data.productBO};
  }
  if (
    productData.quantityAvailable &&
    (
      ((productData.productPartDetails || {})[msn] || {})
        .productPriceQuantity || {}
    ).india
  ) {
    if (
      productData.quantityAvailable <
      ((productData.productPartDetails &&
        productData.productPartDetails[msn] &&
        productData.productPartDetails[msn].productPriceQuantity &&
        productData.productPartDetails[msn].productPriceQuantity.india &&
        productData.productPartDetails[msn].productPriceQuantity.india.moq) ||
        quantity)
    ) {
      Toast.show({
        type: 'error',
        text2: `Only ${productData.quantityAvailable} unit(s) available in stock.`,
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }
    let productIndiadata =
      productData.productPartDetails[msn].productPriceQuantity.india;
    let moqQuantity =
      productData.productPartDetails &&
      productData.productPartDetails[msn] &&
      productData.productPartDetails[msn].productPriceQuantity &&
      productData.productPartDetails[msn].productPriceQuantity.india &&
      productData.productPartDetails[msn].productPriceQuantity.india.moq >
        quantity
        ? productData.productPartDetails &&
          productData.productPartDetails[msn] &&
          productData.productPartDetails[msn].productPriceQuantity &&
          productData.productPartDetails[msn].productPriceQuantity.india &&
          productData.productPartDetails[msn].productPriceQuantity.india.moq
        : quantity;
    let cartproductData = {
      amount: productIndiadata.mrp,
      amountWithOffer: null,
      amountWithTaxes: null,
      brandName: productData.brandDetails.brandName,
      bulkPrice: null,
      bulkPriceMap: {india: []},
      bulkPriceWithoutTax: null,
      buyNow: false,
      cartId: cart.cart && cart.cart.cartId,
      categoryCode: productData.categoryDetails[0].categoryCode,
      createdAt: new Date(),
      expireAt: null,
      isPersistant: true,
      offer: null,
      priceWithoutTax: productIndiadata.priceWithoutTax,
      productId: msn,
      productImg:
        'https://img.moglimg.com/' +
        productData.productPartDetails[msn].images[0].links.small,
      productName: productData.productName,
      productQuantity: moqQuantity,
      productUnitPrice: productIndiadata.sellingPrice,
      productUrl: productData.defaultCanonicalUrl,
      taxPercentage: productIndiadata.taxRule.taxPercentage,
      taxes: 0,
      taxonomyCode: productData.categoryDetails[0].taxonomyCode,
      totalPayableAmount:
        (productIndiadata.priceWithoutTax +
          productIndiadata.sellingPrice -
          productIndiadata.priceWithoutTax) *
        moqQuantity,
      updatedAt: null,
    };
    let itemsList = [...cart.itemsList];
    let productFound = false;
    itemsList = itemsList.map(_ => {
      if (_.productId == msn) {
        productFound = true;
        return {
          ..._,
          productQuantity: _.productQuantity + moqQuantity,
          amount: _.amount * (_.productQuantity + moqQuantity),
          totalPayableAmount:
            _.productUnitPrice * (_.productQuantity + moqQuantity),
        };
      }
      return {..._};
    });
    if (!productFound) {
      itemsList.push(cartproductData);
    }
    let updatedcartData = {...cart};
    updatedcartData = {
      ...updatedcartData,
      cart: {
        ...updatedcartData.cart,
        totalAmount: itemsList.reduce(
          (acc, curr) => Number(acc) + Number(curr.amount),
          0,
        ),
        totalPayableAmount: itemsList.reduce(
          (acc, curr) => Number(acc) + Number(curr.totalPayableAmount),
          0,
        ),
      },
      itemsList: [...itemsList],
      noOfItems: productFound
        ? updatedcartData.noOfItems
        : updatedcartData.noOfItems + 1,
    };
    const {data} = await updateCartApi(updatedcartData, sessionId, token);
    let shippingRes = await requestshippingValue(
      updatedcartData,
      sessionId,
      token,
    );
    dispatch(updateCart(shippingRes));
    Vibration.vibrate(100);
    if (popUpFunction) {
      Toast.show({
        type: 'view_cart_toast',
        text2: 'Product added to cart',
        visibilityTime: 1000,
        autoHide: true,
        onPress: () => popUpFunction(msn, productData, quantity),
      });
    }
    if (showToast) {
      Toast.show({
        type: 'success',
        text2: 'Product added to cart',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
    if (navigateToBuyNow) {
      if (authenticated == 'true') {
        navigation.push('Checkout', {
          fromBuyNow: true,
        });
      } else {
        navigation.push('Cart');
      }
    } else {
      navigation.push('Cart');
    }
  }
  if (webEngageEvent) {
    webEngageEvent();
  }
};
//fbt add to cart

export const bulkAddtoCart = async (
  cart,
  products,
  dispatch,
  sessionId,
  token,
  navigation,
) => {
  let productsData = [...products];
  let updatedcartData = {...cart};
  await Promise.all(
    productsData.map(async _ => {
      let productData = {..._};
      if (!_.isParent) {
        const productBoData = await getProduct(_.partNumber);
        productData = {...productBoData.data.productBO};
      }

      if (
        productData.quantityAvailable &&
        (
          ((productData.productPartDetails || {})[_.partNumber] || {})
            .productPriceQuantity || {}
        ).india
      ) {
        let productIndiadata =
          productData.productPartDetails[_.partNumber].productPriceQuantity
            .india;
        let cartproductData = {
          amount: productIndiadata.mrp,
          amountWithOffer: null,
          amountWithTaxes: null,
          brandName: productData.brandDetails.brandName,
          bulkPrice: null,
          bulkPriceMap: {india: []},
          bulkPriceWithoutTax: null,
          buyNow: false,
          cartId: cart.cart.cartId,
          categoryCode: productData.categoryDetails[0].categoryCode,
          createdAt: new Date(),
          expireAt: null,
          isPersistant: true,
          offer: null,
          priceWithoutTax: productIndiadata.priceWithoutTax,
          productId: _.partNumber,
          productImg:
            'https://img.moglimg.com/' +
            productData.productPartDetails[_.partNumber].images[0].links.small,
          productName: productData.productName,
          productQuantity: _.quantity,
          productUnitPrice: productIndiadata.sellingPrice,
          productUrl: productData.defaultCanonicalUrl,
          taxPercentage: productIndiadata.taxRule.taxPercentage,
          taxes: 0,
          taxonomyCode: productData.categoryDetails[0].taxonomyCode,
          totalPayableAmount:
            (productIndiadata.priceWithoutTax +
              productIndiadata.sellingPrice -
              productIndiadata.priceWithoutTax) *
            _.quantity,
          updatedAt: null,
        };

        let itemsList = [...updatedcartData.itemsList];
        let productFound = false;
        itemsList = itemsList.map(itemListItem => {
          if (itemListItem.productId == _.partNumber) {
            productFound = true;
            return {
              ...itemListItem,
              productQuantity: itemListItem.productQuantity + _.quantity,
              amount:
                itemListItem.amount *
                (itemListItem.productQuantity + _.quantity),
              totalPayableAmount:
                itemListItem.productUnitPrice *
                (itemListItem.productQuantity + _.quantity),
            };
          }
          return {...itemListItem};
        });
        if (!productFound) {
          itemsList.push(cartproductData);
        }

        updatedcartData = {
          ...updatedcartData,
          cart: {
            ...updatedcartData.cart,
            totalAmount: itemsList.reduce(
              (acc, curr) => Number(acc) + Number(curr.amount),
              0,
            ),
            totalPayableAmount: itemsList.reduce(
              (acc, curr) => Number(acc) + Number(curr.totalPayableAmount),
              0,
            ),
          },
          itemsList: [...itemsList],
          noOfItems: productFound
            ? updatedcartData.noOfItems
            : updatedcartData.noOfItems + 1,
        };
        return updatedcartData;
      }
    }),
  );
  const {data} = await updateCartApi(updatedcartData, sessionId, token);
  dispatch(updateCart(updatedcartData));
  Toast.show({
    type: 'success',
    text2: 'Product(s) added to cart',
    visibilityTime: 2000,
    autoHide: true,
  });
  navigation.push('Cart');
};
