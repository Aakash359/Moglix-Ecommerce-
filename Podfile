require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '10.0'

target 'moglix_app_hooks' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    # to enable hermes on iOS, change `false` to `true` and then install pods
    :hermes_enabled => false
  )

  pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'

  pod 'react-native-voice', :path => '../node_modules/@react-native-voice/voice'
  pod 'RNCAsyncStorage', :path => '../node_modules/@react-native-async-storage/async-storage'

  pod 'react-native-image-picker', :path => '../node_modules/react-native-image-picker'

  pod 'rn-fetch-blob', :path => '../node_modules/rn-fetch-blob'
  pod 'react-native-geolocation-service', :path => '../node_modules/react-native-geolocation-service'

  pod 'RNPermissions', :path => '../node_modules/react-native-permissions'

  pod 'RNRestapi', :path => '../node_modules/mapmyindia-restapi-react-native-beta'

  pod 'react-native-webengage', :path => '../node_modules/react-native-webengage'
  pod 'react-native-simple-toast', :path => '../node_modules/react-native-simple-toast'

  pod 'react-native-splash-screen', :path => '../node_modules/react-native-splash-screen'

  pod 'RNDeviceInfo', :path => '../node_modules/react-native-device-info'

  pod 'react-native-version-check', :path => '../node_modules/react-native-version-check'

  pod 'react-native-netinfo', :path => '../node_modules/@react-native-community/netinfo'

  target 'moglix_app_hooksTests' do
    inherit! :complete
    # Pods for testing
  end

  # Enables Flipper.
  #
  # Note that if you have use_frameworks! enabled, Flipper will not work and
  # you should disable the next line.
  use_flipper!()

  post_install do |installer|
    react_native_post_install(installer)
  end
end