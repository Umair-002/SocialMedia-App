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

class SearchUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      searchResults: [],
      loggedInMember: "",
    };
  }

  searchUser = async () => {
    const token = await AsyncStorage.getItem("session_token");
    const user_id = await AsyncStorage.getItem("user_id");

    const { searchText } = this.state;

    fetch(
      `http://localhost:3333/api/1.0.0/search?q=${searchText}&search_in=all&limit=20&offset=0`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": `${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        this.setState({ searchResults: data, loggedInMember: user_id });
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
    const { searchText, searchResults } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Add New Contact</Text>
        <View style={styles.main}>
          <TextInput
            style={styles.input}
            value={searchText}
            onChangeText={(text) => this.setState({ searchText: text })}
            placeholder="Search user"
          />
          <Button title="Search" onPress={this.searchUser} />
        </View>

        <FlatList
          style={styles.flatList}
          data={searchResults}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => (
            <View
              // style={styles.row}
              //   onPress={() => this.saveUser(item.user_id)}
              style={styles.itemContainer}
            >
              {this.state.loggedInMember != item.user_id ? (
                <>
                  <Text style={styles.itemName}>{item.given_name}</Text>
                  <TouchableOpacity onPress={() => this.saveUser(item.user_id)}>
                    <Icon name="plus-square-o" size={20} color="green" />
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.itemName}>{item.given_name} ( you )</Text>
              )}
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
    fontWeight: "bold",
  },
  input: {
    // width: 5,
    // flex: 7,
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

export default SearchUser;
