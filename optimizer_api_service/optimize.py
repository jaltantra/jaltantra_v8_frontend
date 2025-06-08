
import argparse
import requests
import pandas as pd
import json
import sys
import time
import re
from openpyxl import Workbook
from pathlib import Path

CONFIG_FILE = "optimizer_config.json"

def load_config():
    with open(CONFIG_FILE, "r") as f:
        return json.load(f)

def save_config(config):
    with open(CONFIG_FILE, "w") as f:
        json.dump(config, f, indent=2)

def get_token_or_login():
    config = load_config()
    token = config.get("token", "")
    if token:
        return token
    return login_and_update_token(config)

def login_and_update_token(config):
    username = config.get("username", "").strip()
    password = config.get("password", "").strip()
    if not username or not password:
        print("[Error] Username or password missing in config file.")
        sys.exit(1)
    response = requests.post("http://10.129.6.131:8091/jaltantra_loop_dev_v7/api/login",
                             json={"email": username, "password": password})
    if response.status_code == 200:
        token = response.json().get("token", "")
        config["token"] = token
        save_config(config)
        print("[Info] Token refreshed and saved.")
        return token
    else:
        print("[Error] Login failed:", response.text)
        sys.exit(1)

def write_output_excel(output_path: str, result_json: dict):
    wb = Workbook()
    wb.remove(wb.active)

    def add_sheet(sheetname, data):
        if not data:
            return
        ws = wb.create_sheet(title=sheetname)
        df = pd.DataFrame(data)
        ws.append(list(df.columns))
        for row in df.itertuples(index=False):
            ws.append(list(row))

    add_sheet("Nodes", result_json.get("resultnodes", []))
    add_sheet("Pipes", result_json.get("resultpipes", []))
    add_sheet("Cost", result_json.get("resultcost", []))
    add_sheet("ESR Cost", result_json.get("resultesrcost", []))
    add_sheet("Pump Cost", result_json.get("resultpumpcost", []))

    wb.save(output_path)

def parse_and_build_payload(excel_path: str) -> dict:
    workbook = pd.ExcelFile(excel_path)
    sheet = workbook.parse(workbook.sheet_names[0], header=None).fillna("")
    data = sheet.values.tolist()

    def find_row_start(keyword):
        for i, row in enumerate(data):
            if isinstance(row[0], str) and row[0].strip() == keyword:
                return i
        return -1

    def get_value_after_label(label):
        row_idx = find_row_start(label)
        if row_idx != -1:
            return data[row_idx][3]
        return None

    def collect_section(keyword, columns):
        rows = []
        start = find_row_start(keyword)
        if start == -1:
            return rows
        for r in range(start + 2, len(data)):
            row = data[r]
            if not row[0] and all(not c for c in row):
                break
            record = {}
            for i, col in enumerate(columns):
                record[col] = row[i] if i < len(row) else None
            record['recid'] = r - (start + 1)
            rows.append(record)
        return rows

    payload = {
        "cmd": "save-record",
        "recid": 0,
        "version": "2.3.0.0",
        "general": {
            "name_project": get_value_after_label("Network Name"),
            "min_node_pressure": float(get_value_after_label("Minimum Node Pressure") or 0),
            "def_pipe_roughness": float(get_value_after_label("Default Pipe Roughness 'C'") or 0),
            "max_hl_perkm": float(get_value_after_label("Maximum Headloss per KM") or 0),
            "max_water_speed": float(get_value_after_label("Maximum Water Speed") or 0),
            "max_pipe_pressure": float(get_value_after_label("Maximum Pipe Pressure") or 0),
            "supply_hours": float(get_value_after_label("Number of Supply Hours") or 24),
            "source_nodeid": int(get_value_after_label("Source Node ID") or 0),
            "source_nodename": get_value_after_label("Source Node Name") or "",
            "source_elevation": float(get_value_after_label("Source Elevation") or 0),
            "source_head": float(get_value_after_label("Source Head") or 0),
        },
        "nodes": collect_section("NODE DATA", ["nodeid", "nodename", "elevation", "demand", "minpressure"]),
        "pipes": collect_section("PIPE DATA", ["pipeid", "startnode", "endnode", "length", "diameter", "roughness", "parallelallowed"]),
        "commercialPipes": collect_section("COMMERCIAL PIPE DATA", ["diameter", "roughness", "cost"]),
        "esrCost": collect_section("ESR COST DATA", ["mincapacity", "maxcapacity", "basecost", "unitcost"]),
        "pumpManual": collect_section("MANUAL PUMPS DATA", ["pumppower", "pipeid"]),
        "valves": collect_section("VALVES DATA", ["pipeid", "valvesetting"])
    }

    esr_enabled = False
    if get_value_after_label("ESR Enabled") and int(get_value_after_label("ESR Enabled")) == 1:
        esr_enabled = True

    if esr_enabled:
        payload["esrGeneral"] = {
            "secondary_supply_hours": float(get_value_after_label("Secondary Supply Hours") or 0),
            "esr_capacity_factor": float(get_value_after_label("ESR Capacity Factor") or 0),
            "max_esr_height": float(get_value_after_label("Maximum ESR Height") or 0),
            "allow_dummy": int(get_value_after_label("Allow ESRs at zero demand nodes") or 0) == 1,
            "esr_enabled": True,
        }
    else:
        payload["esrGeneral"] = {
            "must_esr": [],
            "must_not_esr": []
        }

    pump_enabled = False
    if get_value_after_label("Pump Enabled") and int(get_value_after_label("Pump Enabled")) == 1:
        pump_enabled = True

    if pump_enabled:
        payload["pumpGeneral"] = {
            "minpumpsize": float(get_value_after_label("Minimum Pump Size") or 0),
            "efficiency": float(get_value_after_label("Pump Efficiency") or 0),
            "capitalcost_per_kw": float(get_value_after_label("Capital Cost per kW") or 0),
            "energycost_per_kwh": float(get_value_after_label("Energy Cost per kWh") or 0),
            "design_lifetime": float(get_value_after_label("Design Lifetime") or 0),
            "discount_rate": float(get_value_after_label("Discount Rate") or 0),
            "inflation_rate": float(get_value_after_label("Inflation Rate") or 0),
            "pump_enabled": True,
            "energycost_factor": 1
        }
    else:
        payload["pumpGeneral"] = {
            "must_not_pump": [],
            "energycost_factor": 1
        }

    return payload

