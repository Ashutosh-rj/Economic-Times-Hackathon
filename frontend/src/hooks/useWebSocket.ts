import { useEffect, useRef } from 'react';
import { useSensorStore } from '../store/sensorStore';
import { useAlertStore } from '../store/alertStore';

export const useWebSocket = () => {
  const wsSensorRef = useRef<WebSocket | null>(null);
  const wsAlertRef = useRef<WebSocket | null>(null);
  const updateFromStream = useSensorStore((state) => state.updateFromStream);
  const setIsConnected = useSensorStore((state) => state.setIsConnected);
  const addAlert = useAlertStore((state) => state.addAlert);

  useEffect(() => {
    let reconnectTimeout: any;

    const connectSensor = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname || 'localhost';
        const port = '8000';
        const url = `${protocol}//${host}:${port}/ws/sensors`;

        wsSensorRef.current = new WebSocket(url);

        wsSensorRef.current.onopen = () => {
          setIsConnected(true);
        };

        wsSensorRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            updateFromStream(data);
          } catch (err) {
            console.error("WS Sensor parse error:", err);
          }
        };

        wsSensorRef.current.onclose = () => {
          setIsConnected(false);
          reconnectTimeout = setTimeout(connectSensor, 3000);
        };

        wsSensorRef.current.onerror = () => {
          wsSensorRef.current?.close();
        };
      } catch (e) {
        reconnectTimeout = setTimeout(connectSensor, 3000);
      }
    };

    const connectAlert = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname || 'localhost';
        const port = '8000';
        const url = `${protocol}//${host}:${port}/ws/alerts`;

        wsAlertRef.current = new WebSocket(url);

        wsAlertRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && data.rule_id) {
              addAlert({
                id: Date.now(),
                rule_id: data.rule_id,
                zone_id: data.zone_id || 'COKE_OVEN_BATTERY_1',
                severity: data.severity || 'HIGH',
                risk_score: data.risk_score || 0.75,
                triggered_conditions: data.triggered_conditions || [],
                ai_narrative: data.ai_narrative || '',
                recommended_actions: data.recommended_actions || [],
                acknowledged: false,
                created_at: new Date().toISOString()
              });
            }
          } catch (err) {}
        };

        wsAlertRef.current.onclose = () => {
          setTimeout(connectAlert, 5000);
        };
      } catch (e) {}
    };

    connectSensor();
    connectAlert();

    return () => {
      clearTimeout(reconnectTimeout);
      wsSensorRef.current?.close();
      wsAlertRef.current?.close();
    };
  }, [updateFromStream, setIsConnected, addAlert]);
};
