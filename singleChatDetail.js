import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import groupPic from "./../assets/group.png";
import userPic from "./../assets/user.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "./backButton";
import Icon from "react-native-vector-icons/FontAwesome";

class SingleChatDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupData: {},
      loggedInMember: {},
      messageText: "",
    };
  }

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.fetchMessage();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchMessage = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      const { chatId } = this.props.route.params;
      const token = await AsyncStorage.getItem("session_token");
      fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          data.messages.reverse();
          this.setState({ groupData: data, loggedInMember: userId });
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  removeMessageFromChat = async (message_id) => {
    const token = await AsyncStorage.getItem("session_token");
    const { chatId } = this.props.route.params;
    fetch(
      `http://localhost:3333/api/1.0.0/chat/${chatId}/message/${message_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `${token}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          let filter = this.state.groupData.messages.filter(
            (item) => item?.message_id !== message_id
          );
          this.setState({
            groupData: { ...this.state.groupData, messages: filter },
          });
          // show success message
        } else {
          throw new Error("Failed to save user.");
        }
      })
      .catch((error) => console.error(error));
  };
  navigateToUpdateChatMessageScreen = (messageDetail) => {
    const { chatId } = this.props.route.params;
    let obj = { chatId, ...messageDetail };
    this.props.navigation.navigate("UpdateChatMessage", {
      chatDetails: obj,
    });
  };
  renderChatItem = ({ item }) => {
    const { loggedInMember } = this.state;

    return (
      <>
        {item.author.user_id == loggedInMember ? (
          <View style={[styles.chatItem, styles.textRight, styles.myChatItem]}>
            <View style={styles.myChatContent}>
              <Image
                source={userPic}
                style={[styles.userProfileIcon, styles.marginLeft]}
              />
              <Text style={styles.chatMessage}>{item.message}</Text>
              <TouchableOpacity
                style={styles.actionDeleteSelf}
                onPress={() => this.removeMessageFromChat(item.message_id)}
              >
                <Icon name="trash-o" size={15} color="#FF6F61" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionDeleteSelf}
                onPress={() => this.navigateToUpdateChatMessageScreen(item)}
              >
                <Icon
                  // style={styles.icon}
                  // onPress={() => this.navigateToUpdateChatMessageScreen(item)}
                  name="edit"
                  size={20}
                  color="green"
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.chatItem, styles.myChatItem]}>
            <View style={styles.chatContent}>
              <Image source={userPic} style={styles.userProfileIcon} />
              <Text style={styles.chatMessage}>{item.message}</Text>
            </View>
          </View>
        )}
      </>
    );
  };
  handleTextChange = (text) => {
    this.setState({ messageText: text });
  };

  sendNewMessage = async () => {
    const { chatId } = this.props.route.params;
    const token = await AsyncStorage.getItem("session_token");

    fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `${token}`,
      },
      body: JSON.stringify({ message: this.state.messageText }),
    })
      .then((response) => {
        if (response.ok) {
          this.fetchMessage();
          this.handleTextChange("");
        } else {
          throw new Error("Failed to save user.");
        }
      })
      .catch((error) => console.error(error));
  };

  navigateToAddUserScreen = () => {
    this.props.navigation.navigate("AddUserToChat", {
      chatId: this.props.route.params.chatId,
    });
  };

  handleGoBack = () => {
    this.props.navigation.goBack();
  };
  render() {
    const { groupData } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.groupInfoContainer}>
          <View style={styles.main}>
            <BackButton handleGoBack={this.handleGoBack} />
            <Image source={groupPic} style={styles.profileIcon} />
            <Text style={styles.groupName}>{groupData.name}</Text>
          </View>
          <View disabled={!this.state.messageText}>
            <Text style={styles.sendButton}>
              <Text
                onPress={() => this.navigateToAddUserScreen()}
                style={styles.text}
              >
                +
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.chatSection}>
          <FlatList
            data={groupData.messages}
            renderItem={this.renderChatItem}
            keyExtractor={(item) => item.message_id.toString()}
          />
        </View>
        <View style={styles.addMessage}>
          <TextInput
            style={styles.input}
            placeholder="Type your message here"
            onChangeText={this.handleTextChange}
            value={this.state.messageText}
          />
          <TouchableOpacity
            disabled={!this.state.messageText}
            onPress={this.sendNewMessage}
          >
            <Text style={styles.sendButton}>
              <Text style={styles.text}>+</Text>
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.addButton}>
            <AntDesign
              //   onPress={() => this.onPressPlusButton()}
              name="plus"
              size={24}
              color="white"
            />
          </TouchableOpacity> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionDeleteSelf: {
    marginRight: "6px",
    marginTop: "2px",
  },

  main: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  text: {
    position: "relative",
    top: -3,
  },
  input: {
    flex: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginRight: 10,
    marginTop: 10,
    height: 40,
  },
  addButton: {
    backgroundColor: "#3F51B5",
    borderRadius: 50,
    padding: 5,
    flex: 1,
  },
  sendButton: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#444",
    marginTop: 5,
    height: 40,
    width: 40,
    backgroundColor: "#2196F3",
    textAlign: "center",
    borderRadius: 20,
    paddingTop: -16,
    marginTop: 10,
    color: "#fff",
  },
  addMessage: {
    flexDirection: "row",
    flex: 1,
  },
  textRight: {
    textAlign: "right",
  },
  chatSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#bda8a8",
    borderTopWidth: 1,
    borderTopColor: "#bda8a8",
    flex: 8,
  },
  groupInfoContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 15,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  marginLeft: {
    marginLeft: 10,
  },
  userProfileIcon: {
    width: 20,
    height: 20,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  groupName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 12,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  myChatItem: {
    flexDirection: "row-reverse",
  },
  //   profileIcon: {
  //     marginRight: 10,
  //     width: 30,
  //     height: 30,
  //     borderRadius: 15,
  //     backgroundColor: "#ccc",
  //     textAlign: "center",
  //     textAlignVertical: "center",
  //   },
  chatContent: {
    flex: 1,
    flexDirection: "row",
  },
  myChatContent: {
    flex: 1,
    flexDirection: "row-reverse",
  },
  chatAuthor: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  chatMessage: {
    position: "relative",
    // top: 5,
  },
  chatTimestamp: {
    fontSize: 12,
    color: "#666",
  },
});

export default SingleChatDetail;