def validate_payload(payload):
    if not payload["nodes"]:
        raise ValueError("NODE DATA is required.")
    for node in payload["nodes"]:
        if node["elevation"] in [None, "", 0]:
            raise ValueError(f"Elevation missing for node {node.get('nodeid')}")
    if not payload["pipes"]:
        raise ValueError("PIPE DATA is required.")
    if not payload["commercialPipes"]:
        raise ValueError("COMMERCIAL PIPE DATA is required.")
    return True

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', required=True)
    parser.add_argument('--type', choices=['branch', 'loop'], required=True)
    parser.add_argument('--time', choices=['1min', '5min', '1hour'])
    parser.add_argument('--output', help="Save output Excel")
    args = parser.parse_args()

    if args.type == 'loop' and not args.time:
        print("[Error] --time is required for loop optimizer")
        sys.exit(1)

    if not Path(CONFIG_FILE).exists():
        print(f"[Error] Config file '{CONFIG_FILE}' not found. Please create it and set username/password.")
        sys.exit(1)

    try:
        token = get_token_or_login()
        payload = parse_and_build_payload(args.file)
        validate_payload(payload)
        if args.type == 'loop':
            payload["time"] = args.time

        def make_request():
            headers = {"Authorization": f"Bearer {token}"}
            while True:
                url = f"http://10.129.6.131:8191/jaltantra_loop_dev_v7/{args.type}optimizer/optimize"
                resp = requests.post(url, json=payload, headers=headers)

                if resp.status_code == 200:
                    return resp.json()

                try:
                    msg = resp.json().get("data", "")
                except Exception:
                    print("[Error] Unexpected error:", resp.text)
                    sys.exit(1)

                if "Invalid or expired token" in msg:
                    print("[Info] Token expired. Attempting re-login...")
                    token_new = login_and_update_token(load_config())
                    headers["Authorization"] = f"Bearer {token_new}"
                    continue

                if "Please save the network file" in msg:
                    print("[Info] Retrying immediately: network save warning...")
                    continue
                elif "The solver is working" in msg:
                    print(f"[Info] Solver busy: {msg}")
                    m = re.search(r"after (\d+) minutes", msg)
                    minutes = int(m.group(1)) if m else 1
                    wait_sec = minutes * 60 + 30
                    print(f"[Wait] Retrying in {wait_sec} seconds...")
                    time.sleep(wait_sec)
                    continue
                else:
                    print("[Error]", msg)
                    sys.exit(1)

        result = make_request()
        if args.output:
            write_output_excel(args.output, result)
            print(f"[Saved] Output Excel written to {args.output}")
        else:
            print("[Success] Response:")
            print(json.dumps(result, indent=2))

    except Exception as e:
        print(f"[Error] {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
