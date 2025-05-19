import requests
import smtplib
from email.mime.text import MIMEText
from datetime import datetime

# === CONFIGURE HERE ===
EMAIL_FROM = "coderbloodedbong@gmail.com"
EMAIL_TO = "23m0806@iitb.ac.in"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "coderbloodedbong@gmail.com"
SMTP_PASSWORD = "wcit cblx mngx guzq"  # For Gmail, use an App Password!

SERVICES = {
    "Frontend": {
        "url": "http://10.129.6.131:5173/",
        "checker": lambda resp: "<title>Jaltantra</title>" in resp.text,
        "desc": "React app title"
    },
    "Backend API": {
        "url": "http://jaltantra.cse.iitb.ac.in:8091/jaltantra_loop_dev_v7/actuator/health",
        "checker": lambda resp: resp.status_code == 200 and resp.json().get("status") == "UP",
        "desc": "Spring Boot /actuator/health"
    },
    "Optimizer API": {
        "url": "http://jaltantra.cse.iitb.ac.in:8191/jaltantra_loop_dev_v7/actuator/health",
        "checker": lambda resp: resp.status_code == 200 and resp.json().get("status") == "UP",
        "desc": "Spring Boot /actuator/health"
    }
}

def send_email(subject, body):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = EMAIL_FROM
    msg['To'] = EMAIL_TO

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(EMAIL_FROM, EMAIL_TO, msg.as_string())

def check_branch_optimizer():
    url = "http://10.129.6.131:8191/jaltantra_loop_dev_v7/branchoptimizer/optimize"
    token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMUBnby5jb20iLCJleHAiOjE3NDc0OTQwMjIsImlhdCI6MTc0NzQ1ODAyMn0.YE1ZCjdLaEmTCIPk4b4yVh6PyHoMVzymTH8s1khQ7MQ"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    body = {
        "general": {
            "name_project": "Sample",
            "min_node_pressure": 7,
            "def_pipe_roughness": 140,
            "max_hl_perkm": 10,
            "max_water_speed": 1.5,
            "supply_hours": 12,
            "source_nodeid": 8,
            "source_nodename": "Node8",
            "source_elevation": 505,
            "source_head": 530
        },
        "nodes": [
            {
            "recid": 1,
            "nodeid": 1,
            "nodename": "Node1",
            "elevation": 442,
            "demand": 2.1
            },
            {
            "recid": 2,
            "nodeid": 2,
            "nodename": "Node2",
            "elevation": 477,
            "demand": 0.8
            },
            {
            "recid": 3,
            "nodeid": 3,
            "nodename": "Node3",
            "elevation": 496,
            "demand": 3.4
            },
            {
            "recid": 4,
            "nodeid": 4,
            "nodename": "Node4",
            "elevation": 464,
            "demand": 1.75
            },
            {
            "recid": 5,
            "nodeid": 7,
            "nodename": "Node7",
            "elevation": 493,
            "demand": 2.6
            },
            {
            "recid": 6,
            "nodeid": 6,
            "nodename": "Node6",
            "elevation": 390,
            "demand": 1.8
            },
            {
            "recid": 7,
            "nodeid": 9,
            "nodename": "Node9",
            "elevation": 517
            },
            {
            "recid": 8,
            "nodeid": 10,
            "nodename": "Node10",
            "elevation": 509
            },
            {
            "recid": 9,
            "nodeid": 11,
            "nodename": "Node11",
            "elevation": 472
            }
        ],
        "pipes": [
            {
            "recid": 1,
            "pipeid": 2,
            "diameter": 110,
            "length": 7345,
            "startnode": 3,
            "endnode": 7,
            "parallelallowed": True
            },
            {
            "recid": 2,
            "pipeid": 3,
            "length": 3491,
            "startnode": 2,
            "endnode": 6
            },
            {
            "recid": 3,
            "pipeid": 4,
            "length": 2442,
            "startnode": 2,
            "endnode": 4
            },
            {
            "recid": 4,
            "pipeid": 5,
            "length": 1943,
            "startnode": 9,
            "endnode": 3
            },
            {
            "recid": 5,
            "pipeid": 6,
            "length": 2686,
            "startnode": 8,
            "endnode": 9
            },
            {
            "recid": 6,
            "pipeid": 7,
            "length": 4808,
            "startnode": 10,
            "endnode": 2
            },
            {
            "recid": 7,
            "pipeid": 8,
            "length": 924,
            "startnode": 3,
            "endnode": 10
            },
            {
            "recid": 8,
            "pipeid": 9,
            "length": 4266,
            "startnode": 11,
            "endnode": 1
            },
            {
            "recid": 9,
            "pipeid": 10,
            "length": 485,
            "startnode": 4,
            "endnode": 11
            }
        ],
        "commercialPipes": [
            {
            "recid": 1,
            "diameter": 63,
            "cost": 116
            },
            {
            "recid": 2,
            "diameter": 75,
            "cost": 172
            },
            {
            "recid": 3,
            "diameter": 90,
            "cost": 231
            },
            {
            "recid": 4,
            "diameter": 110,
            "cost": 340
            },
            {
            "recid": 5,
            "diameter": 125,
            "cost": 461
            },
            {
            "recid": 6,
            "diameter": 140,
            "cost": 576
            },
            {
            "recid": 7,
            "diameter": 160,
            "cost": 750
            },
            {
            "recid": 8,
            "diameter": 180,
            "cost": 945
            },
            {
            "recid": 9,
            "diameter": 200,
            "cost": 1113
            },
            {
            "recid": 10,
            "diameter": 225,
            "cost": 1430
            },
            {
            "recid": 11,
            "diameter": 250,
            "cost": 1762
            },
            {
            "recid": 12,
            "diameter": 280,
            "cost": 2210
            },
            {
            "recid": 13,
            "diameter": 315,
            "cost": 2794
            }
        ],
        "esrGeneral": {
            "secondary_supply_hours": 6,
            "esr_capacity_factor": 0.5,
            "max_esr_height": 25,
            "allow_dummy": True,
            "must_not_esr": [4, 7],
            "esr_enabled": True
        },
        "esrCost": [
            {
            "recid": 1,
            "maxcapacity": 25000,
            "unitcost": 24.47
            },
            {
            "recid": 2,
            "mincapacity": 25000,
            "maxcapacity": 50000,
            "basecost": 611750,
            "unitcost": 12.96
            },
            {
            "recid": 3,
            "mincapacity": 50000,
            "maxcapacity": 75000,
            "basecost": 935750,
            "unitcost": 9.64
            },
            {
            "recid": 4,
            "mincapacity": 75000,
            "maxcapacity": 100000,
            "basecost": 1176750,
            "unitcost": 8.64
            },
            {
            "recid": 5,
            "mincapacity": 100000,
            "maxcapacity": 150000,
            "basecost": 1392750,
            "unitcost": 7.23
            },
            {
            "recid": 6,
            "mincapacity": 150000,
            "maxcapacity": 200000,
            "basecost": 1754250,
            "unitcost": 6.03
            },
            {
            "recid": 7,
            "mincapacity": 200000,
            "maxcapacity": 300000,
            "basecost": 2055750,
            "unitcost": 5.4
            },
            {
            "recid": 8,
            "mincapacity": 300000,
            "maxcapacity": 400000,
            "basecost": 2595750,
            "unitcost": 5.12
            },
            {
            "recid": 9,
            "mincapacity": 400000,
            "maxcapacity": 1500000,
            "basecost": 3107750,
            "unitcost": 4.32
            },
            {
            "recid": 10,
            "mincapacity": 1500000,
            "maxcapacity": 2000000,
            "basecost": 7859750,
            "unitcost": 3.92
            }
        ],
        "pumpGeneral": {
            "minpumpsize": 1,
            "efficiency": 70,
            "capitalcost_per_kw": 30000,
            "energycost_per_kwh": 6.5,
            "design_lifetime": 15,
            "discount_rate": 7,
            "inflation_rate": 5,
            "must_not_pump": [10],
            "pump_enabled": True,
            "energycost_factor": 1
        },
        "pumpManual": [],
        "valves": [
            {
            "recid": 1,
            "pipeid": 3,
            "valvesetting": 40
            }
        ],
        "version": "2.3.0.0"
    }
    import json
    try:
        resp = requests.post(url, headers=headers, json=body, timeout=20)
        if resp.status_code == 200:
            try:
                data = resp.json()
                if data.get("status") == "success" and data.get("data") == "Done!":
                    msg = "OK"
                else:
                    msg = f"UNEXPECTED RESPONSE: {data}"
            except Exception as e:
                msg = f"NOT JSON RESPONSE: {e} Body: {resp.text[:100]}"
        else:
            msg = f"HTTP {resp.status_code}: {resp.text[:100]}"
    except Exception as e:
        msg = f"ERROR - {e}"
    return f"{'Branch Optimizer':<14}: {msg}"


