import { View, Text, FlatList } from "react-native";
import ChatListItem from "../components/ChatListItem";
import chats from "../../assets/data/chats.json";

const chat = {
  id: "1",
  user: {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/6/67/Luke_Skywalker_-_Welcome_Banner_%28Cropped%29.jpg",
    name: "Luke Skywalker",
  },
  lastMessage: {
    text: "Hello There! How is it going?",
    createdAt: "07:30",
  },
};

const ChatsScreen = () => {
  return (
    <FlatList
      data={chats}
      renderItem={({ item }) => <ChatListItem chat={item} />}
    />
  );
};

export default ChatsScreen;
