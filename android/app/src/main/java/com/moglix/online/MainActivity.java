package com.moglix.online;
import com.facebook.react.ReactActivity;
import android.os.Bundle;
import com.webengage.sdk.android.WebEngage;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.installations.FirebaseInstallations;
import com.google.firebase.installations.InstallationTokenResult;
import org.devio.rn.splashscreen.SplashScreen; // here
import com.adobe.marketing.mobile.AdobeCallback;
import com.adobe.marketing.mobile.Analytics;
import com.adobe.marketing.mobile.Identity;
import com.adobe.marketing.mobile.InvalidInitException;
import com.adobe.marketing.mobile.Lifecycle;
import com.adobe.marketing.mobile.LoggingMode;
import com.adobe.marketing.mobile.MobileCore;
import com.adobe.marketing.mobile.Signal;
import com.adobe.marketing.mobile.UserProfile;
import com.adobe.marketing.mobile.WrapperType;

// import com.google.firebase.installations.InstanceIdResult;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "moglix";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(null);
      SplashScreen.show(this);
      MobileCore.setApplication(getApplication());
      MobileCore.configureWithAppID("055f91edd8ef/965e4dc993a3/launch-f5044a9b2029");
      // MobileCore.configureWithAppID("055f91edd8ef/965e4dc993a3/launch-26df831058b4-development");
      MobileCore.lifecycleStart(null);
      MobileCore.setLogLevel(LoggingMode.DEBUG);
      MobileCore.setWrapperType(WrapperType.REACT_NATIVE);
      try{
          Analytics.registerExtension();
          UserProfile.registerExtension();
          Identity.registerExtension();
          Lifecycle.registerExtension();
          Signal.registerExtension();
      } catch (InvalidInitException e) {
      // handle exception
      }
       MobileCore.start(null);

      try {

        FirebaseMessaging.getInstance().getToken().addOnSuccessListener(new OnSuccessListener<String>() {
          @Override
          public void onSuccess(String instanceIdResult) {
              WebEngage.get().setRegistrationID(instanceIdResult);
          }
        });


        // FirebaseInstallations.getInstance().getId().addOnSuccessListener(this, new OnSuccessListener<String>() {
        //     @Override
        //     public void onSuccess(String instanceIdResult) {
        //         String token = FirebaseMessaging.getToken();
        //         WebEngage.get().setRegistrationID(token);
        //     }
        // });
    } catch (Exception e) {
        // Handle exception
    }

     
  }

  

}
