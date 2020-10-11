import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';

const Home = ({userObject}) => {
	const [tweet, setTweet] = useState('');
	const [tweets, setTweets] = useState([]);

	useEffect( () => {
		dbService.collection('tweets').onSnapshot(snapshot => {
			const tweetArray = snapshot.docs.map(document => ({id: document.id, ...document.data() }));
			setTweets(tweetArray);
		});
	}, []);

	const onSubmit = async (event) => {
		event.preventDefault();
		await dbService.collection('tweets').add({
			text: tweet,
			createdAt: Date.now(),
			creatorId: userObject.uid,
		});
		setTweet('');
	}
	const onChange = (event) => {
		const {target:{value}} = event;
		setTweet(value);
	}
	console.log(tweets);
	return (
		<div>
			<form onSubmit={onSubmit}>
				<input
					type="text"
					placeholder="What's on your mind?"
					maxLength={120}
					value={tweet}
					onChange={onChange} />
				<input type="submit" value="tweet" />
			</form>
			<div>
				{tweets.map(tweet => 
					<div key={tweet.id}>
						<h4>{tweet.text}</h4>
					</div>
				)}
			</div>
		</div>
	)
}
export default Home;