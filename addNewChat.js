import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

class AddNewChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatName: "",
      searchResults: [],
      loggedInMember: "",
    };
  }

  addNewChat = async () => {
    const token = await AsyncStorage.getItem("session_token");
    const user_id = await AsyncStorage.getItem("user_id");

    const { chatName } = this.state;

    fetch(`http://localhost:3333/api/1.0.0/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `${token}`,
      },
      body: JSON.stringify({ name: this.state.chatName }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.props.navigation.navigate("ChatList");
        // if (response.ok) {
        // } else {
        //   throw new Error("Failed to save user.");
        // }
      })
      .catch((error) => console.error(error));
  };

  saveUser = async (userId) => {
    const token = await AsyncStorage.getItem("session_token");

    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          // show success message
        } else {
          throw new Error("Failed to save user.");
        }
      })
      .catch((error) => console.error(error));
  };

  render() {
    const { chatName, searchResults } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Add New Chat</Text>
        <View style={styles.main}>
          <TextInput
            style={styles.input}
            value={chatName}
            onChangeText={(text) => this.setState({ chatName: text })}
            placeholder="Add chat..."
          />
          <Button title="Add" onPress={this.addNewChat} />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  flatList: {
    width: "87%",
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E2E2",
    // alignItems: "center",
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  itemEmail: {
    fontSize: 14,
    color: "#8F8F8F",
  },
  main: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 30,
  },
  button: {
    height: "10px",
    // flex: 1,
  },

  container: {
    flex: 1,

    backgroundColor: "white",
    alignItems: "center",
    // justifyContent: "center",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    marginTop: 50,
    fontWeight: "bold",
  },
  input: {
    // width: "100%",
    // flex: 4,
    marginRight: 4,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    // marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    marginBottom: 10,
    width: "81%",
    backgroundColor: "#3148c9 !impo",
  },
  button: {
    // backgroundColor: "#3148c9",
    // backgroundColor: "red",
  },
});

export default AddNewChat;
