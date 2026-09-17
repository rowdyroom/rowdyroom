import json
import smtplib
import ssl
import sys
from email.message import EmailMessage
from email.utils import formatdate, make_msgid

cfg = json.load(sys.stdin)
msg = EmailMessage()
msg["From"] = f"Rowdy Room <{cfg['username']}>"
msg["To"] = cfg["to"]
msg["Reply-To"] = "rowdyroom@gmail.com"
msg["Date"] = formatdate(localtime=True)
msg["Message-ID"] = make_msgid(domain="rowdyroom.site")
msg["Subject"] = f"Rowdy Room karaoke package {cfg['package_code']}"
msg.set_content(
    f"Hi {cfg['customer']},\n\n"
    "Thanks for singing with Rowdy Room. Your requested karaoke performance files are ready.\n\n"
    f"Secure download:\n{cfg['delivery_url']}\n\n"
    "If you did not request this recording, reply to this message and we will remove it.\n\n"
    "Rowdy Room\nRolla, Missouri\n"
)
with smtplib.SMTP_SSL(cfg["host"], int(cfg["port"]), context=ssl.create_default_context(), timeout=30) as smtp:
    smtp.login(cfg["username"], cfg["password"])
    smtp.send_message(msg)
print(json.dumps({"ok": True}))
