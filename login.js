import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  Button,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as EmailValidator from "email-validator";
import { globalStyles } from "./../globalStyle";

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
    };
  }

  // Function to store the key-value pair in the device storage
  async storeInDeviceStorage(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error storing ${key}: ${error}`);
    }
  }

  _onPressButton = async () => {
    const { email, password } = this.state;

    let emailError = "";
    let passwordError = "";

    if (!email) {
      emailError = "Must enter email";
    }
    // else if (!EmailValidator.validate(email)) {
    //   emailError = "Must enter valid email";
    // }
    if (!password) {
      passwordError = "Must enter password";
    }

    if (emailError || passwordError) {
      this.setState({ emailError, passwordError });
      return;
    }

    // Call the login API
    const response = await fetch("http://localhost:3333/api/1.0.0/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status === 200) {
      this.props.navigation.navigate("Home");
      // Store the token and user in the app's state
      const data = await response.json();

      console.log("Response data:", data); // Add this line to log the response data
      const { id, token } = data; // Update this line to get the id and token directly from the data

      this.setState({ token, user: { id } }); // Update this line to set the user object with the id

      // Store the user_id and session_token in the device storage
      await this.storeInDeviceStorage("user_id", id.toString()); // Update this line to use the id directly
      await this.storeInDeviceStorage("session_token", token);

      // Navigate to the AppNav screen
      this.props.navigation.navigate("Home");

      // ... (the rest of the code to handle other response statuses)
    } else if (response.status === 400) {
      alert("Invalid email/password supplied");
    } else if (response.status === 500) {
      alert("Server Error");
    } else {
      try {
        const message = await response.text();
        alert(`Failed to log in: ${message}`);
      } catch (error) {
        alert(`Failed to log in with status code ${response.status}`);
      }
    }
  };

  render() {
    const { email, password, emailError, passwordError } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(email) => this.setState({ email: email })}
          value={email}
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password: password })}
          value={password}
        />
        {passwordError ? (
          <Text style={styles.error}>{passwordError}</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            title="Login"
            onPress={this._onPressButton}
          />
        </View>

        <Text style={styles.text}>
          Don't have an account ?{" "}
          <Text
            style={styles.link}
            onPress={() => this.props.navigation.navigate("SignUp")}
          >
            create a new account
          </Text>
        </Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
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

export default LoginPage;
