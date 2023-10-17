package com.moglix.online;

import android.app.Application;
import com.facebook.react.modules.network.OkHttpClientProvider;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.webengage.WebengagePackage;
import com.webengage.WebengagePackage;
import com.webengage.WebengagePackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import me.furtado.smsretriever.RNSmsRetrieverPackage;
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.webengage.WebengagePackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import com.restapi.reactnative.RNRestapiPackage;
import com.zoontek.rnpermissions.RNPermissionsPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.wenkesj.voice.VoicePackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import com.webengage.sdk.android.WebEngageConfig;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.installations.InstallationTokenResult;
import com.google.firebase.messaging.FirebaseMessaging;
import com.webengage.sdk.android.WebEngage;
import com.google.firebase.installations.FirebaseInstallations;
import com.moglix.online.SSLPinnerFactory;
// import com.google.firebase.installations.InstanceIdResult;
import com.webengage.sdk.android.WebEngageActivityLifeCycleCallbacks;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
     // Provide a client factory to React Native's OkHttpClientProvider and it will
     // use it instead of the default one.
    //  OkHttpClientProvider.setOkHttpClientFactory(new SSLPinnerFactory());
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    
    WebEngageConfig webEngageConfig = new WebEngageConfig.Builder()
    .setWebEngageKey("76ab0dd")
    .setAutoGCMRegistrationFlag(false)
    // .setDebugMode(true) // only in development mode
    .build();
registerActivityLifecycleCallbacks(new WebEngageActivityLifeCycleCallbacks(this, webEngageConfig));

FirebaseMessaging.getInstance().getToken().addOnSuccessListener(new OnSuccessListener<String>() {
  @Override
  public void onSuccess(String instanceIdResult) {
      WebEngage.get().setRegistrationID(instanceIdResult);
  }
});

// FirebaseMessaging.getToken().addOnSuccessListener(new OnSuccessListener<String>() {
//   @Override
//   public void onSuccess(String token) {
//       WebEngage.get().setRegistrationID(token);
//   }
// });






  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.moglix.online.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
