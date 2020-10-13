import React, {useEffect, useState} from 'react';
import AppRouter from 'components/Router';
import {authService} from 'fbase';
import { auth } from 'firebase';

function App() {
	const [init, setInit] = useState(false);
	const [userObject, setUserObject] = useState(null);

	useEffect(() => {
		authService.onAuthStateChanged((user) => {
			if (user) {
				setUserObject(user);
			} else {
				setUserObject(null);
			}
			setInit(true);
		});
	}, []);
	return (
		<>
			{init ? <AppRouter isLoggedIn={!!userObject} userObject={userObject} /> : 'Initializing...'  }
			{/* <footer>&copy; Twitter {new Date().getFullYear()}</footer> */}
		</>
	);
}

export default App;
