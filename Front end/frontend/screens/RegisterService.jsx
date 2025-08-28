import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker"; // <-- import Picker
import { createService } from "../services/api";

export default function RegisterService({ navigation }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("boarding"); // default
  const [location, setLocation] = useState({ lat: 10.3157, lng: 123.8854 });

  const handleSave = async () => {
    if (!name) return Alert.alert("Validation", "Enter name");
    try {
      await createService({
        name,
        role,
        latitude: location.lat,
        longitude: location.lng,
      });
      Alert.alert("Saved");
      navigation.navigate("List");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Could not save");
    }
  };

  const mapHTML = `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
        <style>body,html,#map{height:100%; margin:0; padding:0}</style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          var lat = ${location.lat};
          var lng = ${location.lng};
          var map = L.map('map').setView([lat, lng], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          var marker = L.marker([lat, lng]).addTo(map);

          map.on('click', function(e) {
            var p = e.latlng;
            marker.setLatLng(p);
            window.ReactNativeWebView.postMessage(JSON.stringify({lat:p.lat, lng:p.lng}));
          });
        </script>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      {/* Service Name */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* Role Dropdown */}
      <Text style={styles.label}>Select Role</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Boarding Facility" value="boarding" />
          <Picker.Item label="Pet Sitter" value="sitter" />
        </Picker>
      </View>

      <Text style={{ marginBottom: 6 }}>Tap map to pick location</Text>
      <WebView
        source={{ html: mapHTML }}
        style={styles.map}
        onMessage={(event) => {
          const coords = JSON.parse(event.nativeEvent.data);
          setLocation({ lat: coords.lat, lng: coords.lng });
        }}
      />
      <Text style={{ marginVertical: 6 }}>
        Picked: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
      </Text>

      {/* Save Button */}
      <View style={styles.buttonWrapper}>
        <Button title="Save" onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 8, borderRadius: 6 },
  label: { marginBottom: 4, fontWeight: "bold" },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    overflow: "hidden",
  },
  map: { flex: 1, marginBottom: 10 },
  buttonWrapper: {
    marginBottom: 10,
  },
});
