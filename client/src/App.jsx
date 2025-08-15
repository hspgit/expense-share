import React, {useEffect, useState} from 'react';
import {Box, useColorModeValue,} from '@chakra-ui/react';
import {useApolloClient} from '@apollo/client';
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import Navbar from '@/components/Navbar.jsx';
import WelcomeScreen from './components/auth/WelcomeScreen.jsx';
import Expenses from '@/components/expenses/Expenses.jsx';
import Friends from '@/components/friends/Friends.jsx';
import Stats from '@/components/stats/Stats.jsx';

function App() {
    const [user, setUser] = useState(null);
    const bg = useColorModeValue('gray.50', 'gray.900');
    const client = useApolloClient();
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveTabFromRoute = (pathname) => {
        if (pathname === '/expenses') {
            return 0;
        }
        if (pathname === '/friends') {
            return 1;
        }
        if (pathname === '/stats') {
            return 2;
        }
        return 0;
    };

    const activeTab = getActiveTabFromRoute(location.pathname);

    useEffect(() => {
        const loginData = localStorage.getItem('login');
        if (loginData) {
            setUser(JSON.parse(loginData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('login');
        setUser(null);
        navigate('/');
        client.clearStore().then();
    };

    const handleTabChange = (index) => {
        if (index === 0) {
            navigate('/expenses');
        } else if (index === 1) {
            navigate('/friends');
        } else if (index === 2) {
            navigate('/stats');
        }
    };

    return (
        <Box minH="100vh" bg={bg} m={0} p={0}>
            <Navbar
                user={user}
                onLogout={handleLogout}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            {!user ? (
                <WelcomeScreen setUser={setUser}/>
            ) : (
                 <Routes>
                     <Route path="/" element={<Navigate to="/expenses" replace/>}/>
                     <Route path="/expenses" element={<Expenses user={user}/>}/>
                     <Route path="/friends" element={<Friends userId={user.googleId}/>}/>
                     <Route path="/stats" element={<Stats userId={user.googleId}/>}/>
                     <Route path="*" element={<Navigate to="/expenses" replace/>}/>
                 </Routes>
             )}
        </Box>
    );
}

export default App;
