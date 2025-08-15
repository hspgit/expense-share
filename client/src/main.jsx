import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from '@apollo/client'
import {setContext} from '@apollo/client/link/context';
import {ChakraProvider} from '@chakra-ui/react'
import {GoogleOAuthProvider} from '@react-oauth/google';
import './index.css'
import App from './App.jsx'

const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_APP_BASE_URL
                         || 'http://localhost:4000/graphql';

const httpLink = createHttpLink({uri: GRAPHQL_ENDPOINT});

const authLink = setContext((_, {headers}) => {
    const loginData = localStorage.getItem('login');
    let userId = null;
    if (loginData) {
        try {
            userId = JSON.parse(loginData).googleId;
        } catch {
            console.error('Failed to parse login data:', loginData);
        }
    }
    return {
        headers: {
            ...headers,
            userId: userId || '',
        },
    };
});

const client = new ApolloClient({
                                    link: authLink.concat(httpLink),
                                    cache: new InMemoryCache(),
                                });

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
                         || 'your-google-client-id.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <ApolloProvider client={client}>
                <ChakraProvider>
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                        <App/>
                    </GoogleOAuthProvider>
                </ChakraProvider>
            </ApolloProvider>
        </BrowserRouter>
    </StrictMode>
)
