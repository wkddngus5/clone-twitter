import React, {useEffect, useState} from 'react';
import AppRouter from 'components/Router';
import {authService} from 'fbase';
import { auth } from 'firebase';

function App() {
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
	const [userObject, setUserObject] = useState(null);

	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
				setUserObject(user);
			} else {
				setIsLoggedIn(false);
				setUserObject(null);
			}
			setInit(true);
		});
	}, []);
	return (
		<>
			{init ? <AppRouter isLoggedIn={isLoggedIn} userObject={userObject} /> : 'Initializing...'  }
			<footer>&copy; Twitter {new Date().getFullYear()}</footer>
		</>
	);
}

export default App;
