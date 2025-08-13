import { Feather, FontAwesome5 } from "@expo/vector-icons";

export const ToolboxIcon = ({ ...props }) => (
  <FontAwesome5 name="toolbox" size={24} color="white" {...props} />
);

export const LogOutIcon = ({ ...props }) => (
  <Feather name="log-out" size={24} color="white" {...props} />
);

export const LogInIcon = ({ ...props }) => (
  <Feather name="log-in" size={24} color="white" {...props} />
);

export const PlusIcon = ({ ...props }) => (
  <Feather name="plus-circle" size={24} color="white" {...props} />
);
