import React, { useEffect, useState } from 'react';
import Tweet from 'components/Tweet';
import { dbService } from 'fbase';
import TweetFactory from 'components/TweetFactory';

const Home = ({userObject}) => {
	const [tweets, setTweets] = useState([]);

	useEffect( () => {
		dbService.collection('tweets').onSnapshot(snapshot => {
			const tweetArray = snapshot.docs.map(document => ({id: document.id, ...document.data() }));
			setTweets(tweetArray);
		});
	}, []);

	return (
		<div className="container">
			<TweetFactory
				userObject={userObject} />
			<div style={{ marginTop: 30 }}>
				{tweets.map(tweet =>
					<Tweet
						key={tweet.id}
						tweetObject={tweet}
						isOwner={tweet.creatorId === userObject.uid}
					/>
				)}
			</div>
		</div>
	)
}
export default Home;