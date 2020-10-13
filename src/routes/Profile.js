import { authService, dbService } from 'fbase';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default ({userObject}) => {
	const history = useHistory();
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
			console.log(tweets);
		}
		getMyTweets();
	}, [userObject.uid]);


	return (
		<>
			<button onClick={onLogOutClick}>Log Out</button>
		</>
	)
};