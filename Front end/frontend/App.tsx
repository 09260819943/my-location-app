import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RegisterService from "./screens/RegisterService.jsx";
import SearchService from "./screens/SearchService.jsx";
import ServicesList from "./screens/ServicesList.jsx";
import UpdateService from "./screens/UpdateService.jsx";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="List">
        <Stack.Screen name="List" component={ServicesList} />
        <Stack.Screen name="Register" component={RegisterService} />
        <Stack.Screen name="Search" component={SearchService} />
        <Stack.Screen name="Update" component={UpdateService} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
