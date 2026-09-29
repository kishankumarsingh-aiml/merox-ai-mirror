"""
MeroX Phase 13 — Comprehensive Security, Privacy, and Vulnerability Auditor
"""

import os
import re
import json

PROJECT_DIR = r"c:\merox-ai-mirror"
os.chdir(PROJECT_DIR)

report = {
    "secrets": [],
    "xss_risks": [],
    "unsafe_eval": [],
    "sensitive_logs": [],
    "storage_keys": set(),
    "camera_cleanup_issues": [],
    "localhost_references": [],
    "open_redirects": [],
    "files_scanned": []
}

files_to_scan = [f for f in os.listdir(".") if f.endswith((".js", ".html", ".css", ".json")) and not f.startswith("test_") and not f.startswith("master_")]

secret_patterns = [
    (r"AIzaSy[0-9A-Za-z_-]{33}", "Exposed Google/Firebase API Key"),
    (r"ghp_[0-9a-zA-Z]{36}", "GitHub Personal Access Token"),
    (r"sk-[a-zA-Z0-9]{48}", "OpenAI API Key"),
    (r"-----BEGIN PRIVATE KEY-----", "Private Key Block"),
    (r"password\s*[:=]\s*['\"][^'\"]{6,}['\"]", "Hardcoded Password")
]

xss_patterns = [
    r"\.innerHTML\s*=\s*[^;\n]*\$\{",
    r"\.innerHTML\s*=\s*[^;\n]*\+",
    r"document\.write\s*\(",
    r"javascript:\s*"
]

for filename in files_to_scan:
    report["files_scanned"].append(filename)
    try:
        with open(filename, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            lines = content.splitlines()

            # 1. Secrets
            for pat, desc in secret_patterns:
                matches = re.finditer(pat, content)
                for m in matches:
                    # Obfuscate matched string
                    val = m.group(0)
                    obfuscated = val[:6] + "..." + val[-4:] if len(val) > 10 else "***"
                    report["secrets"].append({
                        "file": filename,
                        "type": desc,
                        "value": obfuscated
                    })

            # 2. XSS patterns
            for i, line in enumerate(lines, 1):
                for pat in xss_patterns:
                    if re.search(pat, line):
                        # Filter out known safe static assignments or helper methods
                        if "escapeHtml" not in line and "safeHtml" not in line and "encodeURIComponent" not in line:
                            report["xss_risks"].append({
                                "file": filename,
                                "line": i,
                                "snippet": line.strip()[:100]
                            })

            # 3. eval
            if re.search(r"\beval\s*\(", content):
                report["unsafe_eval"].append(filename)

            # 4. Sensitive logs
            for i, line in enumerate(lines, 1):
                if re.search(r"console\.log\(.*(?:password|credential|token|secret).*\)", line, re.I):
                    report["sensitive_logs"].append({
                        "file": filename,
                        "line": i,
                        "snippet": line.strip()[:100]
                    })

            # 5. Storage keys
            st_matches = re.findall(r"localStorage\.(?:getItem|setItem|removeItem)\s*\(\s*['\"]([^'\"]+)['\"]", content)
            for k in st_matches:
                report["storage_keys"].add(k)

            # 6. Localhost references
            for i, line in enumerate(lines, 1):
                if re.search(r"localhost|127\.0\.0\.1|5500", line):
                    report["localhost_references"].append({
                        "file": filename,
                        "line": i,
                        "snippet": line.strip()[:100]
                    })

    except Exception as e:
        print(f"Error reading {filename}: {e}")

report["storage_keys"] = sorted(list(report["storage_keys"]))

print(json.dumps(report, indent=2))
