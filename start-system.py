#!/usr/bin/env python3

import os
import subprocess
import sys
from pathlib import Path
from dotenv import load_dotenv


PROJECT_ROOT = Path(__file__).resolve().parent

# Load environment variables from .env file
load_dotenv(PROJECT_ROOT / '.env')


def open_in_mac_terminal(title: str, command: str, working_dir: Path):
    # Use AppleScript to open a new Terminal window and run the command
    # Keep the window open after the command by starting an interactive shell
    script = f'''
tell application "Terminal"
    activate
    set newTab to do script "cd {working_dir} && echo '▶ {title}' && {command}"
    set custom title of front window to "{title}"
end tell
'''
    subprocess.run(["osascript", "-e", script], check=False)


def main():
    # Ensure we are in project root
    if not (PROJECT_ROOT / "monitor.js").exists():
        print("❌ Please run this script from the booster project root directory")
        sys.exit(1)

    # Get configuration from environment variables
    hardhat_port = os.getenv('HARDHAT_PORT', '8545')
    backend_port = os.getenv('BACKEND_PORT', '8282')
    frontend_port = os.getenv('FRONTEND_PORT', '3000')
    backend_host = os.getenv('BACKEND_HOST', '127.0.0.1')
    
    print("🚀 Starting Booster System with automatic contract deployment...")
    print(f"⏱️  Timing: Hardhat({hardhat_port}) → Contracts(5s) → Backend({backend_port}) → Frontend({frontend_port})")
    print()

    # Services with timing from environment variables
    services = [
        {
            "title": f"⛓️ Hardhat ({hardhat_port})",
            "cwd": PROJECT_ROOT,
            "command": f"npx hardhat node --hostname {os.getenv('HARDHAT_HOST', '127.0.0.1')} --port {hardhat_port}"
        },
        {
            "title": "📦 Contracts",
            "cwd": PROJECT_ROOT,
            "command": "sleep 5 && echo '🔄 Deploying contracts...' && npx hardhat run scripts/deploy.js --network localhost && echo '✅ Contracts deployed successfully!'"
        },
        {
            "title": f"🛠️ Laravel ({backend_port})",
            "cwd": PROJECT_ROOT / "backend",
            "command": f"sleep 10 && echo '🔄 Starting Laravel backend...' && php artisan serve --host={backend_host} --port={backend_port}"
        },
        {
            "title": f"🎮 Frontend ({frontend_port})",
            "cwd": PROJECT_ROOT / "frontend",
            "command": f"sleep 15 && echo '🔄 Starting Next.js frontend...' && npm run dev -- --port {frontend_port}"
        }
    ]

    # Launch each service in its own Terminal window
    for svc in services:
        open_in_mac_terminal(svc["title"], svc["command"], svc["cwd"])

    # Start central monitor in monitor-only mode in current terminal
    env = os.environ.copy()
    env["MONITOR_ONLY"] = "1"
    print("\n📋 Starting central monitor in monitor-only mode...\n")
    subprocess.call(["node", "monitor.js", "--monitor-only"], cwd=str(PROJECT_ROOT), env=env)


if __name__ == "__main__":
    main()


