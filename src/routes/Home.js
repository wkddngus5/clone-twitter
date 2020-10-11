import { dbService } from 'fbase';
import React, { useState } from 'react';

const Home = () => {
	const [tweet, setTweet] = useState('');
	const onSubmit = async (event) => {
		event.preventDefault();
		await dbService.collection('tweets').add({
			tweet,
			createdAt: Date.now(),
		});
		setTweet('');
	}
	const onChange = (event) => {
		const {target:{value}} = event;
		setTweet(value);
	}
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
		</div>
	)
}
export default Home;