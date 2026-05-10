from flask import Blueprint
from controllers.journal_controller import create_journal, delete_journal, get_journal, update_journal

journal_bp = Blueprint('journal', __name__)

journal_bp.get('/<int:trip_id>')(get_journal)
journal_bp.post('/create')(create_journal)
journal_bp.put('/update')(update_journal)
journal_bp.delete('/delete')(delete_journal)
