import { authService, dbService } from 'fbase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

export default ({userObject, refreshUser}) => {
	const history = useHistory();
	const [newDisplayName, setNewDisplayName] = useState(userObject.displayName);
	const onLogOutClick = () => {
		authService.signOut();
		history.push('/');
		refreshUser();
	}
	
	useEffect(() => {
		const getMyTweets = async () => {
			await dbService
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
		<div className="container">
			<form
				className="profileForm"
				onSubmit={onSubmit}>
				<input
					autoFocus
					className="formInput"
					type="text"
					placeholder="Display name"
					value={newDisplayName}
					onChange={onChange} />
				<input
					className="formBtn"
					type="submit"
					value="Update Profile"
					style={{ marginTop: 10 }}
				/>
			</form>
			<span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
				Log Out
			</span>
		</div>
	)
};