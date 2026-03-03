from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Optional, Literal, Dict, Any
import uuid

from jose import jwt, JWTError, ExpiredSignatureError
from passlib.context import CryptContext

from .settings import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

TokenType = Literal["access", "refresh"]


# ------------------------
# Password hashing
# ------------------------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


# ------------------------
# JWT creation
# ------------------------
def _now_utc() -> datetime:
    return datetime.now(timezone.utc)

def _base_claims(subject: str, token_type: TokenType) -> Dict[str, Any]:
    return {
        "sub": subject,
        "typ": token_type,                 # access | refresh
        "iss": settings.jwt_issuer,
        "aud": settings.jwt_audience,
        "iat": int(_now_utc().timestamp()),
        "jti": uuid.uuid4().hex,           # unique token id
    }

def create_access_token(subject: str, expires_minutes: Optional[int] = None) -> str:
    exp = _now_utc() + timedelta(minutes=expires_minutes or settings.access_token_expire_minutes)
    payload = _base_claims(subject, "access")
    payload["exp"] = int(exp.timestamp())
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_alg)

def create_refresh_token(subject: str, expires_days: Optional[int] = None) -> str:
    exp = _now_utc() + timedelta(days=expires_days or settings.refresh_token_expire_days)
    payload = _base_claims(subject, "refresh")
    payload["exp"] = int(exp.timestamp())
    return jwt.encode(payload, settings.refresh_jwt_secret, algorithm=settings.jwt_alg)


# ------------------------
# JWT decode + validation
# ------------------------
class TokenDecodeError(Exception):
    pass

class TokenExpiredError(TokenDecodeError):
    pass

class TokenInvalidError(TokenDecodeError):
    pass

def decode_token(
    token: str,
    expected_type: Optional[TokenType] = None,
) -> Dict[str, Any]:
    """
    Returns full claims dict if valid.
    Optionally enforce token type: access or refresh.
    """
    try:
        claims = jwt.decode(
            token,
            settings.jwt_secret if expected_type != "refresh" else settings.refresh_jwt_secret,
            algorithms=[settings.jwt_alg],
            audience=settings.jwt_audience,
            issuer=settings.jwt_issuer,
            options={
                "verify_aud": True,
                "verify_iss": True,
            },
            leeway=settings.jwt_leeway_seconds,
        )
    except ExpiredSignatureError as e:
        raise TokenExpiredError("Token expired") from e
    except JWTError as e:
        raise TokenInvalidError("Token invalid") from e

    if expected_type is not None:
        typ = claims.get("typ")
        if typ != expected_type:
            raise TokenInvalidError(f"Wrong token type: expected {expected_type}, got {typ}")

    if not claims.get("sub"):
        raise TokenInvalidError("Missing subject (sub)")

    return claims


def decode_access_subject(token: str) -> str:
    claims = decode_token(token, expected_type="access")
    return str(claims["sub"])

def decode_refresh_subject(token: str) -> str:
    claims = decode_token(token, expected_type="refresh")
    return str(claims["sub"])
