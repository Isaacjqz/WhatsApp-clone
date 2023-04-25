import {
  ImageBackground,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import bg from "../../assets/images/BG.png";
import Message from "../components/Message";
import messages from "../../assets/data/messages.json";
import InputBox from "../components/InputBox";
import { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom, listMessagesByChatRoom } from "../graphql/queries";
import { onCreateMessage } from "../graphql/subscriptions";

const ChatScreen = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();

  const chatroomID = route.params.id;

  // Fetches Chat Room
  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatroomID })).then(
      (result) => setChatRoom(result.data?.getChatRoom)
    );
  }, [chatroomID]);

  // Fetches the messages
  useEffect(() => {
    API.graphql(
      graphqlOperation(listMessagesByChatRoom, {
        chatroomID,
        sortDirection: "DESC",
      })
    ).then((result) => {
      setMessages(result.data?.listMessagesByChatRoom?.items);
    });

    // Subscribe to new messages
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage, {
        filter: { chatroomID: { eq: chatroomID } },
      })
    ).subscribe({
      next: ({ value }) => {
        setMessages((messages) => [value.data.onCreateMessage, ...messages]);
      },
      error: (error) => console.warn(error),
    });

    // Stop receiving data updates from the subscription
    return () => subscription.unsubscribe;
  }, [chatroomID]);

  useEffect(() => {
    navigation.setOptions({ title: route.params.name });
  }, [route.params.name]);

  if (!chatRoom) {
    return <ActivityIndicator />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.bg}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90}
    >
      <ImageBackground source={bg} style={styles.bg}>
        <FlatList
          data={messages}
          renderItem={({ item }) => <Message message={item} />}
          style={{ padding: 10 }}
          inverted
        />

        <InputBox chatroom={chatRoom} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
});

export default ChatScreen;
