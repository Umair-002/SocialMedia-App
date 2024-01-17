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

class BlockedContacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockUsers: [],
      isLoading: false,
    };
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem("session_token");

    fetch("http://localhost:3333/api/1.0.0/blocked", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        this.setState({ blockUsers: data });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  unBlockContact = async (userId) => {
    const token = await AsyncStorage.getItem("session_token");

    fetch(`http://localhost:3333/api/1.0.0/user/${userId}/contact`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": `${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          let filter = this.state.contacts.filter(
            (item) => item?.user_id !== userId
          );
          this.setState({
            blockUsers: filter,
          });
          // show success message
        } else {
          throw new Error("Failed to save user.");
        }
      })
      .catch((error) => console.error(error));
  };

  render() {
    const { blockUsers } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Blocked Contacts</Text>

        <FlatList
          style={styles.flatList}
          data={blockUsers}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => (
            <View
              // style={styles.row}
              //   onPress={() => this.unBlockContact(item.user_id)}
              style={styles.itemContainer}
            >
              <Text style={styles.itemName}>{item.first_name}</Text>
              <TouchableOpacity
                onPress={() => this.unBlockContact(item.user_id)}
              >
                <Icon name="trash-o" size={20} color="#FF6F61" />
              </TouchableOpacity>
              {/* <Text style={styles.itemEmail}>{item.email}</Text> */}
            </View>
          )}
        />
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
    // fontWeight: "bold",
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
    justifyContent: "center",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    marginTop: 50,
    marginBottom: 20,
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

export default BlockedContacts;
