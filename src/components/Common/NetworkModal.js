import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, Image} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';
import Dimension from '../../redux/constants/dimensions';

const deviceWidth = Dimensions.get('window').width;

const NetworkModal = props => {
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    let networkHandler = NetInfo.addEventListener(({isConnected}) => {
      setIsConnected(isConnected);
    });
  }, []);

  return (
    // <Modal
    //   style={{
    //     flex: 1,
    //     backgroundColor: '#fff',
    //     width: Dimensions.get('window').width,
    //     height: Dimensions.get('window').height,
    //   }}
    //   isVisible={!isConnected}>
    //   <View style={{flex: 1, backgroundColor: '#fff'}}>
    //     <Text>No Connection</Text>
    //   </View>
    // </Modal>
    <Modal
      isVisible={!isConnected}
      // width={1}
      // height={1}
      coverScreen={true}
      style={{
        paddingRight: 0,
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: 0,
        margin: 0,
      }}
      deviceWidth={deviceWidth}
      hasBackdrop={false}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          position: 'relative',
          zIndex: 9999999999999,
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#F7F7FA',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            height: '90%',
            width: '94%',
            alignSelf: 'center',
          }}>
          <Image
            source={require('../../assets/images/no_internet.png')}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              marginBottom: Dimension.margin20,
            }}
          />
          <Text
            style={{
              textAlign: 'center',
              fontSize: Dimension.font14,
              fontFamily: Dimension.CustomMediumFont,
              color: '#363636',
              marginBottom: Dimension.margin15,
            }}>
            Oh Snap !
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: Dimension.font12,
              fontFamily: Dimension.CustomRegularFont,
              color: '#979797',
            }}>
            Could not connect to the internet.
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: Dimension.font12,
              fontFamily: Dimension.CustomRegularFont,
              color: '#979797',
            }}>
            Please check your network.
          </Text>
          {/* <Button style={styles.raiseNewBtn} onPress={()=>{this.internetChecker()}}>
          <Icon name='plus' type='EvilIcons' style={styles.raiseIcon}></Icon>
          <Text style={styles.raiseText}>Tap To Refresh</Text>
        </Button> */}
        </View>
      </View>
    </Modal>
  );
};

export default NetworkModal;
