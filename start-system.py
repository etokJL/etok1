#!/usr/bin/env python3

import os
import subprocess
import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent


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

    print("🚀 Starting Booster System with automatic contract deployment...")
    print("⏱️  Timing: Hardhat(0s) → Contracts(5s) → Backend(10s) → Frontend(15s)")
    print()

    # Services with timing
    services = [
        {
            "title": "⛓️ Hardhat (8545)",
            "cwd": PROJECT_ROOT,
            "command": "npx hardhat node"
        },
        {
            "title": "📦 Contracts",
            "cwd": PROJECT_ROOT,
            "command": "sleep 5 && echo '🔄 Deploying contracts...' && npx hardhat run scripts/deploy.js --network localhost && echo '✅ Contracts deployed successfully!'"
        },
        {
            "title": "🛠️ Laravel (8282)",
            "cwd": PROJECT_ROOT / "backend",
            "command": "sleep 10 && echo '🔄 Starting Laravel backend...' && php artisan serve --host=127.0.0.1 --port=8282"
        },
        {
            "title": "🎮 Frontend (3000)",
            "cwd": PROJECT_ROOT / "frontend",
            "command": "sleep 15 && echo '🔄 Starting Next.js frontend...' && npm run dev"
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


