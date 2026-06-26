import time
from typing import Dict, Any, List

class VirtualModbusSCADAGateway:
    """
    Genuine Industrial SCADA Gateway Protocol Adapter.
    Simulates Modbus TCP Holding Registers (40001 - 40016) and OPC-UA Namespace Nodes
    bridging field instrumentation to SENTINEL AI supervisory logic.
    """
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = VirtualModbusSCADAGateway()
        return cls._instance

    def read_holding_registers(self, mode: str = "NORMAL") -> Dict[str, Any]:
        """
        Returns Modbus TCP 16-bit integer register map and OPC-UA data block
        synchronized dynamically with active empirical SCADA stream.
        """
        try:
            from core.sensor_simulator import sensor_simulator
            snapshot = sensor_simulator.latest_snapshot
            h2s_val = snapshot.get("GAS_H2S_01", {}).get("value", 1.5)
            co_val = snapshot.get("GAS_CO_01", {}).get("value", 8.5)
            press_val = snapshot.get("PRESS_01", {}).get("value", 1012.0)
            temp_val = snapshot.get("TEMP_01", {}).get("value", 45.2)
        except Exception:
            h2s_val = 28.4 if mode == "INCIDENT" else 14.2 if mode == "PRE_INCIDENT" else 1.5
            co_val = 95.0 if mode == "INCIDENT" else 48.0 if mode == "PRE_INCIDENT" else 8.5
            press_val = 18.45
            temp_val = 44.20

        # Register scaling: 100x multiplier for precision integer representation
        h2s_reg = int(h2s_val * 100)
        co_reg = int(co_val * 100)
        press_reg = int(press_val * 10)
        temp_reg = int(temp_val * 100)
        interlock_coil = 0 if mode == "INCIDENT" else 1 # 1 is energized (Nominal), 0 is tripped

        return {
            "protocol_meta": {
                "scada_driver": "Modbus TCP / OPC-UA Replay Simulator v2.4",
                "slave_id": 1,
                "connection_status": "LOCAL_SIMULATED_TESTBED (No Live Industrial PLC/SCADA Hardware Attached)",
                "data_provenance": "Generated via stateful software replay simulator",
                "poll_timestamp_ms": int(time.time() * 1000)
            },
            "modbus_tcp_holding_registers": [
                {"register": 40001, "tag_name": "FIT_COB1_H2S_PPM", "raw_int": h2s_reg, "scaled_val": h2s_reg / 100.0, "unit": "PPM"},
                {"register": 40002, "tag_name": "FIT_COB1_CO_PPM", "raw_int": co_reg, "scaled_val": co_reg / 100.0, "unit": "PPM"},
                {"register": 40003, "tag_name": "PIT_HEADER_PRESS", "raw_int": press_reg, "scaled_val": press_reg / 10.0, "unit": "MBAR"},
                {"register": 40004, "tag_name": "TIT_HEADER_TEMP", "raw_int": temp_reg, "scaled_val": temp_reg / 100.0, "unit": "DEG_C"},
                {"register": 40005, "tag_name": "ZS_BLOWER_STATUS", "raw_int": interlock_coil, "scaled_val": float(interlock_coil), "unit": "BOOL_COIL"}
            ],
            "opc_ua_nodes": {
                "ns=2;s=RINL.Vizag.COB1.GasPressure": press_reg / 10.0,
                "ns=2;s=RINL.Vizag.COB1.ForcedDraftBlower": bool(interlock_coil == 1),
                "ns=2;s=RINL.Vizag.COB1.SafetyInterlockTripped": bool(interlock_coil == 0)
            },
            "historian_link": "LOCAL_SQLITE_REPLAY (No Live OSIsoft PI Server Attached)"
        }

if __name__ == "__main__":
    gw = VirtualModbusSCADAGateway()
    print(gw.read_holding_registers("PRE_INCIDENT"))
