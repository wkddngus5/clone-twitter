import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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
		<div
		className="tweet"
			key={tweetObject.id}>
			{
				editing ?  (
					<>
						<form
							className="container tweetEdit"
							onSubmit={onSubmit}>
							<input
								value={newTweet }
								required
								type="text"
								placeholder="Edit you tweet"
								onChange={onChange} />
							<input
								className="formBtn"
								type="submit"
								value="Update Tweet" />
						</form>
						<span
							className="formBtn cancelBtn"
							onClick={toggleEditing}>
							Cancel
						</span>
					</>
				) : (
					<>
						<h4>{tweetObject.text}</h4>
						{tweetObject.attachmentUrl && <img src={tweetObject.attachmentUrl} />}
						{
							isOwner && (
								<div className="tweet__actions">
									<span onClick={onDeleteClick}>
										<FontAwesomeIcon icon={faTrash} />
									</span>
									<span onClick={toggleEditing}>
										<FontAwesomeIcon icon={faPencilAlt} />
									</span>
								</div>
							)
						}
					</>
				)
			}
		</div>
	);
}

export default Tweet;