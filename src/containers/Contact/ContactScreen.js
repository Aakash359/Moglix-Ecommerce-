import React from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Linking,
} from 'react-native';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Header from '../../components/Common/Header';
import styles from './Contactstyle';

const ContactScreen = props => {
  return (
    <View style={{flex: 1}}>
      <Header
        // showCart
        showBack
        showText={'Contact Us'}
        navigation={props.navigation}
      />
      <ScrollView>
        <View style={styles.contentWrap}>
          <View style={styles.helpHeadingWrap}>
            <View style={styles.headText}>
              <Text style={styles.helpHeading}>Contact US</Text>
              <Text style={styles.helpsubText}>
                Please get in touch with us in case you face any issues. We will
                be happy to help you.
              </Text>
            </View>
            <Image
              source={require('../../assets/images/contact-us-new.png')}
              style={styles.contactImg}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.hcsubText}>
            We are a highly agile and nimble footed organization which believes
            in a collaborative approach to solve problems of the world. And that
            is why the culture of customer feedback and satisfaction ranks high
            on our agenda. We are happy to help you round the clock to the best
            of our ability.
          </Text>
          {/* FAQ card */}
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('FaqScreen');
            }}
            style={styles.orderNavigate}>
            <FAIcon name={'file'} size={24} style={styles.fileicon} />
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>FAQ</Text>
              <Text style={styles.ordersubText}>
                You can manage your orders in Orders section
              </Text>
            </View>
            <MatIcon
              name={'keyboard-arrow-right'}
              style={styles.rightarrowicon}
              size={24}
            />
          </TouchableOpacity>

          {/* Write to us at card */}
          <TouchableOpacity
            onPress={() => Linking.openURL('mailto:care@moglix.com')}
            style={styles.orderNavigate}>
            <Image
              source={require('../../assets/images/mail-fill.png')}
              style={styles.fileicon}
              resizeMode="contain"
            />
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>Write to us at</Text>
              <Text style={styles.ordersubText}>care@moglix.com</Text>
            </View>
            <MatIcon
              name={'keyboard-arrow-right'}
              style={styles.rightarrowicon}
              size={24}
            />
          </TouchableOpacity>
          {/* Write to us at card */}
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${8448233444}`);
            }}
            style={styles.orderNavigate}>
            <Image
              source={require('../../assets/images/phoneIcon.png')}
              style={styles.fileicon}
              resizeMode="contain"
            />
            <View style={styles.orderTextWrap}>
              <Text style={styles.orderText}>Call us</Text>
              <Text style={styles.ordersubText}>+91 8448 233 444</Text>
            </View>
            <MatIcon
              name={'keyboard-arrow-right'}
              style={styles.rightarrowicon}
              size={24}
            />
          </TouchableOpacity>
          <Text style={styles.helpHeading}>Our office addresses</Text>
          <View style={styles.addrCard}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={styles.addrTag}>Headquarter</Text>
            </View>
            <Text style={[styles.helpHeading, styles.boldText]}>Singapore</Text>
            <Text style={styles.helpsubText}>
              #04-08/09, Block 79, Ayer Rajah Crescent, Pin: 139955
            </Text>
          </View>
          <View style={styles.addrCard}>
            <View style={{alignItems: 'flex-start'}}>
              <Text style={styles.addrTag}>Operating Office</Text>
            </View>
            <Text style={[styles.helpHeading, styles.boldText]}>India</Text>
            <Text style={styles.helpsubText}>
              D-188, Sector-10 NOIDA, Pin: 201301
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ContactScreen;
