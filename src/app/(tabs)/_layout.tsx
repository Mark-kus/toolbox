import { Tabs } from "expo-router";
import { LogInIcon, LogOutIcon } from "../../components/Icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 80,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#016992",
        tabBarInactiveTintColor: "#718096",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="available"
        options={{
          title: "Disponibles",
          tabBarIcon: ({ color }) => <LogOutIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="borrowed"
        options={{
          title: "Prestadas",
          tabBarIcon: ({ color }) => <LogInIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
