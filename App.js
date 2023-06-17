import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import AppLoading from 'expo-app-loading';

import AllPlaces from './app/screens/AllPlaces';
import AddPlace from './app/screens/AddPlace';
import IconButton from './app/components/UI/IconButton';
import Map from './app/screens/Map';
import { Colors } from './app/constants/colors';
import { init } from './app/util/database';

const Stack = createNativeStackNavigator();

export default function App() {

  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    init().then(() => {
      setDbInitialized(true);
    }).catch(err => {
      console.log(err);
    });
  }, []);

  if (!dbInitialized) {
    return <AppLoading />
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary500},
            headerTintColor: Colors.gray700,
            contentStyle: {backgroundColor: Colors.gray700}
        }}>
          <Stack.Screen
            name="AllPlaces"
            component={AllPlaces}
            options={({ navigation }) => ({
              title: 'Your Favorite Places',
                headerRight: ({ tintColor }) => (
                  <IconButton
                    icon="add"
                    size={24}
                    color={tintColor}
                    onPress={() => navigation.navigate('AddPlace')} options={{
                      title: 'Add a new Place'
                    }}
                  />
                ),
              }
            )
          }
          />
          <Stack.Screen name="AddPlace" component={AddPlace} />
          <Stack.Screen name='Map' component={Map} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({

});
