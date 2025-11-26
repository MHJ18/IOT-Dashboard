import paho.mqtt.client as mqtt
import json

# MQTT Broker settings
BROKER = "127.0.0.1"
PORT = 1883
TOPIC = f"test/topic/+"
CLIENT_ID = "PythonSubscriber"

# Define callback when connected
def on_connect(client, userdata, flags, reason_code, properties=None):
    if reason_code == 0:
        print("Connected to MQTT Broker")
        # Subscribe to topic after connecting
        client.subscribe(TOPIC)
        print(f"Subscribed to topic: {TOPIC}")
    else:
        print(f"Failed to connect, reason code: {reason_code}")

# Define callback when message is received
def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        print(f"Received message on {msg.topic}: {payload}")
    except json.JSONDecodeError:
        print(f"Received non-JSON message: {msg.payload.decode()}")

# Create MQTT client
client = mqtt.Client(client_id=CLIENT_ID, callback_api_version=mqtt.CallbackAPIVersion.VERSION2)

# Assign callbacks
client.on_connect = on_connect
client.on_message = on_message

# Connect to the broker
client.connect(BROKER, PORT)

# Blocking loop — keeps listening for incoming messages
print("Listening for messages... Press Ctrl+C to stop.")
try:
    client.loop_forever()
except KeyboardInterrupt:
    print("\nStopped by user")

# Disconnect cleanly
client.disconnect()
print("Disconnected from broker")
