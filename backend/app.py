import os
import re
import html
import logging
from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import requests
from dotenv import load_dotenv

# Load local environment variables from .env
_env_dir = os.path.dirname(os.path.abspath(__file__))
_env_file = os.path.join(_env_dir, ".env")
if os.path.exists(_env_file):
    load_dotenv(_env_file)
else:
    load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("portfolio-backend")

app = Flask(__name__)

# --- Rate Limiter -----------------------------------------------------------
limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    default_limits=[],
    storage_uri=os.getenv("LIMITER_STORAGE_URI", "memory://"),
)

# --- CORS -------------------------------------------------------------------
_prod_origin = os.getenv("CORS_ALLOWED_ORIGIN", "").strip()
_allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://localhost:3000",
    "http://localhost:5000",
]
if _prod_origin:
    _allowed_origins.append(_prod_origin)

CORS(
    app,
    resources={
        r"/*": {
            "origins": _allowed_origins,
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    },
)

# --- Configuration from environment -----------------------------------------
BREVO_API_KEY      = os.getenv("BREVO_API_KEY", "").strip()
BREVO_SENDER_EMAIL = os.getenv("BREVO_SENDER_EMAIL", "jebaraj1364@gmail.com").strip()
BREVO_SENDER_NAME  = os.getenv("BREVO_SENDER_NAME", "Jebaraj.P").strip()
OWNER_EMAIL        = os.getenv("OWNER_EMAIL", os.getenv("CONTACT_RECIPIENT_EMAIL", "jebaraj1364@gmail.com")).strip()
WHATSAPP_URL       = os.getenv("WHATSAPP_URL", "https://wa.me/qr/FT5PXECCGTFRG1").strip()

SMTP_HOST = os.getenv("SMTP_HOST", "").strip()
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "").strip()
SMTP_PASS = os.getenv("SMTP_PASS", "").strip()

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
PHONE_REGEX = re.compile(r"^\+?[0-9\s\-().]{7,25}$")

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def sanitize_input(value: str, max_length: int = 5000) -> str:
    """Strip, truncate, and HTML-escape user input."""
    if not value or not isinstance(value, str):
        return ""
    return html.escape(value.strip()[:max_length])


def _brevo_headers() -> dict:
    return {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        "accept": "application/json",
    }


def _post_brevo(payload: dict):
    response = requests.post(BREVO_API_URL, json=payload, headers=_brevo_headers(), timeout=12)
    if response.status_code in (200, 201, 202):
        return True, "ok"
    logger.error(f"Brevo API error ({response.status_code}): {response.text}")
    return False, f"Brevo error ({response.status_code}): {response.text}"


# ---------------------------------------------------------------------------
# Email HTML / text builders
# ---------------------------------------------------------------------------

def _owner_html(name, email, phone, details):
    return f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Portfolio Enquiry</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#0b0d11;color:#f2f3f5;padding:24px;margin:0;">
  <div style="max-width:600px;margin:0 auto;background:#13171f;border:1px solid #232834;border-radius:12px;padding:28px;box-shadow:0 8px 30px rgba(0,0,0,.5);">
    <div style="border-bottom:2px solid #ff334b;padding-bottom:16px;margin-bottom:20px;">
      <span style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#ff334b;font-weight:700;">Direct Freelance Enquiry</span>
      <h1 style="font-size:22px;font-weight:700;margin:8px 0 0;color:#fff;">New Portfolio Enquiry</h1>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr>
        <td style="padding:10px 0;color:#8e95a5;font-size:13px;width:140px;font-weight:600;">Name:</td>
        <td style="padding:10px 0;color:#fff;font-size:15px;font-weight:600;">{name}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#8e95a5;font-size:13px;font-weight:600;">Email:</td>
        <td style="padding:10px 0;color:#ff576d;font-size:15px;"><a href="mailto:{email}" style="color:#ff576d;text-decoration:none;">{email}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#8e95a5;font-size:13px;font-weight:600;">Phone:</td>
        <td style="padding:10px 0;color:#fff;font-size:15px;">{phone}</td>
      </tr>
    </table>
    <div style="background:#0b0d11;border-radius:8px;border:1px solid #1c2230;padding:18px;margin-bottom:24px;">
      <span style="display:block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8e95a5;margin-bottom:10px;font-weight:600;">Project Details:</span>
      <p style="margin:0;font-size:14.5px;line-height:1.6;color:#e4e7ec;white-space:pre-wrap;">{details}</p>
    </div>
    <div style="font-size:11px;color:#5f677a;border-top:1px solid #1c2230;padding-top:14px;">
      Hit <strong style="color:#aab0be;">Reply</strong> to respond directly to {name}.
    </div>
  </div>
</body>
</html>"""


def _owner_text(name, email, phone, details):
    return f"""New Portfolio Enquiry

Name: {name}
Email: {email}
Phone: {phone}

Project Details:
{details}

