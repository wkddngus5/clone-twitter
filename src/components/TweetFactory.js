import React, {useState} from 'react';
import { dbService, storageService } from 'fbase';
import {v4 as uuidv4} from 'uuid';

const TweetFactory = ({ userObject }) => {
	const [tweet, setTweet] = useState('');
	const [attachment, setAttachment] = useState('');

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
	);
}

export default TweetFactory;