import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";

class UpdateChatMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatMessage: "",
      searchResults: [],
      loggedInMember: "",
    };
  }

  componentDidMount() {
    this.setState({ chatMessage: this.props.route.params.chatDetails.message });
  }

  UpdateChatName = async () => {
    try {
      const { chatDetails } = this.props.route.params;

      const token = await AsyncStorage.getItem("session_token");
      fetch(
        `http://localhost:3333/api/1.0.0/chat/${chatDetails.chatId}/message/${chatDetails.message_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": `${token}`,
          },
          body: JSON.stringify({ message: this.state.chatMessage }),
        }
      ).then((response) => {
        if (response.ok) {
          this.props.navigation.goBack();
          // show success message
        } else {
          throw new Error("Failed to save user.");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { chatMessage, searchResults } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Update Chat Message</Text>
        <View style={styles.main}>
          <TextInput
            style={styles.input}
            value={chatMessage}
            onChangeText={(text) => this.setState({ chatMessage: text })}
            placeholder="Update chat..."
          />
          <Button title="Update" onPress={this.UpdateChatName} />
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

export default UpdateChatMessage;
