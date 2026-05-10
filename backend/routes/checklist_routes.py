from flask import Blueprint
from controllers.checklist_controller import create_checklist_item, delete_checklist_item, get_checklist, reset_checklist, update_checklist_item

checklist_bp = Blueprint('checklist', __name__)

checklist_bp.get('/<int:trip_id>')(get_checklist)
checklist_bp.post('/create')(create_checklist_item)
checklist_bp.put('/update')(update_checklist_item)
checklist_bp.delete('/delete')(delete_checklist_item)
checklist_bp.delete('/reset/<int:trip_id>')(reset_checklist)