---
Reply to this email to respond directly to {name}.
"""


def _confirmation_html(name):
    return f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Enquiry Received - Jebaraj.P</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#0b0d11;color:#f2f3f5;padding:24px;margin:0;">
  <div style="max-width:560px;margin:0 auto;background:#13171f;border:1px solid #232834;border-radius:12px;padding:36px 32px;box-shadow:0 8px 30px rgba(0,0,0,.5);">

    <div style="margin-bottom:28px;">
      <span style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#ff334b;font-weight:700;">JEBARAJ.P</span>
      <div style="width:32px;height:2px;background:#ff334b;margin-top:8px;"></div>
    </div>

    <h1 style="font-size:20px;font-weight:700;color:#fff;margin:0 0 12px;">Enquiry received, {name}.</h1>
    <p style="font-size:14.5px;line-height:1.7;color:#8e95a5;margin:0 0 28px;">
      Thank you for reaching out. I've received your message and will review it personally.
      I typically respond within <strong style="color:#e4e7ec;">1-2 business days</strong> with initial thoughts or next steps.
    </p>

    <div style="border-top:1px solid #1c2230;margin-bottom:28px;"></div>

    <div style="margin-bottom:28px;">
      <span style="display:block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#5f677a;font-weight:600;margin-bottom:16px;">What Happens Next</span>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:20px;"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#ff334b;margin-top:5px;"></span></td>
          <td style="padding:8px 0;font-size:13.5px;color:#aab0be;line-height:1.5;">I review your enquiry and assess project fit.</td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#ff334b;margin-top:5px;"></span></td>
          <td style="padding:8px 0;font-size:13.5px;color:#aab0be;line-height:1.5;">I respond with technical insights and clarifying questions if needed.</td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#ff334b;margin-top:5px;"></span></td>
          <td style="padding:8px 0;font-size:13.5px;color:#aab0be;line-height:1.5;">We align on scope, timeline, and deliverables.</td>
        </tr>
      </table>
    </div>

    <div style="margin-bottom:32px;">
      <a href="mailto:{BREVO_SENDER_EMAIL}" style="display:inline-block;background:#ff334b;color:#fff;font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;padding:12px 24px;border-radius:6px;">Reply to This Email</a>
    </div>

    <div style="border-top:1px solid #1c2230;padding-top:18px;">
      <p style="font-size:11px;color:#5f677a;margin:0;line-height:1.6;">
        JEBARAJ.P &nbsp;&bull;&nbsp; Freelance Developer &amp; Digital Experience Designer<br>
        Tirunelveli, India &nbsp;&bull;&nbsp; <a href="mailto:{BREVO_SENDER_EMAIL}" style="color:#5f677a;">{BREVO_SENDER_EMAIL}</a>
      </p>
    </div>
  </div>
</body>
</html>"""


def _confirmation_text(name):
    return f"""Hi {name},

Your enquiry has been received.

I review every message personally and will get back to you within 1-2 business days with initial thoughts or next steps.

If you need to reach me sooner, reply directly to this email.

--
Jebaraj.P
Freelance Developer & Digital Experience Designer
{BREVO_SENDER_EMAIL}
"""


# ---------------------------------------------------------------------------
# Email delivery
# ---------------------------------------------------------------------------

def send_owner_notification(name, email, phone, details):
    """Send enquiry to owner with visitor as Reply-To."""
    payload = {
        "sender": {"name": BREVO_SENDER_NAME, "email": BREVO_SENDER_EMAIL},
        "to": [{"email": OWNER_EMAIL, "name": "Jebaraj.P"}],
        "replyTo": {"email": email, "name": name},
        "subject": f"New Portfolio Enquiry from {name}",
        "htmlContent": _owner_html(name, email, phone, details),
        "textContent": _owner_text(name, email, phone, details),
    }
    ok, msg = _post_brevo(payload)
    if ok:
        logger.info(f"Owner notification sent to {OWNER_EMAIL} for enquiry from {name} <{email}>")
    return ok, msg


def send_visitor_confirmation(name, visitor_email):
    """Send confirmation email to the visitor (best-effort)."""
    payload = {
        "sender": {"name": BREVO_SENDER_NAME, "email": BREVO_SENDER_EMAIL},
        "to": [{"email": visitor_email, "name": name}],
        "subject": "Enquiry Received - I'll Be In Touch",
        "htmlContent": _confirmation_html(name),
        "textContent": _confirmation_text(name),
    }
    ok, msg = _post_brevo(payload)
    if ok:
        logger.info(f"Confirmation sent to visitor {name} <{visitor_email}>")
    else:
        logger.warning(f"Visitor confirmation failed for {visitor_email}: {msg}")
    return ok, msg


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    has_brevo = bool(BREVO_API_KEY)
    has_smtp  = bool(SMTP_HOST and SMTP_PASS)
    return jsonify({
        "status": "healthy",
        "service": "jebaraj-portfolio-backend",
        "owner_email": OWNER_EMAIL,
        "whatsapp_url": WHATSAPP_URL,
        "email_delivery": {
            "provider": "brevo" if has_brevo else ("smtp" if has_smtp else "none"),
            "configured": has_brevo or has_smtp,
            "two_email_flow": has_brevo,
        },
    }), 200


