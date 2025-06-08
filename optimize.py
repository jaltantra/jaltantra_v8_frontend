import argparse
import requests
import pandas as pd
import sys

# --- Constants ---
BRANCH_ENDPOINT = "http://10.129.6.131:8191/branchoptimizer/optimize"
LOOP_ENDPOINT = "http://10.129.6.131:8091/loopoptimizer/optimize"

def validate_network_data(df):
    # Add validation logic similar to Optbar.jsx
    required_cols = ['Node ID', 'Link ID', 'Length', 'Diameter', 'Roughness']  # Example
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")
    return True

def parse_excel_file(path):
    try:
        df = pd.read_excel(path)
        validate_network_data(df)
        return df.to_dict(orient='records')
    except Exception as e:
        print(f"[Error] Failed to parse or validate Excel file: {e}")
        sys.exit(1)

def call_optimizer(token, data, optimizer, time=None):
    headers = {"Authorization": f"Bearer {token}"}
    endpoint = BRANCH_ENDPOINT if optimizer == "branch" else f"{LOOP_ENDPOINT}?time={time}"
    try:
        response = requests.post(endpoint, json=data, headers=headers)
        response.raise_for_status()
        print("[Response]", response.json())
    except requests.RequestException as e:
        print(f"[Error] Request failed: {e}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--token', required=True, help="JWT token")
    parser.add_argument('--file', required=True, help="Path to Excel network file")
    parser.add_argument('--type', choices=['branch', 'loop'], required=True, help="Optimizer type")
    parser.add_argument('--time', choices=['1min', '5min', '1hour'], help="Loop optimizer time (required if type=loop)")
    args = parser.parse_args()

    if args.type == 'loop' and not args.time:
        print("[Error] --time must be provided for loop optimizer")
        sys.exit(1)

    network_data = parse_excel_file(args.file)
    call_optimizer(args.token, network_data, args.type, args.time)

if __name__ == "__main__":
    main()
