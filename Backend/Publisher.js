// const mqtt = require("mqtt");

// const BROKER_URL = "http://192.168.1.100:1883";
// const client = mqtt.connect(BROKER_URL);

// const group_id = 10;
// const PY_TOPIC = `sensors/temperature/${group_id}`;
// const DEMO_TOPIC = "demo/temperature";

// client.on("connect", () => {
//   console.log("MQTT Publisher Connected");

//   // Python-style publisher (every 5 seconds)
//   setInterval(() => {
//     const payloadPy = {
//       group_id,
//       message: Number(20 + (Math.random() * 5).toFixed(2)),
//       timestamp: new Date().toISOString(),
//     };

//     client.publish(PY_TOPIC, JSON.stringify(payloadPy));
//     console.log("PUBLISHED (PY):", payloadPy);
//   }, 5000);
// });

// client.on("error", (err) => {
//   console.error("Publisher MQTT ERROR:", err.message);
// });

// client.on("reconnect", () => {
//   console.log("Publisher MQTT: Reconnecting...");
// });

// client.on("offline", () => {
//   console.warn("Publisher MQTT: Offline");
// });
