import React from 'react';
import {HashRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import Profile from 'routes/Profile';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Navigation from './Navigation';

const AppRouter = ({isLoggedIn, userObject, refreshUser}) => {
	return (
		<Router>
			{isLoggedIn && <Navigation userObject={userObject} /> }
			<Switch>
				<>
					{isLoggedIn ? (
						<div
							style={{
								maxWidth: 890,
								width: "100%",
								margin: "0 auto",
								marginTop: 80,
								display: "flex",
								justifyContent: "center",
							}}
						>
							<Route exact path="/">
								<Home userObject={userObject} />
							</Route>
							<Route exact path="/profile">
								<Profile
									userObject={userObject}
									refreshUser={refreshUser} />
							</Route>
							<Redirect from="*" to="/" />
						</div>
					) : (
						<>
							<Route exact path="/">
								<Auth />
							</Route>
							<Redirect from="*" to="/" />
						</>
					)}
				</>
			</Switch>
		</Router>
	)
}

export default AppRouter;
