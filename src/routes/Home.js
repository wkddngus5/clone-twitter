import React, { useEffect, useState } from 'react';
import Tweet from 'components/Tweet';
import {v4 as uuidv4} from 'uuid';
import { dbService, storageService } from 'fbase';

const Home = ({userObject}) => {
	const [tweet, setTweet] = useState('');
	const [tweets, setTweets] = useState([]);
	const [attachment, setAttachment] = useState('');

	useEffect( () => {
		dbService.collection('tweets').onSnapshot(snapshot => {
			const tweetArray = snapshot.docs.map(document => ({id: document.id, ...document.data() }));
			setTweets(tweetArray);
		});
	}, []);

	const onSubmit = async (event) => {
		event.preventDefault();
		let attachmentUrl = '';
		if(attachment !== '') {
			const attachmentRef = storageService.ref().child(`${userObject.uid}/${uuidv4()}`);
			const response = await attachmentRef.putString(attachment, 'data_url');
			attachmentUrl = await response.ref.getDownloadURL();
		}
		const tweetObject = {
			text: tweet,
			createdAt: Date.now(),
			creatorId: userObject.uid,
			attachmentUrl,
		}
		await dbService.collection('tweets').add(tweetObject);
		setTweet('');
	}
	const onChange = (event) => {
		const {target:{value}} = event;
		setTweet(value);
	}
	const onFileChange = (event) => {
		const {target: {files}} = event;
		const theFile = files[0];
		const reader = new FileReader();
		reader.onload = (finishEvent) => {
			const {currentTarget: {result}} = finishEvent;
			setAttachment(result);
		}
		reader.readAsDataURL(theFile);
	}

	const onClearPhotoClick = () => setAttachment(null);

	return (
		<div>
			<form onSubmit={onSubmit}>
				<input
					type="text"
					placeholder="What's on your mind?"
					maxLength={120}
					value={tweet}
					onChange={onChange} />
				<input type="file" accept="image/*"  onChange={onFileChange} />
				<input type="submit" value="tweet" />
				{attachment && (
					<div>
						<img alt="preview" src={attachment} width="50px" height="50px" />
						<button onClick={onClearPhotoClick}>Clear</button>
					</div>
				)}
			</form>
			<div>
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