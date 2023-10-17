import React, {useRef, useState} from 'react';
import {Image, ScrollView, TouchableOpacity, Text, View} from 'react-native';
import styles from './Faqstyle';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Dimension from '../../redux/constants/dimensions';
import Header from '../../components/Common/Header';
// import { Image } from 'react-native-elements';

const FaqScreen = props => {
  let scrollRef = useRef();
  const [selectedIndex, setSelectedIndex] = useState('');
  const [selectedCatIndex, setSelectedCatIndex] = useState(0);

  return (
    <>
      <Header navigation={props.navigation} showBack showText={'FAQs'} />
      <View>
        <ScrollView horizontal={true}>
          <View style={styles.scrollView}>
            <TouchableOpacity
              onPress={() => {
                if (
                  scrollRef &&
                  scrollRef.current &&
                  scrollRef.current.scrollTo
                ) {
                  scrollRef.current.scrollTo({
                    x: 0,
                    y: 0,
                    animated: true,
                  });
                }
                setSelectedCatIndex(0);
              }}
              style={
                selectedCatIndex == 0 ? styles.selectedFaqItem : styles.FaqItem
              }>
              <Text
                style={
                  selectedCatIndex == 0
                    ? styles.selectedFaqText
                    : styles.FaqText
                }>
                Order Tracking
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (
                  scrollRef &&
                  scrollRef.current &&
                  scrollRef.current.scrollTo
                ) {
                  scrollRef.current.scrollTo({
                    x: 0,
                    y: 1300,
                    animated: true,
                  });
                }
                setSelectedCatIndex(1);
              }}
              style={
                selectedCatIndex == 1 ? styles.selectedFaqItem : styles.FaqItem
              }>
              <Text
                style={
                  selectedCatIndex == 1
                    ? styles.selectedFaqText
                    : styles.FaqText
                }>
                Pre-Order Queries
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (
                  scrollRef &&
                  scrollRef.current &&
                  scrollRef.current.scrollTo
                ) {
                  scrollRef.current.scrollTo({
                    x: 0,
                    y: 1680,
                    animated: true,
                  });
                }
                setSelectedCatIndex(2);
              }}
              style={
                selectedCatIndex == 2 ? styles.selectedFaqItem : styles.FaqItem
              }>
              <Text
                style={
                  selectedCatIndex == 2
                    ? styles.selectedFaqText
                    : styles.FaqText
                }>
                Refund
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (
                  scrollRef &&
                  scrollRef.current &&
                  scrollRef.current.scrollTo
                ) {
                  scrollRef.current.scrollTo({
                    x: 0,
                    y: 2210,
                    animated: true,
                  });
                }
                setSelectedCatIndex(3);
              }}
              style={
                selectedCatIndex == 3 ? styles.selectedFaqItem : styles.FaqItem
              }>
              <Text
                style={
                  selectedCatIndex == 3
                    ? styles.selectedFaqText
                    : styles.FaqText
                }>
                Customer return Policy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (
                  scrollRef &&
                  scrollRef.current &&
                  scrollRef.current.scrollTo
                ) {
                  scrollRef.current.scrollTo({
                    x: 0,
                    y: 2480,
                    animated: true,
                  });
                }
                setSelectedCatIndex(4);
              }}
              style={
                selectedCatIndex == 4 ? styles.selectedFaqItem : styles.FaqItem
              }>
              <Text
                style={
                  selectedCatIndex == 4
                    ? styles.selectedFaqText
                    : styles.FaqText
                }>
                Payment Options
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <ScrollView ref={scrollRef} contentContainerStyle={{padding: 20}}>
        <View style={styles.mainGreyBg}>
          {/* Your Order section */}
          <TouchableOpacity
            style={styles.orderNavigate}
            onPress={() => props.navigation.navigate('Orders')}>
            <FAIcon name={'file'} size={24} style={styles.fileicon} />
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>Your Orders</Text>
              <Text style={styles.ordersubText}>
                Track, return or view an order
              </Text>
            </View>
            <MatIcon
              name={'keyboard-arrow-right'}
              style={styles.rightarrowicon}
              size={24}
            />
          </TouchableOpacity>
        </View>
        {/* <View style={styles.scrollAreaForContent}>
          <View style={styles.faqScrollArea}> */}
        {/* Order Tracking View  */}
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
                        <View style={styles.orderTextWrap}>
                            <Text style={styles.orderText}>How do I place an order?</Text>
                        </View>
                         <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
                        </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex === 0 ? '' : 0)}
            //     this.setState(prevState => ({
            //         faq1: !prevState.faq1
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>How do I place an order?</Text>
            </View>
            <MatIcon
              name={
                selectedIndex === 0
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex === 0 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Ordering at Moglix is easy. Placing your first order at Moglix?
                Please follow the below mentioned steps:
              </Text>
              {/* Left aligned Image with Text */}
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/faq/faq-ordert1.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                <View
                  style={{
                    marginLeft: 15,
                    paddingTop: 10,
                    flex: 1,
                    alignSelf: 'flex-start',
                  }}>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Select item(s) you want to buy. After selecting the
                      product(s), click on your cart.
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Here you can review the item(s) you have selected for
                      purchase
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>Click on Place Order</Text>
                  </View>
                </View>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  You will be redirected to another page, where you will be
                  asked for Invoice Type –Choose either Retail Invoice or Tax
                  Invoice. Click Continue.
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  Fill in your complete Shipping Address. Click Continue
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  Choose your Payment Method and fill in your payment details.
                </Text>
              </View>

              <Text style={styles.onlyText}>
                If you need any assistance give us a call. We would love to take
                your order over phone. You may contact us on +91 8448 233 444 to
                book your order on COD mode.
              </Text>
              <Text style={styles.boldText}>
                {' '}
                Call Timings:- 9:30 AM to 7 PM.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
                        <View style={styles.orderTextWrap}>
                            <Text style={styles.orderText}>Does Moglix sell the products?</Text>
                        </View>                        
                    <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
                        </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 48 ? '' : 48)}
            //     this.setState(prevState => ({
            //         faq2: !prevState.faq2
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Does Moglix sell the products?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 48
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 48 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                All the products on this website are sold by the suppliers
                registered with Moglix directly to the customers. Moglix
                provides only the marketplace services to its customers and
                suppliers. Moglix protects the interests of its buyers under
                buyer protection policy. More more details, please read our
                FAQs.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
                        <View style={styles.orderTextWrap}>
                            <Text style={styles.orderText}>How will my order be delivered to me?</Text>
                        </View>
                        <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} /> 
                        </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 1 ? '' : 1)}
            //     this.setState(prevState => ({
            //         faq3: !prevState.faq3
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                How will my order be delivered to me?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 1 ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 1 ? (
            <View style={styles.faqView}>
              {/* Left aligned Image with Text */}
              <View style={styles.textWithCreative}>
                <Image
                  source={require('../../assets/images/faq/faq-ordert2.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                <Text style={styles.creativeText}>
                  Your order would be delivered through reputed courier
                  companies at your doorstep. Bulk Orders (greater than 10) &
                  heavy items are shipped through surface & may take more than
                  10 days for delivery.
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
                        <View style={styles.orderTextWrap}>
                            <Text style={styles.orderText}>How will I know if order is placed successfully?</Text>
                        </View>
                        <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
                        </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 2 ? '' : 2)}
            //     this.setState(prevState => ({
            //         faq4: !prevState.faq4
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                How will I know if order is placed successfully?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 2 ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 2 ? (
            <View style={styles.faqView}>
              {/* Left aligned Image with Text */}
              <View style={styles.textWithCreative}>
                <Image
                  source={require('../../assets/images/faq/faq-ordert3.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                <Text style={styles.creativeText}>
                  When you place an order, you receive a confirmation email and
                  a text message from Moglix.com. This mail will have all the
                  details related to your order.
                </Text>
              </View>
              <Text style={styles.onlyText}>
                Order details can also be viewed at the website. Sign In into
                your account, then click on My Account &#8250; Order history.
                (For this, you must place an order through your login id)
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>What is the standard delivery time?</Text>
            </View>
            <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 3 ? '' : 3)}
            //     this.setState(prevState => ({
            //         faq5: !prevState.faq5
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                What is the standard delivery time?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 3 ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 3 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Standard delivery time is 2-4 days; however, for some products,
                delivery time may vary depending upon the availability or size
                of the order.{' '}
              </Text>
              <Text style={styles.onlyText}>
                Time taken to deliver a product also depends on the following
                parameters:
              </Text>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>Stock availability</Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>Size of the order</Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>Shipping Address</Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>Size of the product </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>Make to Order products</Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>I got a confirmation call for my order. Why is that?</Text>
            </View>
          <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 4 ? '' : 4)}
            //     this.setState(prevState => ({
            //         faq8: !prevState.faq8
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                I got a confirmation call for my order. Why is that?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 4 ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 4 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Moglix calls a customer to confirm order for two reasons:
              </Text>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  If the order value (COD Orders) is big{' '}
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  If the COD order is delayed due to some unforeseen reasons, a
                  customer is asked if he still wants it to get delivered
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Do you take orders over phone?</Text>
            </View>
            <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 5 ? '' : 5)}
            //     this.setState(prevState => ({
            //         faq9: !prevState.faq9
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Do you take orders over phone?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 5 ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 5 ? (
            <View style={styles.faqView}>
              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <Text style={styles.creativeTextLeft}>
                  Yes, we do take orders over the phone. You may contact us on
                  +91 8448 233 444 to book your order on COD payment mode. Call
                  Timings: 9:30 AM to 7 PM
                </Text>
                <Image
                  source={require('../../assets/images/faq/faq-ordert4.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>How do I check the status of my order?</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 6 ? '' : 6)}
            //     this.setState(prevState => ({
            //         faq10: !prevState.faq10
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                How do I check the status of my order?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 6 ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 6 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                At Moglix, we update you about the status of your order at every
                step through Emails and SMS.
              </Text>
              <View style={styles.textWithCreative}>
                <Image
                  source={require('../../assets/images/faq/faq-ordert5.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                <View style={styles.creativeText}>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      When you place an order, you get a confirmation email/SMS
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      When your order is dispatched, you receive an SMS with
                      Order Tracking details
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <View style={styles.list}>
                  <View style={styles.dot}></View>
                  <Text style={styles.onlyText}>
                    If your order gets delayed due to unforeseen events, you
                    receive a special update from our end
                  </Text>
                </View>
              </View>
              <Text style={styles.onlyText}>
                If you do not see any updates, kindly check your spam and
                message box.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Why have I not received my order yet?</Text>
            </View>
            <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 7 ? '' : 7)}
            //     this.setState(prevState => ({
            //         faq11: !prevState.faq11
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Why have I not received my order yet?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 7 ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 7 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Generally, Moglix takes 4-7 working days in delivering the
                order.{' '}
              </Text>
              <Text style={styles.onlyText}>
                However, other factors like order size, address Pincode etc, can
                be a few other reasons for order delay.
              </Text>
              <Text style={styles.onlyText}>
                You can check the status of your order on the website. Go to my
                account &#8250; My Orders. Click on TRACK ORDER to get real-time
                status of your order.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Can I place a bulk order for an item(s)?</Text>
            </View>
         <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 8 ? '' : 8)}
            //     this.setState(prevState => ({
            //         faq12: !prevState.faq12
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Can I place a bulk order for an item(s)?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 8 ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 8 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>Yes, we accept bulk orders.</Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Can I add an item to my order after I have placed my order?</Text>
            </View>
         <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 9 ? '' : 9)}
            //     this.setState(prevState => ({
            //         faq13: !prevState.faq13
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Can I add an item to my order after I have placed my order?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 9 ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 9 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                No. However, you can place a new order with the selected
                product(s).
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>I tried placing order using my credit card but it isn't working. Can you help me place an order?</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 10 ? '' : 10)}
            //     this.setState(prevState => ({
            //         faq14: !prevState.faq14
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                I tried placing an order using my credit card, but it isn't
                working. Can you help me place an order?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 10
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 10 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                If your debit/credit card isn't working, you can place a COD
                order. For placing a COD order, call us on +91 8448 233 444.
              </Text>
              <Text style={styles.boldText}>
                Call Timings:- 9:30 AM to 7 PM
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>I tried placing my order using my debit card/credit card/Net Banking but the order was not successful. What happens to the money deducted from the card?</Text>
            </View>
            <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 11 ? '' : 11)}
            //     this.setState(prevState => ({
            //         faq15: !prevState.faq15
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                I tried placing my order using my debit card/credit card/Net
                Banking, but the order was not successful. What happens to the
                money deducted from the card?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 11
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 11 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                If the order was not successful, and the amount has been
                deducted from your account, please check with your bank.
                Generally, the deducted amount rolls back in your account with 7
                business days.
              </Text>
              <Text style={styles.onlyText}>
                In case, the money gets credited to the Moglix account, we would
                initiate a refund within days of your request. However, the
                receipt of refund would depend on your mode of payment.{' '}
              </Text>
              <Text style={styles.onlyText}>
                The expected timelines are as below:
              </Text>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    paddingTop: Dimension.padding10,
                    marginRight: Dimension.padding15,
                  }}>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Net Banking 5-7 business days
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Debit Card 5-7 business days
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Credit Card 7-21 business days
                    </Text>
                  </View>
                </View>
                <Image
                  source={require('../../assets/images/faq/faq-ordert6.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>I am placing an order as a gift to my loved one. Will she receive the price tags and invoice?</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 12 ? '' : 12)}
            //     this.setState(prevState => ({
            //         faq16: !prevState.faq16
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                I am placing an order as a gift to my loved one. Will she
                receive the price tags and invoice?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 12
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 12 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Yes. Because of the prevalent regulations we send the invoice
                along with the product. Tags are also left intact so that a
                product can be returned if your loved one faces any problem with
                it.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>What is the difference between shipping and delivery?</Text>
            </View>
        <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 13 ? '' : 13)}
            //     this.setState(prevState => ({
            //         faq17: !prevState.faq17
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                What is the difference between shipping and delivery?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 13
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 13 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Shipping refers to packing and dispatching of your order. It is
                the number of working days we take to dispatch the order from
                our end.{' '}
              </Text>
              <Text style={styles.onlyText}>
                Delivery is when the product is out to be delivered at your
                address. The delivery may take 1- 3 days depending on the
                address of the order.
              </Text>
            </View>
          ) : null}
        </View>

        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>What should I do if I find my package opened or tampered with upon delivery?</Text>
            </View>
            <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 14 ? '' : 14)}
            //     this.setState(prevState => ({
            //         faq19: !prevState.faq19
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                What should I do if I find my package opened or tampered with
                upon delivery?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 14
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 14 ? (
            <View style={styles.faqView}>
              <View
                style={[styles.textWithCreative, styles.textWithCreativeRight]}>
                <Image
                  source={require('../../assets/images/faq/faq-ordert7.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                <Text style={styles.creativeTextLeft}>
                  Moglix is always working hard to provide you with a great
                  shopping experience. However, if you receive an open or a
                  tampered package, DO NOT accept it. Report the concern
                  immediately to Team.
                </Text>
              </View>
              <Text style={styles.onlyText}>
                Moglix by clicking on Return/Replace option in your MY ORDERS
                page. You need to ensure that the complaint is raised within the
                TrustPay period. We will investigate it immediately and get back
                to you.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Why did I receive a partial order?</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 15 ? '' : 15)}
            //     this.setState(prevState => ({
            //         faq20: !prevState.faq20
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Why did I receive a partial order?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 15
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 15 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                If you have ordered more than one item, please check your
                account to see if the items have different delivery time. Items
                with different delivery times are shipped separately. Do not
                worry; your order is on its way to you!
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>The status on the tracking website shows delivery was attempted but I was not there to receive. Is it possible to get the delivery now?</Text>
            </View>          
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 16 ? '' : 16)}
            //     this.setState(prevState => ({
            //         faq21: !prevState.faq21
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                The status on the tracking website shows delivery was attempted
                but I was not there to receive. Is it possible to get the
                delivery now?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 16
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 16 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                The courier companies usually make more than one attempts to
                deliver the order. Wait for the courier partner to call you
                again. In case you do not receive your order, please get in
                touch with us.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Pre-Order Queries  */}
        {/* <ScrollView
          // onLayout={event => {
          //     const layout = event.nativeEvent.layout;
          //     this.setState({ returnYAxis: layout.y + 60 })
          // }}
          horizontal={false}> */}
        <Text style={styles.mainHeading}>Pre-Order Queries</Text>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Moglix is happy to serve customer and fulfil their requirements. If customer receives any product which fulfils the below mentioned criterion, customer is eligible for return / exchange:</Text>
            </View>
          <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 17 ? '' : 17)}
            //     this.setState(prevState => ({
            //         faq22: !prevState.faq22
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Is the installation offered for all products?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 17
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 17 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Moglix provides only marketplace services to its customers and
                suppliers. Hence, Moglix does not take responsibility for the
                installation of any product purchased through us.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Customer is not eligible for return/exchange if</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 18 ? '' : 18)}
            //     this.setState(prevState => ({
            //         faq23: !prevState.faq23
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Is it necessary to have an account on Moglix to shop?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 18
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 18 ? (
            <View style={styles.faqView}>
              <View
                style={[styles.textWithCreative, styles.textWithCreativeRight]}>
                <Image
                  source={require('../../assets/images/faq/faq-preOrdert1.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                <Text style={styles.creativeTextLeft}>
                  Yes, you need to have an account to buy at Moglix.com. If you
                  don’t have one, you can create it with a few simple steps at
                  the time of purchase.
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Guidelines for Return/Exchange:</Text>
            </View>
          <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 19 ? '' : 19)}
            //     this.setState(prevState => ({
            //         faq24: !prevState.faq24
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Can the products be ordered internationally?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 19
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 19 ? (
            <View style={styles.faqView}>
              <View style={styles.textWithCreative}>
                <Image
                  source={require('../../assets/images/faq/faq-preOrdert2.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                <Text style={styles.creativeText}>
                  Yes, Moglix caters to some international addresses for order
                  delivery. Check with our customer care team to know more about
                  international orders. Contact us at care@moglix.com.
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Refund Policy</Text>
            </View>
            <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 20 ? '' : 20)}
            //     this.setState(prevState => ({
            //         faq25: !prevState.faq25
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Can I order a product that is Out of Stock or Request for Quote?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 20
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 20 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Yes, you can order an “Out of Stock” product. All you need to do
                is visit the product page and share the details asked in
                “Request for Quote” form. The concerned team will get in touch
                with you.
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 21 ? '' : 21)}
            //     this.setState(prevState => ({
            //         faq251: !prevState.faq251
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                What does 'Request for Quote' mean?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 21
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 21 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                "Request for Quote" means that the product is currently not
                available at the website. You can click on “Request for Quote”
                and fill the form. The concerned team will get in touch with you
                soon.
              </Text>
            </View>
          ) : null}
        </View>
        {/* </ScrollView> */}
        {/*Refund */}
        {/* <ScrollView
          // onLayout={event => {
          //     const layout = event.nativeEvent.layout;
          //     this.setState({ refundYAxis: layout.y + 60 })
          // }}
          horizontal={false}> */}
        <Text style={styles.mainHeading}>Refund</Text>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>I've still not received the refund to my bank account. Why?</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 22 ? '' : 22)}
            //     this.setState(prevState => ({
            //         faq26: !prevState.faq26
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                I've still not received the refund to my bank account. Why?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 22
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 22 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                If you have received a mail/message from Moglix confirming your
                refund request, rest assured about the refund. Sometimes,
                financial organizations take a longer time to process the refund
                request.
              </Text>
              {/* Left aligned Image with Text */}
              <View style={styles.textWithCreative}>
                <Image
                  source={require('../../assets/images/faq/faq-refund1.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                <Text style={styles.creativeText}>
                  However, if the refund does not happen by the date we
                  promised, do contact us. We will be glad to assist you.
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>When are Refunds provided?</Text>
            </View>           
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 23 ? '' : 23)}
            //     this.setState(prevState => ({
            //         faq27: !prevState.faq27
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>When are Refunds provided?</Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 23
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 23 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Moglix works dedicated to providing you with a hassle-free
                online shopping experience. However, due to certain unforeseen
                events, if you need to ask for a refund, the refund process is
                initiated as soon as we receive the details.
              </Text>
              <Text style={styles.onlyText}>
                <Text style={styles.boldText}>Note: </Text>Damaged products are
                returned to our warehouse and has been quality checked.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>I paid the amount upfront while purchasing product from Moglix, how do I get the refund?</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 24 ? '' : 24)}
            //     this.setState(prevState => ({
            //         faq28: !prevState.faq28
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                I paid the amount upfront while purchasing product from Moglix,
                how do I get the refund?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 24
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 24 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                With Moglix, your payment is secured. The refund amount is
                processed depending on your payment mode.
              </Text>
              <Text style={styles.onlyText}>
                The expected timelines are as below:
              </Text>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <View
                  style={{
                    marginRight: 15,
                    paddingTop: 10,
                    flex: 1,
                    alignSelf: 'flex-start',
                  }}>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Net Banking 5-7 business days
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Debit Card 5-7 business days
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Credit Card 7-21 business days
                    </Text>
                  </View>
                </View>
                <Image
                  source={require('../../assets/images/faq/faq-refund2.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>I paid cash on delivery, how would I get the refund?</Text>
            </View>
         <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 25 ? '' : 25)}
            //     this.setState(prevState => ({
            //         faq29: !prevState.faq29
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                I paid cash on delivery, how would I get the refund?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 25
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 25 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                If the mode of payment was cash on delivery (COD), we will
                initiate a NEFT bank transfer to your bank account. Moglix will
                contact you for your bank account details. It normally takes
                7-10 days for your money to get reflected in your bank account.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>What are the details you require to process NEFT refund?</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 26 ? '' : 26)}
            //     this.setState(prevState => ({
            //         faq30: !prevState.faq30
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                What are the details you require to process NEFT refund?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 26
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 26 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Once you agree for NEFT refund, you will receive an email from
                Moglix customer support team asking for.
              </Text>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/faq/faq-refund3.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                <View
                  style={{
                    marginLeft: 15,
                    paddingTop: 10,
                    flex: 1,
                    alignSelf: 'flex-start',
                  }}>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>Bank Name</Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>Account Number</Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>Account Holder’s Name</Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>IFSC code</Text>
                  </View>
                  {/* <View style={styles.list}><View style={styles.dot}></View><Text style={styles.onlyText}>Location of the Bank.</Text></View> */}
                </View>
              </View>
              <Text style={styles.onlyText}>
                The refund will be initiated as soon as we receive the details
                from your end. Generally, it 7-10 business days for the money to
                reflect in your account.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Can I ask for NEFT refund if I paid through Credit Card/Debit Card/Net banking?</Text>
            </View>
            
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 27 ? '' : 27)}
            //     this.setState(prevState => ({
            //         faq31: !prevState.faq31
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Can I ask for NEFT refund if I paid through Credit Card/Debit
                Card/Net banking?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 27
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 27 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                No, in case you paid via credit card/debit card/net banking, the
                amount will be refunded in the same account as you had made
                payment from.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>How long will it take to refund?</Text>
          <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 28 ? '' : 28)}
            //     this.setState(prevState => ({
            //         faq32: !prevState.faq32
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                How long will it take to refund?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 28
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 28 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                The refund amount is processed depending on your payment mode.{' '}
              </Text>
              <Text style={styles.onlyText}>
                The expected timelines are as below:{' '}
              </Text>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  Net Banking 5-7 business days
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  Debit Card 5-7 business days
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  Credit Card 7-21 business days
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        {/* </ScrollView> */}
        {/*Customer Return Policy */}
        {/* <ScrollView
          // onLayout={event => {
          //     const layout = event.nativeEvent.layout;
          //     this.setState({ customerYAxis: layout.y + 60 })
          // }}
          horizontal={false}> */}
        <Text style={styles.mainHeading}>Customer Return Policy</Text>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>I've still not received the refund to my bank account. Why?</Text>
            </View>
          <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 29 ? '' : 29)}
            //     this.setState(prevState => ({
            //         faq261: !prevState.faq261
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>Customer Return Policy?</Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 29
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 29 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Moglix is dedicatedly working hard to serve our customers and
                fulfil their requirements. However, if a customer receives any
                product which falls in the below-mentioned criterion, the
                customer is eligible for return/exchange:
              </Text>
              {/* Left aligned Image with Text */}
              <View style={styles.textWithCreative}>
                <Image
                  source={require('../../assets/images/faq/faq-crp1.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                <View
                  style={{
                    marginLeft: 15,
                    flex: 1,
                    alignSelf: 'flex-start',
                  }}>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Product is used/altered/poor quality/defective{' '}
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Product is damaged during transit
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      For Branded products, hologram seal is broken{' '}
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Empty packet/some items or accessories are missing{' '}
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>Wrong item sent</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.onlyText}>
                Customer is not eligible for return/exchange if:
              </Text>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <View
                  style={{
                    paddingRight: 15,
                    paddingTop: 10,
                    flex: 1,
                    alignSelf: 'flex-start',
                  }}>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      The product is "No longer needed" by the customer
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      {' '}
                      The product gets damaged due to poor customer handling{' '}
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Made to Products (on demand) will not be returned
                    </Text>
                  </View>
                </View>
                <Image
                  source={require('../../assets/images/faq/faq-crp2.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>When are Refunds provided?</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 30 ? '' : 30)}
            //     this.setState(prevState => ({
            //         faq27: !prevState.faq27
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Guidelines for Return/Exchange
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 30
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 30 ? (
            <View style={styles.faqView}>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  The customer must raise Return/Exchange request within 7 days
                  of the product delivery. If a damaged or wrong product is
                  delivered to the customer, a return request must be raised
                  within 48 hours of the product delivery
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  In the case of Empty Package/Quantity issue, the customer must
                  share the unboxing video of the product with Customer Care
                  Team
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  In case of damaged or wrong product delivery, the customer
                  must share photographs (exterior images of the box from all
                  sides, interior images with packaging, damaged product image,
                  an image of the shipping label) with Customer Care Team,
                  within 48 hours. (Video of the same will be appreciated)
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  In the case of Industrial goods, a return will be accepted
                  only if the product delivered is wrong/defective/damaged
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  In Case of electronics, the customer needs to contact his
                  nearest service center for repair/ replacement
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  The products for return must be in new and unopened condition
                  with all the original packing, tags, inbox literature,
                  warranty/ guarantee card, freebies and accessories including
                  keys, straps and locks intact{' '}
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  Moglix shall endeavor to process the customer refund within 7
                  (Seven) working days from the date of request made to the
                  Customer Care Team.
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 31 ? '' : 31)}
            //     this.setState(prevState => ({
            //         faq271: !prevState.faq271
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>Refund Policy</Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 31
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 31 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                The refunds in accordance with the above guidelines shall be
                processed as per the following:
              </Text>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  In case of pre-paid orders, the refund will be processed
                  through online banking/electronic fund transfer systems
                  approved by the Reserve Bank of India. The refund shall
                  reflect in the same account through which the customer has
                  paid the transaction amount{' '}
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  For cash on delivery transactions, refunds, if any, will be
                  made via demand draft/NEFT/Cheque etc. in favor of the
                  customer, as per the details provided by him/her{' '}
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  The customer buying the products will not be charged for the
                  pickup. No other deductions shall be made on refund amount
                  confirmed to the customer
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 32 ? '' : 32)}
            //     this.setState(prevState => ({
            //         faq272: !prevState.faq272
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Refunds / Returns shall NOT be allowed
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 32
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 32 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                The refunds in accordance with the above guidelines shall be
                processed as per the following:
              </Text>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  If the return request is made outside the specified time frame
                  of 7 days{' '}
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  If price tags, labels, original packing, freebies and
                  accessories are missing
                </Text>
              </View>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/faq/faq-crp3.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                <View
                  style={{
                    marginLeft: 15,
                    paddingTop: 10,
                    flex: 1,
                    alignSelf: 'flex-start',
                  }}>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      If the Product is damaged by the customer, as may be
                      determined by Moglix at its sole discretion{' '}
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      If the customer has used the product{' '}
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Product sold as combo/sets cannot be returned as an
                      individual product
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
        </View>
        {/* </ScrollView> */}

        {/*Payment Options */}
        {/* <ScrollView
          // onLayout={event => {
          //     const layout = event.nativeEvent.layout;
          //     this.setState({ paymentYAxis: layout.y + 60 })
          // }}
          horizontal={false}> */}
        <Text style={styles.mainHeading}>Payment Options</Text>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>What are the modes of payment for purchasing on Moglix.com? What payment methods do you accept?</Text>
            </View>
            <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 33 ? '' : 33)}
            //     this.setState(prevState => ({
            //         faq33: !prevState.faq33
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                What are the modes of payment for purchasing on Moglix.com? What
                payment methods do you accept?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 33
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 33 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                We accept the following modes of payment:
              </Text>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/faq/faq-pay1.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                <View
                  style={{
                    marginLeft: 15,
                    paddingTop: 10,
                    flex: 1,
                    alignSelf: 'flex-start',
                  }}>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      Debit/Credit Cards/Net banking of all major banks
                    </Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>Cash On Delivery (COD)</Text>
                  </View>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>NEFT/RTGS</Text>
                  </View>
                  {/* <View style={styles.list}><View style={styles.dot}></View><Text style={styles.onlyText}>Location of the Bank.</Text></View> */}
                </View>
              </View>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>What is COD (Cash On Delivery)? Are there any additional charges for COD orders?</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 34 ? '' : 34)}
            //     this.setState(prevState => ({
            //         faq34: !prevState.faq34
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                What is COD (Cash On Delivery)? Are there any additional charges
                for COD orders?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 34
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 34 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                COD refers to Cash on Delivery. Moglix offers you the option of
                paying for your purchase at your doorstep. Just place an order
                and make a cash payment to our COD partner upon the delivery of
                your order.
              </Text>
              <Text style={styles.onlyText}>
                <Text style={styles.boldText}>Note:</Text> Not all
                deals/products have a COD option. Kindly check the deal page
                before buying. Moglix does not offer COD at all locations.
                Kindly enter your pin code to check the availability of COD
                option at your location.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>How do I place Cash on Delivery (C-O-D) order?</Text>
            </View>
          <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 35 ? '' : 35)}
            //     this.setState(prevState => ({
            //         faq35: !prevState.faq35
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                How do I place Cash on Delivery (C-O-D) order?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 35
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 35 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                All items that have the "Cash on Delivery Available" icon are
                valid for order by Cash on Delivery.
              </Text>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <View
                  style={{
                    marginRight: 15,
                    paddingTop: 10,
                    flex: 1,
                    alignSelf: 'flex-start',
                  }}>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      When prompted to choose a payment option, select "Cash on
                      Delivery". Confirm your mobile number and email address.
                    </Text>
                  </View>
                </View>
                <Image
                  source={require('../../assets/images/faq/faq-pay2.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                {/* <View style={styles.list}><View style={styles.dot}></View><Text style={styles.onlyText}>Location of the Bank.</Text></View> */}
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  Once verified and confirmed, your order will be processed and
                  shipped.{' '}
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  You will be required to make a cash-only payment to our
                  courier partner at the time of delivery of your order to
                  complete the payment.{' '}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Can I pay COD (Cash On Delivery) for every product I buy on Moglix?</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 36 ? '' : 36)}
            //     this.setState(prevState => ({
            //         faq36: !prevState.faq36
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Can I pay COD (Cash On Delivery) for every product I buy on
                Moglix?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 36
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 36 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                For most of the products, COD is available and is mentioned on
                the product page. However, due to logistics concern, this option
                might not be available for a few products.
              </Text>
              <Text style={styles.onlyText}>
                Kindly check for COD option before placing an order
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>How can I pay if COD option is not available on my address?</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} /> 
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 37 ? '' : 37)}
            //     this.setState(prevState => ({
            //         faq37: !prevState.faq37
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                How can I pay if COD option is not available on my address?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 37
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 37 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                If COD option is not available on your address, you can choose
                Net Banking or Credit/Debit Card to pay for your purchase.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Why isn't COD available to me?</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 38 ? '' : 38)}
            //     this.setState(prevState => ({
            //         faq38: !prevState.faq38
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Why isn't COD available to me?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 38
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 38 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Cash on Delivery (COD) option is not offered by our Courier
                partners at few serviceable locations.
              </Text>
              <Text style={styles.onlyText}>
                Hence, depending on your location, the COD option may not be
                available to you. In such cases, you can choose to pay through
                Net Banking or Credit/Debit Card. Moglix also restricts Cash on
                Delivery facility for certain customers based on our long-term
                experience. To know more, please refer to our Terms and
                Conditions.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>How do I pay using a credit/debit card?</Text>
            </View>
            <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 39 ? '' : 39)}
            //     this.setState(prevState => ({
            //         faq39: !prevState.faq39
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                How do I pay using a credit/debit card?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 39
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 39 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                <Text style={styles.boldText}>Credit Card:</Text> Moglix accepts
                payments made using Visa, MasterCard and American Express credit
                cards. To pay using your credit card, fill your card details
                i.e. your card number, expiry date and three- digit CVV number
                (found on the backside of your card) at the time of checkout.
                Once you enter your card details, you will be redirected to the
                bank's page where you enter your online 3D secure password to
                complete the payment process.
              </Text>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/faq/faq-pay3.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
                <View
                  style={{
                    marginLeft: 15,
                    paddingTop: 10,
                    flex: 1,
                    alignSelf: 'flex-start',
                  }}>
                  <View style={styles.list}>
                    <View style={styles.dot}></View>
                    <Text style={styles.onlyText}>
                      <Text style={styles.boldText}>Debit Card:</Text> We accept
                      payments made using Visa, MasterCard and Maestro debit
                      cards. To pay using your debit card, fill your card
                      details that include card number, expiry date (optional
                      for Maestro cards) and three-digit CVV number (optional
                      for Maestro cards),{' '}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.onlyText}>
                at the time of checkout. Once you enter your card details, you
                will be redirected to your bank's secure page, where you need to
                enter your online password (issued by your bank) to complete the
                payment.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Is it safe to use my credit/debit card on Moglix?</Text>
            </View>
        <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 40 ? '' : 40)}
            //     this.setState(prevState => ({
            //         faq40: !prevState.faq40
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Is it safe to use my credit/debit card on Moglix?
              </Text>
            </View>
            <MatIcon
              name={
                selectedIndex == 40
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 40 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Your online transaction on Moglix is secure with the highest
                levels of transaction security currently available on the
                Internet. Moglix uses PayU as a payment gateway to protect your
                card information while securely transmitting it to the
                respective banks for payment processing.
              </Text>
              <Text style={styles.onlyText}>
                All credit card and debit card payments on Moglix are processed
                through secure and trusted payment gateways managed by leading
                banks. Banks now use the 3D secure password service for online
                transactions, providing an additional layer of security through
                identity verification.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>What is a 3D secure password?</Text>
            </View>
           <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 41 ? '' : 41)}
            //     this.setState(prevState => ({
            //         faq41: !prevState.faq41
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                What is a 3D secure password?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 41
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 41 ? (
            <View style={styles.faqView}>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <View
                  style={{
                    marginRight: 15,
                    paddingTop: 10,
                    flex: 1,
                    alignSelf: 'flex-start',
                  }}>
                  <Text style={styles.onlyText}>
                    The 3D Secure password is implemented by VISA and Master
                    Card in partnership with banks under the "Verified by VISA"
                    and "Mastercard Secure Code" services, respectively. The 3D
                    secure password adds additional layer of security
                  </Text>
                </View>
                <Image
                  source={require('../../assets/images/faq/faq-pay4.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.onlyText}>
                {' '}
                through identity verification for your online credit/debit card
                transactions. This password, which is created by you, is known
                only to you. This ensures that only you can use your card for
                online purchases.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>What steps does Moglix take to prevent card fraud?</Text>
            </View>
         <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 42 ? '' : 42)}
            //     this.setState(prevState => ({
            //         faq42: !prevState.faq42
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                What steps does Moglix take to prevent card fraud?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 42
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 42 ? (
            <View style={styles.faqView}>
              <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <View
                  style={{
                    marginRight: 15,
                    paddingTop: 10,
                    flex: 1,
                    alignSelf: 'flex-start',
                  }}>
                  <Text style={styles.onlyText}>
                    Moglix realizes the importance of strong fraud detection and
                    resolution capability. We and our online payments partners
                    monitor transactions continuously for suspicious activity,
                    and flag potentially fraudulent transactions for manual
                    verification by our team.
                  </Text>
                </View>
                <Image
                  source={require('../../assets/images/faq/faq-pay5.png')}
                  style={styles.creativeImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.onlyText}>
                In the rarest of rare cases, if our team is unable to rule out
                the possibility of fraud categorically, the transaction is kept
                on hold, and the customer is requested to provide identity
                documents. The identity documents help us ensure that the
                purchase was indeed made by a genuine a cardholder.
              </Text>
              <Text style={styles.onlyText}>
                We believe that our customers understand and support us in the
                larger interest of ensuring a safe and secure environment for
                online transactions.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>My transaction failed but the money was deducted from my account. What should I do?</Text>
            </View>
          <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 43 ? '' : 43)}
            //     this.setState(prevState => ({
            //         faq43: !prevState.faq43
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                My transaction failed but the money was deducted from my
                account. What should I do?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 43
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 43 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                If the order was not successful, and the amount has been
                deducted from your account, please check with your bank.
                Generally, the deducted amount rolls back in your account with 7
                business days. In case, the money gets credited to the Moglix
                account, we would initiate a refund within 3 days of your
                request. However, the receipt of refund would depend on your
                mode of payment.
              </Text>
              <Text style={styles.onlyText}>
                The expected timelines are as below:
              </Text>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  Net Banking 5-7 business days
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  Debit Card 5-7 business days
                </Text>
              </View>
              <View style={styles.list}>
                <View style={styles.dot}></View>
                <Text style={styles.onlyText}>
                  Credit Card 7-21 business days
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Can I use my bank's Internet Banking feature to make a payment?</Text>
            </View>          
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 44 ? '' : 44)}
            //     this.setState(prevState => ({
            //         faq46: !prevState.faq46
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Can I use my bank's Internet Banking feature to make a payment?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 44
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 44 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Yes. Moglix offers you the convenience of using Internet Banking
                service to make a payment for your order. With this, you can
                directly transfer funds from your bank account through a highly
                secure transaction to Moglix. We accept payment through Internet
                Banking from almost all banks.
              </Text>
            </View>
          ) : null}
        </View>
        {/* Collapse View  */}
        {/* <TouchableOpacity style={styles.collapseHeaderView}>
            <View style={styles.orderTextWrap}>
                <Text style={styles.orderText}>Can I make a credit/debit card or Internet Banking payment on Moglix through my mobile?</Text>
            </View>
            <MatIcon name={'keyboard-arrow-down'} style={styles.uparrowicon} size={24} />
            </TouchableOpacity> */}
        {/* Expand View  */}
        <View style={styles.expandView}>
          <TouchableOpacity
            onPress={() => setSelectedIndex(selectedIndex == 45 ? '' : 45)}
            //     this.setState(prevState => ({
            //         faq47: !prevState.faq47
            //       }))
            // }
            style={styles.expandHeaderView}>
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>
                Can I make a credit/debit card or Internet Banking payment on
                Moglix through my mobile?
              </Text>
            </View>

            <MatIcon
              name={
                selectedIndex == 45
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              style={styles.uparrowicon}
              size={24}
            />
          </TouchableOpacity>
          {selectedIndex == 45 ? (
            <View style={styles.faqView}>
              <Text style={styles.onlyText}>
                Yes. Moglix offers you the convenience of using Internet Banking
                service to make a payment for your order. With this, you can
                directly transfer funds from your bank account through a highly
                secure transaction to Moglix. We accept payment through Internet
                Banking from almost all banks.
              </Text>
            </View>
          ) : null}
        </View>
        {/* </ScrollView> */}
        {/* </View>
        </View> */}
      </ScrollView>
    </>
  );
};

export default FaqScreen;
