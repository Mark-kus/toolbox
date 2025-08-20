import { Tabs } from "expo-router";
import { LogInIcon, LogOutIcon } from "../../components/Icons";
import { Pressable } from "react-native";

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
          height: 80,
        },
        tabBarActiveTintColor: "#016992",
        tabBarInactiveTintColor: "#718096",
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "600",
        },
        tabBarButton: (props: any) => (
          <Pressable
            {...props}
            android_ripple={{ radius: 60 }}
            style={({ pressed }) => [
              props.style,
              { opacity: pressed ? 0.7 : 1 },
              { paddingTop: 10 },
            ]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
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
