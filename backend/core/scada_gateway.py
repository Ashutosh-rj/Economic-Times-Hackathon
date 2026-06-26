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
        Returns Modbus TCP 16-bit integer register map and OPC-UA data block.
        """
        # Register scaling: 100x multiplier for precision integer representation
        h2s_reg = 2840 if mode == "INCIDENT" else 1420 if mode == "PRE_INCIDENT" else 150
        co_reg = 9500 if mode == "INCIDENT" else 4800 if mode == "PRE_INCIDENT" else 850
        press_reg = 1845 # 18.45 PSI
        temp_reg = 4420  # 44.20 C
        interlock_coil = 0 if mode == "INCIDENT" else 1 # 1 is energized (Nominal), 0 is tripped

        return {
            "protocol_meta": {
                "scada_driver": "Modbus TCP / OPC-UA Universal Gateway v2.4",
                "slave_id": 1,
                "ip_address": "192.168.10.45:502",
                "poll_timestamp_ms": int(time.time() * 1000)
            },
            "modbus_tcp_holding_registers": [
                {"register": 40001, "tag_name": "FIT_COB1_H2S_PPM", "raw_int": h2s_reg, "scaled_val": h2s_reg / 100.0, "unit": "PPM"},
                {"register": 40002, "tag_name": "FIT_COB1_CO_PPM", "raw_int": co_reg, "scaled_val": co_reg / 100.0, "unit": "PPM"},
                {"register": 40003, "tag_name": "PIT_HEADER_PRESS", "raw_int": press_reg, "scaled_val": press_reg / 100.0, "unit": "PSI"},
                {"register": 40004, "tag_name": "TIT_HEADER_TEMP", "raw_int": temp_reg, "scaled_val": temp_reg / 100.0, "unit": "DEG_C"},
                {"register": 40005, "tag_name": "ZS_BLOWER_STATUS", "raw_int": interlock_coil, "scaled_val": float(interlock_coil), "unit": "BOOL_COIL"}
            ],
            "opc_ua_nodes": {
                "ns=2;s=RINL.Vizag.COB1.GasPressure": press_reg / 100.0,
                "ns=2;s=RINL.Vizag.COB1.ForcedDraftBlower": bool(interlock_coil == 1),
                "ns=2;s=RINL.Vizag.COB1.SafetyInterlockTripped": bool(interlock_coil == 0)
            },
            "historian_link": "Ignition SCADA / OSIsoft PI Historian SQL Server Connector Active"
        }

if __name__ == "__main__":
    gw = VirtualModbusSCADAGateway()
    print(gw.read_holding_registers("PRE_INCIDENT"))
