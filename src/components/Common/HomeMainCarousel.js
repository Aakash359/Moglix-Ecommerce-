import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import {trackStateAdobe, sendClickStreamData} from '../../services/analytics';
const {width, height} = Dimensions.get('window');
let flatList;

// function infiniteScroll(dataList) {
//   const numberOfData = dataList.length;
//   let scrollValue = 0,
//     scrolled = 0;

//   setInterval(function () {
//     scrolled++;
//     if (scrolled < numberOfData) {
//       scrollValue = scrollValue + width;
//     } else {
//       scrollValue = 0;
//       scrolled = 0;
//     }
//     this.flatList.scrollToOffset({animated: true, offset: scrollValue});
//   }, 3000);
// }

const HomeMainCarousel = props => {
  const {Config, fromPdp} = props;
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, width);
  // const [dataList, setDataList] = useState(props.data);

  // useEffect(() => {
  //   setDataList(props.data);
  //   infiniteScroll(dataList);
  // });

  //home and brand clickHandle
  const carouselClicked = item => {
    if (props.fromHome) {
      let code =
        'home_page_banner_main_' +
        item.redirectPageName +
        '_' +
        (item.redirectPageData
          ? item.redirectPageData[0]
            ? item.redirectPageData[0].category
            : ''
          : '') +
        '_' +
        (item.redirectPageData
          ? item.redirectPageData[0]
            ? item.redirectPageData[0].type
            : ''
          : '') +
        '_' +
        (item.redirectPageData
          ? item.redirectPageData[0]
            ? item.redirectPageData[0].str
            : ''
          : '');
      let adobeData = {
        'myapp.linkpageName': 'moglix:home',
        'myapp.ctaname': code,
        'myapp.linkName': code,
        '&&events': 'event21',
      };
      let dataTracking = {
        event_type: 'click',
        label: `home_page_click_home_page_banner_main`,
        channel: 'Home',
        page_type: `home_page`,
      };
      sendClickStreamData(dataTracking);
      trackStateAdobe('moglix:home', adobeData);
    }

    if (item.redirectPageName === 'ListingScreen') {
      props.navigation.push('Listing', {
        str:
          item.redirectPageData &&
          item.redirectPageData[0] &&
          item.redirectPageData[0].str,
        type:
          item.redirectPageData &&
          item.redirectPageData[0] &&
          item.redirectPageData[0].type,
        category:
          item.redirectPageData &&
          item.redirectPageData[0] &&
          item.redirectPageData[0].type === 'Category'
            ? item.redirectPageData[0].category
            : '',
        name: item.imageTitle || item.categoryName,
      });
    }
  };

  const renderImageZoomer = () => {
    props.navigation.navigate('CarouselZoomer', {
      data: props.data,
      productData: props.productData,
    });
  };

  const carouselItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          fromPdp ? item && renderImageZoomer() : item && carouselClicked(item);
        }}>
        <Image
          source={{
            uri:
              Config.IMG_PATH +
              (Platform.OS == 'android'
                ? item.imageWebp || item.imageLink
                : item.imageLink),
          }}
          style={[styles.bannerImage, {opacity: props.showDisabled ? 0.4 : 1}]}
          placeholderStyle={styles.bannerImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  // const renderImages = ({item, index}) => {
  //   return (
  //     <TouchableOpacity style={styles.homeBannerImagesView}>
  //       <Image
  //         containerStyle={styles.imageContainer}
  //         source={{
  //           uri:
  //             Config.IMG_PATH +
  //             (Platform.OS == 'android'
  //               ? item.imageWebp || item.imageLink
  //               : item.imageLink),
  //         }}
  //         style={[
  //           styles.homeBannerImage,
  //           {
  //             width: Dimension.SCREEN_WIDTH * 0.8,
  //             height: Dimension.SCREEN_WIDTH * 0.4,
  //           },
  //         ]}
  //         placeholderStyle={styles.homeBannerPlaceholderImage}
  //         resizeMode="contain"
  //       />
  //     </TouchableOpacity>
  //   );
  // };
  if (props.data && props.data.length) {
    return (
      <View style={{backgroundColor: fromPdp ? '#fff' : null}}>
        <FlatList
          // ref={flatList => {
          //   this.flatList = flatList;
          // }}
          data={props.data}
          keyExtractor={(item, index) => 'key' + index}
          horizontal
          pagingEnabled
          scrollEnabled
          snapToAlignment="center"
          scrollEventThrottle={16}
          decelerationRate={'fast'}
          showsHorizontalScrollIndicator={false}
          renderItem={carouselItem}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
        />

        {!props.fromBrand ? (
          <View style={styles.dotView}>
            {props.data && props.data.length > 1
              ? props.data.map((item, i) => {
                  let opacity = position.interpolate({
                    inputRange: [i - 2, i - 1, i, i + 1, i + 2],
                    outputRange: [0.4, 0.4, 1, 0.4, 0.4],
                    extrapolate: 'clamp',
                  });
                  return (
                    <Animated.View
                      key={i}
                      style={[
                        styles.animatedView,
                        {
                          opacity,
                          height: fromPdp ? 6 : 10,
                          width: fromPdp ? 6 : 10,
                          backgroundColor: '#595959',
                          margin: fromPdp ? 3 : 8,
                        },
                      ]}
                    />
                  );
                })
              : null}
          </View>
        ) : null}
      </View>

      // Snapcarousel

      // <Carousel
      //   data={props.data}
      //   renderItem={renderImages}
      //   sliderWidth={Dimension.SCREEN_WIDTH}
      //   itemWidth={Dimension.SCREEN_WIDTH * 0.8}
      //   onSnapToItem={slideIndex => {
      //     setActiveSlide(slideIndex);
      //   }}
      //   loop={true}
      //   inactiveSlideOpacity={0.6}
      //   autoplay={props.autoplay}
      //   autoplayDelay={1000}
      //   autoplayInterval={3000}
      // />
    );
  }

  return null;
};

// const styles = StyleSheet.create({
//   homeBannerImagesView: {
//     borderRadius: Dimension.borderRadius10,
//     overflow: 'hidden',
//   },
//   imageContainer: {},
// });

const styles = StyleSheet.create({
  // wrapper: {
  //   marginVertical: 10,
  // },
  // imageWrapper: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // image: {
  //   borderRadius: 10,
  // },
  // dotView: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  // },
  // details: {
  //   position: 'absolute',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   padding: 10,
  //   width: vw * 0.9,
  //   bottom: 0,
  //   borderBottomLeftRadius: 10,
  //   borderBottomRightRadius: 10,
  // },
  // txt: {
  //   fontSize: 13,
  //   color: 'white',
  //   fontFamily: 'Roboto-Regular',
  // },

  cardView: {
    flex: 1,
    width: width - 20,
    height: height / 3.5,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  bannerImage: {
    width: width - 30,
    height: height / 3.5,
    borderRadius: 5,
    marginHorizontal: 15,
  },
  dotView: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
  },
  animatedView: {
    borderRadius: 5,
  },
});

export default HomeMainCarousel;
