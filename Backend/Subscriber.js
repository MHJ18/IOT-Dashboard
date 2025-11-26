const mqtt = require("mqtt");
const WebSocket = require("ws");

// WebSocket server
const wss = new WebSocket.Server({ port: 8080 });
console.log("WS server running on ws://localhost:8080");

// MQTT broker
const BROKER_URL = "https://192.168.1.100:1883";
const client = mqtt.connect(BROKER_URL, {
  connectTimeout: 3000,
  reconnectPeriod: 2000,
});

// Data arrays per client ID
let clientData = {}; // { clientId: { temperatures: [], timestamps: [] } }

// Buffer for WebSocket sending
let sendInterval = null;

// MQTT events
client.on("connect", () => {
  console.log("🟢 MQTT Subscriber Connected");

  client.subscribe(["sensors/temperature/+", "demo/temperature"], (err) => {
    if (err) {
      console.error("Subscription error:", err.message);
    } else {
      console.log("Subscribed to topics.");
    }
  });

  // Start sending data to WebSocket every 1 second
  setInterval(() => {
    if (Object.keys(clientData).length > 0) {
      const wsPayload = {
        topic: "aggregated",
        data: {},
        clientData,
      };

      wss.clients.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(wsPayload));
        }
      });
    }
  }, 2000);
});

client.on("error", () => {
  console.log("❌ MQTT ERROR: cannot connect");
});

client.on("offline", () => {
  console.log("⚠ MQTT offline");
});

client.on("reconnect", () => {
  console.log("MQTT reconnecting...");
});

// Handling real MQTT messages
client.on("message", (topic, message) => {
  let data;
  try {
    data = JSON.parse(message.toString());
  } catch (err) {
    console.error("JSON parse error:", err.message);
    return;
  }

  console.log("RECEIVED MQTT:", topic, data);

  // Extract client ID from topic
  const topicParts = topic.split("/");
  const clientId = topicParts[topicParts.length - 1] || "unknown";

  if (!clientData[clientId]) {
    clientData[clientId] = { temperatures: [], timestamps: [] };
  }

  if (data.temperature !== undefined) {
    clientData[clientId].temperatures.push(data.temperature);
    clientData[clientId].timestamps.push(data.timestamp);

    if (clientData[clientId].temperatures.length > 30) {
      clientData[clientId].temperatures.shift();
      clientData[clientId].timestamps.shift();
    }
  }

  // No longer sending individual messages, only aggregated every 1 second
});
