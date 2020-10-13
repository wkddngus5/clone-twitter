import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export default ({userObject, refreshUser}) => {
	const history = useHistory();
	const [newDisplayName, setNewDisplayName] = useState(userObject.displayName);
	const onLogOutClick = () => {
		authService.signOut();
		history.push('/');
	}
	

	useEffect(() => {
		const getMyTweets = async () => {
			const tweets = await dbService
				.collection('tweets')
				.where('creatorId', '==', userObject.uid)
				.orderBy('createdAt')
				.get();
		}
		getMyTweets();
	}, [userObject.uid]);

	const onChange = (event) => {
		setNewDisplayName(event.target.value);
	}
	const onSubmit = async (event) => {
		event.preventDefault();
		console.log(userObject.displayName !== newDisplayName)
		if (userObject.displayName !== newDisplayName) {
			await userObject.updateProfile({
				displayName: newDisplayName,
			});
			refreshUser();
		}
	}

	return (
		<>
			<form onSubmit={onSubmit}>
				<input
					type="text"
					placeholder="Display name"
					value={newDisplayName}
					onChange={onChange} />
				<input type="submit" value="Update Profile" />
			</form>
			<button onClick={onLogOutClick}>Log Out</button>
		</>
	)
};