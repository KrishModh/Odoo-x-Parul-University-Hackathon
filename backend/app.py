from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from sqlalchemy import inspect, text
from config.settings import Config
from db.database import db
from routes.auth_routes import auth_bp
from routes.activity_routes import activity_bp
from routes.itinerary_routes import itinerary_bp
from routes.trip_routes import trip_bp
from routes.city_routes import city_bp
from routes.user_routes import user_bp
from routes.budget_routes import budget_bp
from routes.checklist_routes import checklist_bp
from routes.journal_routes import journal_bp
from routes.share_routes import share_bp

jwt = JWTManager()

def ensure_lightweight_schema_updates():
    # Hackathon-friendly migration safety for columns added after the first db.create_all run.
    inspector = inspect(db.engine)
    if 'trips' not in inspector.get_table_names():
        return
    trip_columns = {column['name'] for column in inspector.get_columns('trips')}
    if 'is_public' not in trip_columns:
        db.session.execute(text('ALTER TABLE trips ADD COLUMN is_public BOOLEAN DEFAULT FALSE NOT NULL'))
    if 'public_slug' not in trip_columns:
        db.session.execute(text('ALTER TABLE trips ADD COLUMN public_slug VARCHAR(180)'))
        db.session.execute(text('CREATE UNIQUE INDEX IF NOT EXISTS ix_trips_public_slug ON trips (public_slug)'))
    db.session.commit()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r'/api/*': {'origins': app.config['FRONTEND_ORIGIN']}}, supports_credentials=True)
    db.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(trip_bp, url_prefix='/api/trips')
    app.register_blueprint(itinerary_bp, url_prefix='/api/itinerary')
    app.register_blueprint(budget_bp, url_prefix='/api/budget')
    app.register_blueprint(checklist_bp, url_prefix='/api/checklist')
    app.register_blueprint(journal_bp, url_prefix='/api/journal')
    app.register_blueprint(share_bp, url_prefix='/api/share')
    app.register_blueprint(activity_bp, url_prefix='/api/activities')
    app.register_blueprint(city_bp, url_prefix='/api/cities')

    @app.get('/api/health')
    def health_check():
      return jsonify({'status': 'ok', 'service': 'traveloop-api'}), 200

    @app.errorhandler(404)
    def not_found(_):
      return jsonify({'message': 'Route not found'}), 404

    with app.app_context():
      db.create_all()
      ensure_lightweight_schema_updates()

    return app
