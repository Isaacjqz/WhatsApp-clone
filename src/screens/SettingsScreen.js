import { View, Text, Button } from "react-native";
import { Auth } from "aws-amplify";

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Sign Out" onPress={() => Auth.signOut()} />
    </View>
  );
};

export default SettingsScreen;
