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

class SignupPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      firstNameError: "",
      lastNameError: "",
    };
  }

  navigateToSignin = () => {
    this.props.navigation.navigate("Login"); // Replace 'SignupScreen' with the name of your signup screen if it's different
  };

  // Function to store the key-value pair in the device storage
  async storeInDeviceStorage(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error storing ${key}: ${error}`);
    }
  }

  _onPressButton = async () => {
    const { email, password, first_name, last_name } = this.state;

    let emailError = "";
    let passwordError = "";
    let firstNameError = "";
    let lastNameError = "";
    if (!first_name) {
      firstNameError = "Must enter first name";
    }
    if (!last_name) {
      lastNameError = "Must enter last name";
    }
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
      this.setState({
        emailError,
        passwordError,
        firstNameError,
        lastNameError,
      });
      return;
    }

    // Call the add user API
    const response = await fetch("http://localhost:3333/api/1.0.0/user", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, first_name, last_name }),
    });

    if (response.status === 200) {
      // Store the token and user in the app's state
      const data = await response.json();
      console.log("Response data:", data); // Add this line to log the response data
      const { id, token } = data; // Update this line to get the id and token directly from the data

      this.setState({ token, user: { id } }); // Update this line to set the user object with the id

      // Store the user_id and session_token in the device storage
      await this.storeInDeviceStorage("user_id", id.toString()); // Update this line to use the id directly
      await this.storeInDeviceStorage("session_token", token);

      // Navigate to the AppNav screen
      // this.props.navigation.navigate("AppNavigator");

      // ... (the rest of the code to handle other response statuses)
    } else if (response.status === 400) {
      alert(
        "email must be valid and password must be strong (greater than 8 characters inclusing one upper, one nummber, and one special character"
      );
    } else if (response.status === 500) {
      alert("Server Error");
    } else {
      try {
        this.navigateToSignin();
        // const message = await response.text();
        // alert(`Failed to log in: ${message}`);
      } catch (error) {
        alert(`Failed to log in with status code ${response.status}`);
      }
    }
  };

  render() {
    const {
      email,
      password,
      emailError,
      passwordError,
      firstNameError,
      lastNameError,
      first_name,
      last_name,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          onChangeText={(firstName) => this.setState({ first_name: firstName })}
          value={first_name}
        />
        {firstNameError ? (
          <Text style={styles.error}>{firstNameError}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          onChangeText={(lastName) => this.setState({ last_name: lastName })}
          value={last_name}
        />
        {lastNameError ? (
          <Text style={styles.error}>{lastNameError}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(email) => this.setState({ email: email })}
          value={email}
        />
        <Text style={styles.textExample}>ex: abc.xyz@mmu.ac.uk</Text>

        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password: password })}
          value={password}
        />
        <Text style={styles.textExample}>ex: Abcdef4@</Text>
        {passwordError ? (
          <Text style={styles.error}>{passwordError}</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            title="Sign Up"
            onPress={this._onPressButton}
          />
        </View>
        <Text style={styles.text}>
          Already have an account ?{" "}
          <Text style={styles.link} onPress={() => this.navigateToSignin()}>
            Login
          </Text>
        </Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  textExample: {
    position: "relative",
    top: "-10px",
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
  },
  button: {
    backgroundColor: "#3148c9",
    // backgroundColor: "red",
  },
});

export default SignupPage;
