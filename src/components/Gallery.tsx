import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

// Define interfaces for type safety
interface GalleryItem {
	id: string | number;
	image: string;
	label: string;
}

const Gallery: React.FC = () => {
	const [images, setImages] = useState<GalleryItem[]>([]);
	const [newImage, setNewImage] = useState<File | null>(null);
	const [newLabel, setNewLabel] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [editingId, setEditingId] = useState<string | number | null>(null);
	const [editingLabel, setEditingLabel] = useState<string>('');

	// API base URL
	const API_URL = 'http://localhost:3000/api/gallery';

	// Add AUTH_TOKEN constant
	const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;
	// Fetch all images on component mount
	useEffect(() => {
		fetchImages()
	}, [])

	const fetchImages = async (): Promise<void> => {
		try {
			setIsLoading(true);
			const response = await axios.get<GalleryItem[]>(API_URL);
			setImages(response.data);
			setError('');
		} catch (err) {
			setError('Failed to fetch images');
			console.error('Error fetching images:', err);
		} finally {
			setIsLoading(false);
		}
	}

	const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		if (!newImage || !newLabel) {
			setError('Please provide both image and label');
			return;
		}

		const formData = new FormData();
		formData.append('image', newImage);
		formData.append('label', newLabel);

		try {
			setIsLoading(true);
			await axios.post(API_URL, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'Authorization': `Bearer ${AUTH_TOKEN}`
				}
			});

			// Reset form and refresh images
			setNewImage(null);
			setNewLabel('');
			fetchImages();
			setError('');
		} catch (err: unknown) {
			const error = err as AxiosError<{error: string}>;
			setError(error.response?.data?.error || 'Failed to upload image');
			console.error('Error uploading image:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleImageUpdate = async (id: string | number, newLabel: string): Promise<void> => {
		try {
			setIsLoading(true);
			await axios.put(`${API_URL}/${id}`, 
				{ label: newLabel },
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${AUTH_TOKEN}`
					}
				}
			);
			fetchImages();
			setError('');
			setEditingId(null);
			setEditingLabel('');
		} catch (err: unknown) {
			const error = err as AxiosError<{error: string}>;
			setError(error.response?.data?.error || 'Failed to update image');
			console.error('Error updating image:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (label: string): Promise<void> => {
		try {
			setIsLoading(true);
			await axios.delete(`${API_URL}?q=${label}`, {
				headers: { 
					'Authorization': `Bearer ${AUTH_TOKEN}` 
				}
			});
			fetchImages();
		} catch (err) {
			setError('Failed to delete image');
			console.error('Error deleting image:', err);
		} finally {
			setIsLoading(false);
		}
	};

	const startEditing = (item: GalleryItem) => {
		setEditingId(item.id);
		setEditingLabel(item.label);
	};

	const cancelEditing = () => {
		setEditingId(null);
		setEditingLabel('');
	};

	return (
		<div className="gallery-container">
			<h1>Gallery</h1>

			{/* Upload Form */}
			<form onSubmit={handleImageUpload} className="upload-form">
				<input
					type="text"
					placeholder="Image Label"
					value={newLabel}
					onChange={(e) => setNewLabel(e.target.value)}
				/>
				<input
					type="file"
					accept="image/*"
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
						setNewImage(e.target.files ? e.target.files[0] : null)}
				/>
				<button type="submit" disabled={isLoading}>
					Upload Image
				</button>
			</form>
			{/* Error Display */}
			{error && <div className="error-message">{error}</div>}

			{/* Loading Indicator */}
			{isLoading && <div className="loading">Loading...</div>}

			{/* Gallery Grid */}
			<div className="gallery-grid">
				{images.map((item) => (
					<div key={item.id} className="gallery-item">
						<div className="image-container">
							<img
								src={`data:image/jpeg;base64,${item.image}`}
								alt={item.label}
								className="gallery-image"
								style={{ maxWidth: '800px', maxHeight: '600px', objectFit: 'contain' }}
							/>
						</div>
						{editingId === item.id ? (
							<div className="edit-controls">
								<input
									type="text"
									value={editingLabel}
									onChange={(e) => setEditingLabel(e.target.value)}
									className="edit-input"
								/>
								<button
									onClick={() => handleImageUpdate(item.id, editingLabel)}
									disabled={isLoading}
									className="save-btn"
								>
									Save
								</button>
								<button
									onClick={cancelEditing}
									disabled={isLoading}
									className="cancel-btn"
								>
									Cancel
								</button>
							</div>
						) : (
							<div className="item-controls">
								<p>{item.label}</p>
								<button
									onClick={() => startEditing(item)}
									disabled={isLoading}
									className="edit-btn"
								>
									Edit
								</button>
								<button
									onClick={() => handleDelete(item.label)}
									disabled={isLoading}
									className="delete-btn"
								>
									Delete
								</button>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

export { Gallery };