@app.route("/whatsapp", methods=["GET"])
@app.route("/api/whatsapp", methods=["GET"])
def whatsapp_redirect():
    """Redirect to the configured WhatsApp URL."""
    logger.info(f"Handling /whatsapp -> 302 -> {WHATSAPP_URL}")
    return redirect(WHATSAPP_URL, code=302)


@app.route("/api/contact", methods=["POST"])
@limiter.limit("5 per minute")
def submit_contact():
    """Handle contact form submissions with two-email delivery."""
    try:
        data = request.get_json(silent=True)
        if not data or not isinstance(data, dict):
            return jsonify({"error": "Invalid request payload. Expected JSON."}), 400

        name    = sanitize_input(data.get("name", ""), max_length=100)
        email   = (data.get("email", "") or "").strip().lower()
        phone   = (data.get("phone", "") or data.get("phoneNumber", "") or "").strip()
        raw     = data.get("project_details") or data.get("projectDetails") or data.get("message") or ""
        details = sanitize_input(raw, max_length=5000)

        if not name or len(name) < 2:
            return jsonify({"error": "Please provide your full name (at least 2 characters)."}), 422
        if not email or not EMAIL_REGEX.match(email):
            return jsonify({"error": "Please provide a valid email address."}), 422
        if not phone or not PHONE_REGEX.match(phone):
            return jsonify({"error": "Please provide a valid phone number (at least 7 digits, international prefixes supported)."}), 422
        if not details or len(details) < 5:
            return jsonify({"error": "Please provide brief details about your project (at least 5 characters)."}), 422

        logger.info(f"Verified enquiry from: {name} <{email}>, Phone: {phone}")

        # ── Brevo: two-email flow ─────────────────────────────────────────
        if BREVO_API_KEY:
            # 1. Owner notification (required)
            ok, err = send_owner_notification(name, email, phone, details)
            if not ok:
                return jsonify({
                    "error": "Failed to deliver enquiry. Please try again or contact directly.",
                    "details": err,
                }), 502

            # 2. Visitor confirmation (best-effort, never blocks success)
            send_visitor_confirmation(name, email)

            return jsonify({
                "success": True,
                "message": f"Enquiry delivered. A confirmation has been sent to {email}.",
                "recipient": OWNER_EMAIL,
            }), 200

        # ── SMTP fallback (owner notification only) ───────────────────────
        elif SMTP_HOST and SMTP_PASS:
            try:
                import smtplib
                from email.mime.multipart import MIMEMultipart
                from email.mime.text import MIMEText

                msg_obj = MIMEMultipart("alternative")
                msg_obj["Subject"] = f"New Portfolio Enquiry from {name}"
                msg_obj["From"]    = f"{BREVO_SENDER_NAME} <{BREVO_SENDER_EMAIL}>"
                msg_obj["To"]      = OWNER_EMAIL
                msg_obj["Reply-To"] = f"{name} <{email}>"
                msg_obj.attach(MIMEText(_owner_text(name, email, phone, details), "plain"))

                with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=12) as server:
                    server.starttls()
                    server.login(SMTP_USER, SMTP_PASS)
                    server.sendmail(BREVO_SENDER_EMAIL, [OWNER_EMAIL], msg_obj.as_string())

                logger.info(f"SMTP owner notification sent to {OWNER_EMAIL} for {name}")
                return jsonify({
                    "success": True,
                    "message": f"Enquiry delivered via SMTP to {OWNER_EMAIL}.",
                    "recipient": OWNER_EMAIL,
                }), 200
            except Exception as e:
                logger.error(f"SMTP error: {e}")
                return jsonify({"error": f"SMTP delivery failure: {str(e)}"}), 502

        # ── No provider configured ────────────────────────────────────────
        else:
            logger.warning("No BREVO_API_KEY or SMTP credentials configured.")
            return jsonify({
                "success": False,
                "error": f"Email delivery is not configured. Set BREVO_API_KEY in backend/.env.",
                "missing_config": ["BREVO_API_KEY"],
            }), 503

    except Exception as e:
        logger.exception("Unexpected error processing enquiry")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    logger.info(f"Starting Jebaraj Portfolio Backend on port {port}...")
    logger.info(f"Owner Recipient : {OWNER_EMAIL}")
    logger.info(f"Sender Identity : {BREVO_SENDER_NAME} <{BREVO_SENDER_EMAIL}>")
    logger.info(f"Brevo configured: {bool(BREVO_API_KEY)}")
    app.run(host="0.0.0.0", port=port, debug=False)
