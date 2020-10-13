import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';

const Tweet = ({tweetObject, isOwner}) => {
	const [editing, setEditing] = useState(false);
	const [newTweet, setNewTweet] = useState(tweetObject.text);

	const onDeleteClick = async () => {
		const ok = window.confirm('Are you sure you want to delete this tweet?');
		if(ok) {
			await dbService.doc(`tweets/${tweetObject.id}`).delete();
			await storageService.refFromURL(tweetObject.attachmentUrl).delete();
		}
	}

	const toggleEditing = () => setEditing((prev) => !prev);

	const onSubmit = async (event) => {
		event.preventDefault();
		await dbService.doc(`tweets/${tweetObject.id}`).update({
			text: newTweet,
		});
		setEditing(false);
	}

	const onChange = (event) => {
		const {target: {value}} = event;
		setNewTweet(value);
	}

	return (
		<div key={tweetObject.id}>
			{
				editing ?  (
					<>
						<form onSubmit={onSubmit}>
							<input
								value={newTweet }
								required
								type="text"
								placeholder="Edit you tweet"
								onChange={onChange} />
							<input type="submit" value="Update Tweet" />
						</form>
						<button onClick={toggleEditing}>Cancel</button>
					</>
				) : (
					<>
						<h4>{tweetObject.text}</h4>
						{tweetObject.attachmentUrl && <img alt="image" src={tweetObject.attachmentUrl} width="50px" height="50px" />}
						{
							isOwner &&
								<>
									<button onClick={onDeleteClick}>Delete tweet</button>
									<button onClick={toggleEditing}>Edit tweet</button>
								</>
						}
					</>
				) 

			}
		</div>
	);
}

export default Tweet;