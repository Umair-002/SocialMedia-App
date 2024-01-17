import React, { Component } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import profilePic from "./../assets/group.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import BackButton from "./backButton";

export default class ChatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatList: [],
      isLoading: false,
    };
  }
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.fetchChat();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  fetchChat = async () => {
    try {
      const token = await AsyncStorage.getItem("session_token");

      fetch("http://localhost:3333/api/1.0.0/chat", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({ chatList: data });
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {}
  };
  navigateToChatScreen = (chatId) => {
    this.props.navigation.navigate("SingleChatDetail", {
      chatId,
    });
  };

  navigateToUpdateChatScreen = (chatId) => {
    this.props.navigation.navigate("UpdateChatName", {
      chatDetails: chatId,
    });
  };
  renderChatItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => this.navigateToChatScreen(item?.chat_id)}
        style={styles.chatItem}
      >
        {/* <Icon name="user" size={30} style={styles.profileIcon} /> */}
        <Image source={profilePic} style={styles.profileIcon} />
        <View style={styles.chatDetails}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.lastMessage}>{item.last_message?.message}</Text>
        </View>
      </TouchableOpacity>
      <Icon
        style={styles.icon}
        onPress={() => this.navigateToUpdateChatScreen(item)}
        name="edit"
        size={20}
        color="green"
      />
    </View>
  );
  navigateToAddNewChat = () => {
    this.props.navigation.navigate("AddNewChat"); // Replace 'SignupScreen' with the name of your signup screen if it's different
  };
  handleGoBack = () => {
    this.props.navigation.goBack();
  };
  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.heading}>
        <BackButton
          styling={styles.backIcon}
          handleGoBack={this.handleGoBack}
        />
        <Text style={styles.headerTitle}>Chats</Text>
      </View>

      <TouchableOpacity style={styles.addButton}>
        <AntDesign
          onPress={() => this.navigateToAddNewChat()}
          name="plus"
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
    //   <View style={styles.groupInfoContainer}>
    //   <View style={styles.main}>
    //     <BackButton handleGoBack={this.handleGoBack} />
    //     <Text style={styles.groupName}>Chats</Text>
    //   </View>
    //   <View >
    //     <Text style={styles.sendButton}>
    //       <Text
    //         onPress={() => this.navigateToAddNewChat()}
    //         style={styles.text}
    //       >
    //         +
    //       </Text>
    //     </Text>
    //   </View>
    // </View>
  );

  render() {
    return (
      <View style={styles.main}>
        {/* <View style={styles.groupInfoContainer}>
          <Text style={styles.groupName}>Chat</Text>
        </View> */}
        {this.renderHeader()}
        {/* <Text style={styles.title}>Chats</Text> */}
        <FlatList
          data={this.state.chatList}
          renderItem={this.renderChatItem}
          keyExtractor={(item) => item.chat_id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backIcon: {
    position: "relative",
    right: "11px",
    // top: "9px",
  },
  icon: {
    position: "relative",
    top: "27px",
    right: "20px",
  },
  item: {
    flexDirection: "row",
    // flex: 1,
    // display: "flex",
    justifyContent: "space-between",
  },
  heading: {
    flexDirection: "row",
  },
  header: {
    height: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    // backgroundColor: "#fff",

    // backgroundColor: "#3b5998",
    backgroundColor: "transparent",
    // color: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    position: "relative",
    top: 15,
  },
  headerTitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "rgb(33, 150, 243)",
    borderRadius: 50,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginTop: 50,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  groupInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 15,
    height: 20,
  },
  groupName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  main: {
    backgroundColor: "#fff",
    height: "100%",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    flex: 1,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: "gray",
  },
});
