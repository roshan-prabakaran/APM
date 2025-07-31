from flask import Flask, render_template, request, jsonify, session
import json
import time
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

# Sample data storage (in production, use a proper database)
users_data = {
    'john_doe': {
        'name': 'John Doe',
        'dob': '1990-01-15',
        'emergency_contact': 'Jane Doe - (555) 123-4567',
        'allergies': 'Penicillin, Shellfish',
        'medications': 'None',
        'blood_type': 'O+',
        'medical_history': [
            {'date': '2024-01-15', 'condition': 'Common Cold', 'treatment': 'Rest, fluids, OTC medication'},
            {'date': '2024-01-10', 'condition': 'Minor Cut', 'treatment': 'Cleaned, bandaged, antibiotic ointment'},
            {'date': '2024-01-05', 'condition': 'Headache', 'treatment': 'Acetaminophen 500mg'}
        ]
    }
}

medications_data = {
    'pain-relief': [
        {'id': 1, 'name': 'Acetaminophen 500mg', 'price': 8.99, 'stock': 45, 'description': 'For headaches and minor pain'},
        {'id': 2, 'name': 'Ibuprofen 200mg', 'price': 7.99, 'stock': 32, 'description': 'Anti-inflammatory pain reliever'},
        {'id': 3, 'name': 'Aspirin 325mg', 'price': 6.99, 'stock': 28, 'description': 'Pain relief and fever reducer'}
    ],
    'cold-flu': [
        {'id': 4, 'name': 'Throat Lozenges', 'price': 4.99, 'stock': 67, 'description': 'Soothing throat relief'},
        {'id': 5, 'name': 'Cough Syrup', 'price': 12.99, 'stock': 23, 'description': 'Cough suppressant'},
        {'id': 6, 'name': 'Decongestant Tablets', 'price': 9.99, 'stock': 41, 'description': 'Nasal congestion relief'}
    ],
    'first-aid': [
        {'id': 7, 'name': 'Adhesive Bandages', 'price': 3.99, 'stock': 89, 'description': 'Assorted sizes'},
        {'id': 8, 'name': 'Antibiotic Ointment', 'price': 5.99, 'stock': 34, 'description': 'Prevents infection'},
        {'id': 9, 'name': 'Instant Cold Pack', 'price': 2.99, 'stock': 56, 'description': 'For injuries and swelling'}
    ],
    'digestive': [
        {'id': 10, 'name': 'Antacid Tablets', 'price': 6.99, 'stock': 43, 'description': 'Heartburn relief'},
        {'id': 11, 'name': 'Anti-Diarrheal', 'price': 8.99, 'stock': 29, 'description': 'Digestive relief'}
    ],
    'allergy': [
        {'id': 12, 'name': 'Antihistamine 10mg', 'price': 11.99, 'stock': 37, 'description': 'Allergy symptom relief'},
        {'id': 13, 'name': 'Nasal Spray', 'price': 9.99, 'stock': 25, 'description': 'Allergy nasal relief'}
    ]
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/assessment')
def assessment():
    return render_template('assessment.html')

@app.route('/vitals')
def vitals():
    return render_template('vitals.html')

@app.route('/diagnosis')
def diagnosis():
    return render_template('diagnosis.html')

@app.route('/imaging')
def imaging():
    return render_template('imaging.html')

@app.route('/medication')
def medication():
    return render_template('medication.html')

@app.route('/profile')
def profile():
    user_data = users_data.get('john_doe', {})
    return render_template('profile.html', user=user_data)

# API Routes
@app.route('/api/submit_assessment', methods=['POST'])
def submit_assessment():
    data = request.json
    symptoms = data.get('symptoms', [])
    severity = data.get('severity', '')
    
    # Simulate AI analysis
    time.sleep(2)  # Simulate processing time
    
    response = {
        'success': True,
        'assessment': {
            'symptoms': symptoms,
            'severity': severity,
            'preliminary_diagnosis': 'Common cold or flu based on symptoms'
        }
    }
    return jsonify(response)

@app.route('/api/scan_vitals', methods=['POST'])
def scan_vitals():
    # Simulate vital signs scanning
    time.sleep(5)  # Simulate scanning time
    
    vitals = {
        'heart_rate': 72,
        'blood_pressure': '120/80',
        'temperature': 98.6,
        'oxygen_saturation': 98,
        'respiratory_rate': 16
    }
    
    return jsonify({'success': True, 'vitals': vitals})

@app.route('/api/ai_diagnosis', methods=['POST'])
def ai_diagnosis():
    # Simulate AI diagnosis
    time.sleep(4)  # Simulate AI processing
    
    diagnosis = {
        'condition': 'Common Cold',
        'confidence': 87,
        'recommendations': [
            'Rest and stay hydrated',
            'Take over-the-counter pain relievers',
            'Use throat lozenges for sore throat',
            'Consider decongestants if needed'
        ],
        'medications': [
            {'name': 'Acetaminophen 500mg', 'dosage': 'Every 6 hours as needed'},
            {'name': 'Throat Lozenges', 'dosage': 'As needed for throat pain'},
            {'name': 'Saline Nasal Spray', 'dosage': '2-3 times daily'}
        ],
        'follow_up': 'If symptoms worsen or persist beyond 7 days, consult a healthcare provider'
    }
    
    return jsonify({'success': True, 'diagnosis': diagnosis})

@app.route('/api/analyze_image', methods=['POST'])
def analyze_image():
    # Simulate image analysis
    time.sleep(3)  # Simulate processing time
    
    analysis = {
        'injury_type': 'Minor Abrasion',
        'severity': 'Mild',
        'recommendations': [
            'Clean the wound with saline solution',
            'Apply antibiotic ointment',
            'Cover with sterile bandage',
            'Keep the wound dry and clean'
        ],
        'supplies': ['Sterile saline solution', 'Antibiotic ointment', 'Adhesive bandages', 'Medical tape'],
        'urgency': 'Low - Can be treated at home'
    }
    
    return jsonify({'success': True, 'analysis': analysis})

@app.route('/api/medications/<category>')
def get_medications(category):
    meds = medications_data.get(category, [])
    return jsonify({'medications': meds})

@app.route('/api/dispense', methods=['POST'])
def dispense_medications():
    cart = request.json.get('cart', [])
    
    # Simulate dispensing process
    time.sleep(3)
    
    # Update stock (in production, update database)
    for item in cart:
        for category in medications_data:
            for med in medications_data[category]:
                if med['id'] == item['id']:
                    med['stock'] -= item['quantity']
    
    return jsonify({'success': True, 'message': 'Items dispensed successfully!'})

@app.route('/api/voice_command', methods=['POST'])
def voice_command():
    # Simulate voice recognition
    time.sleep(3)
    
    return jsonify({
        'success': True,
        'command': 'Start health assessment',
        'action': 'navigate_to_assessment'
    })
    
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # default to 5000 for local dev
    app.run(host="0.0.0.0", port=port, debug=True)
