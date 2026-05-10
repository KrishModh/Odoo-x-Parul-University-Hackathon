import os
from dotenv import load_dotenv
from app import create_app

load_dotenv()

print("CLIENT ID:", os.getenv('GOOGLE_CLIENT_ID'))
app = create_app()

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', '5000')),
        debug=os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    )
