import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, Alert } from "react-native";
import { getServices, deleteService } from "../services/api";

export default function ServicesList({ navigation }) {
  const [services, setServices] = useState([]);

  const load = () => {
    getServices()
      .then(res => setServices(res.data))
      .catch(err => {
        console.log(err);
        Alert.alert("Error", "Cannot load services");
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", load);
    load();
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id) => {
    deleteService(id)
      .then(() => load())
      .catch(() => Alert.alert("Error", "Delete failed"));
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Button title="Register new" onPress={() => navigation.navigate("Register")} />
      
      {/* Add spacing between buttons */}
      <View style={{ height: 10 }} />

      <Button title="Search on map" onPress={() => navigation.navigate("Search")} />

      <FlatList
        data={services}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderBottomWidth: 1, borderColor: "#ddd" }}>
            {/* When you tap the name, go to the map and focus on this service */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Search", { focusService: item })}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16, color: "blue" }}>
                {item.name} ({item.role})
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", marginTop: 8 }}>
              <TouchableOpacity
                style={{ marginRight: 12 }}
                onPress={() => navigation.navigate("Update", { service: item })}
              >
                <Text style={{ color: "green" }}>Update location</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={{ color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
