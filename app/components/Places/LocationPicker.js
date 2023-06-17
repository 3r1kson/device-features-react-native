import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Alert, Image, Text } from "react-native";
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from 'expo-location';
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";

import OutlinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import { getAddress, getMapPreview } from "../../util/location";

function LocationPicker({onPickLocation}) {
    const [pickedLocation, setPickedLocation] = useState();
    const isFocused = useIsFocused();

    const route = useRoute();
    const navigation = useNavigation();

    const [locationPermissionsInformation, requestPermission] =
      useForegroundPermissions();


    useEffect(() => {
        if (isFocused) {
          const mapPickedLocation = route.params && {
            lat: route.params.pickedLat,
            lng: route.params.pickedLng,
          };
          setPickedLocation(mapPickedLocation);
        }
    }, [route, isFocused]);

    useEffect(() => {
        async function handleLocation() {
          if (pickedLocation) {
            const address = await getAddress(pickedLocation.lat, pickedLocation.lng);
            onPickLocation({...pickedLocation, address: address});
          }
        }
        handleLocation();
    }, [pickedLocation, onPickLocation]);

    async function verifyPermissions() {
        if (locationPermissionsInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
 
            return permissionResponse.granted;
         }
 
         if (locationPermissionsInformation.status === PermissionStatus.DENIED) {
             Alert.alert(
               "Insufficient Permissions!",
               "You need to grant location permissions to use this app."
             );
 
             return false;
         }
 
         return true;
    }

    async function getLocationHandler({picklocationHandler}) {
        const hasPermission = await verifyPermissions();

        if (!hasPermission) {
            return;
        }

        const location = await getCurrentPositionAsync();
        setPickedLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude
        });
    }

    function pickOnMapHanlder() {
        navigation.navigate('Map');
    }

    let locationPreview = <Text>No Location picked yet.</Text>

    if (pickedLocation) {
        locationPreview = (
          <Image
            style={styles.image}
            source={{
              uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
            }}
          />
        );

    }

    return (
      <View>
        <View style={styles.mapPreview}>
            {locationPreview}
        </View>
        <View style={styles.actions}>
          <OutlinedButton icon={"location"} onPress={getLocationHandler}>Locate User</OutlinedButton>
          <OutlinedButton icon={"map"} onPress={pickOnMapHanlder}>Pick on Map</OutlinedButton>
        </View>
      </View>
    );
}

export default LocationPicker;

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,

    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 4
    }
});