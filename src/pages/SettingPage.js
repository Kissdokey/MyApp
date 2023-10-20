import * as React from 'react';
import  {Text, View} from 'react-native';
export default function SettingPage({navigation}) {
  return (
    <View style={{flex: 1}}>
      <Text>Notifications screen</Text>
      <Button title="Hello World" />
    </View>
  );
}
