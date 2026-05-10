import os
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
    secure=True
)

def upload_profile_image(file_storage):
    if not file_storage:
        return None

    result = cloudinary.uploader.upload(
        file_storage,
        folder='traveloop/profiles',
        resource_type='image',
        transformation=[
            {'width': 512, 'height': 512, 'crop': 'fill', 'gravity': 'face'},
            {'quality': 'auto', 'fetch_format': 'auto'}
        ]
    )
    return result.get('secure_url')

def upload_trip_cover(file_storage):
    if not file_storage:
        return None

    result = cloudinary.uploader.upload(
        file_storage,
        folder='traveloop/trips',
        resource_type='image',
        transformation=[
            {'width': 1400, 'height': 900, 'crop': 'fill', 'gravity': 'auto'},
            {'quality': 'auto', 'fetch_format': 'auto'}
        ]
    )
    return result.get('secure_url')

def upload_journal_image(file_storage):
    if not file_storage:
        return None

    result = cloudinary.uploader.upload(
        file_storage,
        folder='traveloop/journal',
        resource_type='image',
        transformation=[
            {'width': 1200, 'height': 900, 'crop': 'fill', 'gravity': 'auto'},
            {'quality': 'auto', 'fetch_format': 'auto'}
        ]
    )
    return result.get('secure_url')
