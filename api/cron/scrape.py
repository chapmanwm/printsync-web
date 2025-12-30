from http.server import BaseHTTPRequestHandler
import os
import json
from curl_cffi import requests

# Environment variables
MAKERWORLD_TOKEN = os.getenv('MAKERWORLD_TOKEN')
API_SECRET = os.getenv('API_SECRET')
CRON_SECRET = os.getenv('CRON_SECRET')

STATUS_MAP = {"1": "Printing", "2": "Success", "3": "Canceled", "4": "Printing"}

def fix_iso(ts):
    return ts.replace('Z', '') if ts else None

def build_print_data(entry):
    filaments = []
    for i in range(4):
        f = entry.get('amsDetailMapping', [{}])[i] if i < len(entry.get('amsDetailMapping', [])) else {}
        filaments.append({
            'material': f.get('filamentType'),
            'colour': f.get('targetColor'),
            'weight': f.get('weight')
        })
    
    return {
        'id': str(entry['id']),
        'title': entry.get('title', ''),
        'cover': entry.get('cover'),
        'status': STATUS_MAP.get(str(entry.get('status')), str(entry.get('status'))),
        'start_time': fix_iso(entry.get('startTime')),
        'end_time': fix_iso(entry.get('endTime')),
        'total_weight': entry.get('weight'),
        'filament_1_material': filaments[0]['material'],
        'filament_1_colour': filaments[0]['colour'],
        'filament_1_weight': filaments[0]['weight'],
        'filament_2_material': filaments[1]['material'],
        'filament_2_colour': filaments[1]['colour'],
        'filament_2_weight': filaments[1]['weight'],
        'filament_3_material': filaments[2]['material'],
        'filament_3_colour': filaments[2]['colour'],
        'filament_3_weight': filaments[2]['weight'],
        'filament_4_material': filaments[3]['material'],
        'filament_4_colour': filaments[3]['colour'],
        'filament_4_weight': filaments[3]['weight'],
    }

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Verify cron secret
        auth = self.headers.get('Authorization', '')
        if auth != f'Bearer {CRON_SECRET}':
            self.send_response(401)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Unauthorized'}).encode())
            return
        
        try:
            # Fetch from MakerWorld using curl_cffi
            url = 'https://makerworld.com/api/v1/user-service/my/tasks?limit=100'
            response = requests.get(
                url,
                cookies={'token': MAKERWORLD_TOKEN},
                headers={
                    'Referer': 'https://makerworld.com/en/studio/print-history',
                    'Content-Type': 'application/json',
                    'x-bbl-app-source': 'makerworld',
                    'x-bbl-client-name': 'MakerWorld',
                    'x-bbl-client-type': 'web',
                    'x-bbl-client-version': '00.00.00.01',
                },
                impersonate="chrome120",
                timeout=30
            )
            
            data = response.json()
            prints = [build_print_data(e) for e in data.get('hits', [])]
            
            # Send to our own API
            api_response = requests.post(
                'https://printsync-web.vercel.app/api/prints',
                json=prints,
                headers={
                    'Content-Type': 'application/json',
                    'x-api-key': API_SECRET,
                },
                timeout=30
            )
            
            result = api_response.json()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': True,
                'synced': result.get('count', len(prints))
            }).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