def check_service(name, meta):
    url = meta['url']
    try:
        if url.endswith('/actuator/health'):
            resp = requests.get(url, timeout=5)
            json = resp.json()
            status = "UP" if meta['checker'](resp) else "DOWN"
            details = []
            if "db" in json.get("components", {}):
                details.append("DB: " + json["components"]["db"]["status"])
            if "customDbHealthIndicator" in json.get("components", {}):
                details.append("CustomDB:" + json["components"]["customDbHealthIndicator"]["status"])
            if "solver" in json.get("components", {}):
                details.append("Solver: " + json["components"]["solver"]["details"]["solver"])
            msg = f"{status} | {' | '.join(details)}"
        else:
            resp = requests.get(url, timeout=5)
            msg = "OK" if meta['checker'](resp) else "Wrong Content"
        return f"{name:<14}: {msg}"
    except Exception as e:
        return f"{name:<14}: ERROR - {e}"

def main():
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    results = []
    problems = []
    for name, meta in SERVICES.items():
        result = check_service(name, meta)
        results.append(result)
        if ("ERROR" in result) or ("DOWN" in result) or ("Wrong" in result):
            problems.append(result)
        # After checking other services
    branch_result = check_branch_optimizer()
    results.append(branch_result)
    if ("ERROR" in branch_result) or ("UNEXPECTED" in branch_result) or ("NOT JSON" in branch_result) or ("HTTP" in branch_result and "200" not in branch_result):
        problems.append(branch_result)

    status_report = f"===== Microservices Health Check ({timestamp}) =====\n" + "\n".join(results)
    print(status_report)
    if problems:
        subject = f"[ALERT] Jaltantra Microservice Issue Detected ({timestamp})"
        body = status_report
        send_email(subject, body)
        print("\nNotification email sent!\n")
    else:
        print("\nAll services are healthy. No email sent.\n")

if __name__ == "__main__":
    main()
