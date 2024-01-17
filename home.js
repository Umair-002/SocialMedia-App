import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import userPic from "./../assets/logo.jpg";
import { Image } from "react-native";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  navigateToScreen = (url) => {
    this.props.navigation.navigate(url);
  };

  async componentDidMount() {
    try {
      const token = await AsyncStorage.getItem("session_token");
      if (!token) {
        this.props.navigation.replace("Login");
      }
    } catch (error) {
      console.log("Error retrieving token from AsyncStorage:", error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={userPic}
          style={[styles.userProfileIcon, styles.marginLeft]}
        />
        <Text style={styles.mainTitle}>Welcome</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => this.navigateToScreen("SearchUser")}
          >
            <Text style={styles.title}>Add Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => this.navigateToScreen("Contacts")}
          >
            <Text style={styles.title}>Contacts</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => this.navigateToScreen("AddNewChat")}
          >
            <Text style={styles.title}>Add Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => this.navigateToScreen("ChatList")}
          >
            <Text style={styles.title}>Chats</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => this.navigateToScreen("AddNewUser")}
          >
            <Text style={styles.title}>Add Users</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() => this.navigateToScreen("BlockedContacts")}
          >
            <Text style={styles.title}>Blocked Contacts</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userProfileIcon: {
    width: 100,
    height: 100,
    borderRadius: 25,
    marginRight: 10,
    // backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  card: {
    width: "40%",

    height: 100,
    borderRadius: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    backgroundColor: "#fff",
    // elevation: 2, // Add box shadow
    // shadowColor: "gray", // Add shadow color
  },
});

export default Home;
