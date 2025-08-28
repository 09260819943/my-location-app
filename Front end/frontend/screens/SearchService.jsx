import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { getServices } from "../services/api";

export default function SearchService({ route }) {
  const [services, setServices] = useState([]);
  const focusService = route?.params?.focusService || null;

  useEffect(() => {
    getServices().then(res => setServices(res.data)).catch(err => console.log(err));
  }, []);

  const mapHTML = `
    <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
        <style>
          body,html,#map { height:100%; margin:0; padding:0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          var defaultLat = 10.3157, defaultLng = 123.8854;
          var map = L.map('map').setView([defaultLat, defaultLng], 12);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

          var services = ${JSON.stringify(services)};

          services.forEach(function(s) {
            var marker = L.marker([s.latitude, s.longitude]).addTo(map)
              .bindPopup(s.name + " (" + s.role + ")");
            
            // If this is the one we want to focus, open popup and center
            if (${focusService ? focusService.id : null} === s.id) {
              map.setView([s.latitude, s.longitude], 15);
              marker.openPopup();
            }
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ html: mapHTML }} />
    </View>
  );
}
