import paho.mqtt.client as mqtt
import time
import datetime
import json

group_id = 13

# MQTT Broker settings
BROKER = "192.168.1.100"
PORT = 1883
TOPIC = f"sensors/temperature/{group_id}"
CLIENT_ID = "PythonSubscriber"

# Create client 
client = mqtt.Client(client_id=CLIENT_ID, callback_api_version=mqtt.CallbackAPIVersion.VERSION2)

# Define callback for connection
def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        print("Connected to MQTT Broker")
    else:
        print(f"Failed to connect, reason code {reason_code}")

# Assign callback
client.on_connect = on_connect

# Connect to the broker
client.connect(BROKER, PORT, keepalive=60)

# Start the network loop
client.loop_start()

# Publish some messages
try:
    while(1):
        # Current time as datetime
        now = datetime.datetime.now()
        date_str = now.strftime("%Y-%m-%d")
        time_str = now.strftime("%H:%M:%S.%f")[:-3]  # up to milliseconds

        payload = {
            "group_id": group_id,
            "message": "Hello!",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        client.publish(TOPIC, json.dumps(payload))
        
        print("Message sent")

        time.sleep(5)
except KeyboardInterrupt:
    print("\n Stopped by user")

# Stop and disconnect
client.loop_stop()
client.disconnect()
print("Disconnected from broker")
