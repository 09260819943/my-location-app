import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { updateService } from "../services/api";

export default function UpdateService({ route, navigation }) {
  // 'service' is passed from ServicesList
  const { service } = route.params;
  const [location, setLocation] = useState({ lat: service.latitude, lng: service.longitude });

  useEffect(() => {
    // If you want to refresh service data from API: call getService(service.id) here.
  }, []);

  const handleSave = () => {
    updateService(service.id, {
      name: service.name,
      role: service.role,
      latitude: location.lat,
      longitude: location.lng,
    })
      .then(() => {
        Alert.alert("Saved");
        navigation.navigate("List");
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Error", "Could not update");
      });
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
          var map = L.map('map').setView([lat, lng], 14);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          var marker = L.marker([lat, lng], {draggable:true}).addTo(map);
          marker.on('dragend', function() {
            var p = marker.getLatLng();
            window.ReactNativeWebView.postMessage(JSON.stringify({lat:p.lat, lng:p.lng}));
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>{service.name} ({service.role})</Text>
      <WebView
        source={{ html: mapHTML }}
        style={{ height: 350, marginBottom: 8 }}
        onMessage={(event) => {
          const coords = JSON.parse(event.nativeEvent.data);
          setLocation({ lat: coords.lat, lng: coords.lng });
        }}
      />
      <Text>New location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</Text>
      <Button title="Save new location" onPress={handleSave} />
    </View>
  );
}
