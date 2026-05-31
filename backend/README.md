# backend/agent.py

This folder includes a minimal Retrieval-Augmented Generation (RAG) agent implementation.

Quick usage (from repository root):

```powershell
python -m backend.agent --data ./some/text/files --question "What is the project about?"
```

Notes:
- The module is import-safe without installing the optional dependencies.
- For best results, install packages in `requirements.txt` and set `OPENAI_API_KEY`.
