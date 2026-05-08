---
name: intel-coding-conventions
description: Source-code conventions for IC-pack engineering. Classification declaration in headers; CUI-aware logging; partition-aware AWS calls; no commercial-internet-only deps in critical paths.
classification: UNCLASSIFIED
ic_pack: true
allowed-tools: Read, Write, Edit, Bash
---

# Intel coding conventions

> Behavioral skill. Injected into `gsd-executor`, `gsd-debugger`, `gsd-code-fixer`. Activates whenever the host agent runs.

## Conventions

### 1. Classification declaration in source headers

Every source file gets a first-line classification comment. See `skills/classification-conventions` for the canonical form. Examples:

```python
# CLASSIFICATION: UNCLASSIFIED
"""Module docstring..."""
```

```javascript
// CLASSIFICATION: UNCLASSIFIED
// Module description
```

```bash
#!/usr/bin/env bash
# CLASSIFICATION: UNCLASSIFIED
```

### 2. CUI-aware logging

Logs are forensic artifacts. Never log:

- Personally Identifiable Information (PII): full names, SSN, DOB, government-issued IDs.
- Source attribution: HUMINT source identifiers, signal-source metadata.
- Compartment markings: even if the program operates at low-side, treat raw markings as CUI in logs.
- Wallet addresses, IP addresses tied to investigations, raw geolocation tied to entities.

Hash or tokenize before logging. Use `wallet_id_hash` not `wallet_address`. Use `entity_token` not `entity_name`.

### 3. Partition-aware AWS calls

When the program targets AWS GovCloud or AWS C2S/SC2S, the SDK partition matters. Default `arn:aws:` is the commercial partition; classified IC programs use `arn:aws-us-gov:` or partition-specific equivalents. Code should:

- Read partition from environment (`AWS_PARTITION` or program config), not hardcode `arn:aws:`.
- Construct ARNs using the SDK's ARN-builder utilities, not string concatenation.
- Test in both commercial and gov partitions when CI gates allow.

### 4. No commercial-internet-only deps in critical paths

If a dependency requires reaching commercial-internet endpoints to function (license check, telemetry phone-home, cloud-only models), it cannot ship in a classified-environment delivery without explicit air-gap-aware fallback.

Acceptable: dev-time-only deps that are not in the runtime closure.
Not acceptable: production runtime deps that won't function disconnected.

### 5. Secrets handling

- Never commit credentials, API keys, or PEM material to the repo.
- Use environment variables or program-managed secret stores.
- IC-pack-controlled tooling (`gsd-itar-screener`, etc.) audits diffs for secret-shaped strings.

## Behavior notes

- This skill modifies coding decisions, not tool capabilities.
- Combine with `classification-conventions` for the full behavioral overlay.
- In conflicts with explicit prompts, the prompt wins; surface the conflict before proceeding.
