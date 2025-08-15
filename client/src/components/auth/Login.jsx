import React from 'react';
import {GoogleLogin} from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import {gql, useMutation} from '@apollo/client';
import {Box, Text, useToast, VStack} from '@chakra-ui/react';

const CREATE_USER = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            googleId
            username
            email
            createdAt
            avatar
        }
    }
`;

function Login({setUser}) {
    const toast = useToast();

    const [createUser, {loading}] = useMutation(CREATE_USER, {
        onCompleted: (data) => {
            toast({
                      title: "Login successful",
                      description: `Welcome, ${data.createUser.username}!`,
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                  });
        },
        onError: (error) => {
            console.error("Error creating user:", error);
            toast({
                      title: "Login error",
                      description: "There was a problem with your login",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                  });
        }
    });

    const onSuccess = (res) => {
        try {
            const tokenData = jwtDecode(res.credential);
            const loginData = {
                googleId: tokenData.sub,
                ...tokenData
            };

            setUser(loginData);
            localStorage.setItem("login", JSON.stringify(loginData));
            console.log("Login data:", loginData);

            createUser({
                           variables: {
                               input: {
                                   googleId: loginData.googleId,
                                   username: loginData.name,
                                   email: loginData.email,
                                   createdAt: new Date().toISOString(),
                                   avatar: loginData.picture || null
                               }
                           }
                       });
        } catch (error) {
            console.error("Error processing login:", error);
            toast({
                      title: "Login failed",
                      description: "There was a problem processing your login information",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                  });
        }
    };

    const onFailure = (res) => {
        console.error("Login failed:", res);
        toast({
                  title: "Authentication failed",
                  description: "Could not authenticate with Google",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
              });
    };

    return (
        <VStack spacing={4} p={5}>
            <Text fontSize="xl" fontWeight="bold">Sign in with Google</Text>
            <Box>
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onFailure}
                    useOneTap
                    shape="rectangular"
                    theme="filled_blue"
                    text="signin_with"
                    size="large"
                />
            </Box>
        </VStack>
    );
}

export default Login;