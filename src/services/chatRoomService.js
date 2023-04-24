import { API, graphqlOperation, Auth } from "aws-amplify";

export const getCommonChatRoomWithUser = async (userID) => {
  const authUser = await Auth.currentAuthenticatedUser();

  // get all user1 chatrooms
  const response = await API.graphqlOperation(
    graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
  );

  const chatRooms = response.data?.getUser?.ChatRooms.items || [];

  const chatRoom = chatRooms.find((chatRoomItem) => {
    return chatRoomItem.chatRoom.users.items.some(
      (userItem) => userItem.user.id === userID
    );
  });

  return chatRoom;
};

export const listChatRooms = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      ChatRooms {
        items {
          chatRoom {
            id
            users {
              items {
                user {
                  id
                  image
                  name
                }
              }
            }
            LastMessage {
              id
              createdAt
              text
            }
          }
        }
      }
    }
  }
`;
