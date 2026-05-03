import json
import os
import uuid

import urllib.request
import ssl


SYSTEM_PROMPT = """You are FluentFriend — a friendly English tutor. Your job is to:
1. Have a natural conversation in English with the student
2. Detect grammatical errors in their messages
3. Always respond with a JSON object in this exact format:

{
  "reply": "Your conversational response here",
  "correction": null
}

OR if there is a grammar error:

{
  "reply": "Your conversational response here",
  "correction": {
    "original": "the incorrect phrase",
    "fixed": "the corrected phrase",
    "explanation": "Brief explanation in Russian why it is wrong and how to fix it"
  }
}

Rules:
- Be warm, encouraging and supportive
- Keep replies concise (2-4 sentences max)
- Only correct ONE error at a time (the most important one)
- If the message is grammatically correct, set correction to null
- Always respond in valid JSON only, no markdown, no extra text
- Explanation must be in Russian"""


def get_gigachat_token() -> str:
    credentials = os.environ["GIGACHAT_CREDENTIALS"]
    payload = "scope=GIGACHAT_API_PERS".encode("utf-8")
    req = urllib.request.Request(
        "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
        data=payload,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "Authorization": f"Basic {credentials}",
            "RqUID": str(uuid.uuid4()),
        },
        method="POST",
    )
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    with urllib.request.urlopen(req, context=ctx) as resp:
        data = json.loads(resp.read())
    return data["access_token"]


def handler(event: dict, context) -> dict:
    """ИИ-репетитор английского языка на базе GigaChat."""
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    body = json.loads(event.get("body") or "{}")
    user_message = body.get("message", "").strip()
    history = body.get("history", [])

    if not user_message:
        return {
            "statusCode": 400,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": "message is required"}),
        }

    token = get_gigachat_token()

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for h in history[-10:]:
        messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": user_message})

    payload = json.dumps({
        "model": "GigaChat",
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 512,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Bearer {token}",
        },
        method="POST",
    )
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    with urllib.request.urlopen(req, context=ctx) as resp:
        result = json.loads(resp.read())

    content = result["choices"][0]["message"]["content"]

    # GigaChat иногда оборачивает ответ в markdown-блок ```json ... ```
    if content.strip().startswith("```"):
        content = content.strip().strip("`").strip()
        if content.startswith("json"):
            content = content[4:].strip()

    parsed = json.loads(content)

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({
            "reply": parsed.get("reply", ""),
            "correction": parsed.get("correction"),
        }),
    }