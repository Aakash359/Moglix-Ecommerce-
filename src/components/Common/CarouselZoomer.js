import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Colors from '../../redux/constants/colors';
import Header from './Header';
import Dimension from '../../redux/constants/dimensions';
import ImageViewer from 'react-native-image-zoom-viewer';

const CarouselZoomer = props => {
  const {data, productData} = props.route.params;
  const [currIndex, setCurrIndex] = useState(1);
  const [imgData, setImgdata] = useState([]);

  useEffect(() => {
    setImgdata([
      ...[...data].map(_ => ({
        url: `https://cdn.moglix.com/${
          Platform.OS == 'android' ? _.imageWebp || _.imageLink : _.imageLink
        }`,
      })),
    ]);
  }, []);

  const _renderBottom = () => {
    return imgData.map((item, index) => (
      <TouchableOpacity onPress={() => setCurrIndex(index)}>
        <View style={styles.TopCatWrap}>
          <View style={styles.TopCatImgWrap}>
            <Image
              source={{
                uri: item.url,
              }}
              style={styles.TopCatImg}
              resizeMode="contain"
            />
          </View>
          {/* <Text style={styles.TopCatName}>7 days return window</Text> */}
        </View>
      </TouchableOpacity>
    ));
  };

  const _Header = () => {
    return (
      <Header
        fromZoomer
        shareUrl={productData.defaultCanonicalUrl}
        showBack
        navigation={props.navigation}
      />
    );
  };

  const renderViewer = () => (
    <ImageViewer
      imageUrls={imgData}
      // enableImageZoom={true}
      saveToLocalByLongPress={false}
      // onSave={() => {}}
      // onSaveToCamera={() => {}}
      renderIndicator={() => null}
      loadingRender={() => <ActivityIndicator color={Colors.RedThemeColor} />}
      index={currIndex}
      backgroundColor="white"
    />
  );

  return (
    <View style={{flex: 1}}>
      {_Header()}
      <View style={styles.container}>
        {imgData.length ? renderViewer() : null}
      </View>
      <View
        style={{
          paddingVertical: Dimension.padding15,
          paddingHorizontal: Dimension.padding15,
          backgroundColor: '#EFEFF4',
        }}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.row}>{_renderBottom()}</View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  row: {flexDirection: 'row'},

  TopCatName: {
    color: Colors.blueShade,
    fontFamily: Dimension.CustomRegularFont,
    fontSize: Dimension.font10,
    marginTop: Dimension.margin5,
    textAlign: 'center',
    textTransform: 'capitalize',
    width: Dimension.width70,
  },

  TopCatImgWrap: {backgroundColor: '#fff'},
  TopCatWrap: {
    alignItems: 'center',
    marginRight: Dimension.margin15,
    backgroundColor: '#fff',
    alignContent: 'center',
    padding: Dimension.padding10,
  },
  TopCatImg: {height: 100, width: 100},
});

export default CarouselZoomer;
