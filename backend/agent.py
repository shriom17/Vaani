"""
Simple RAG (Retrieval-Augmented Generation) agent.

This module provides a minimal, dependency-light RAG pipeline:
- a tiny fallback retriever (`SimpleIndexer`) using term-frequency + cosine similarity
- an `Agent` that can index local text files and answer questions using retrieved context
- optional OpenAI integration (only used when `openai` is installed and `OPENAI_API_KEY` is set)

The module avoids heavy imports at import-time so it is safe to `import` even without
ML/LLM dependencies installed. To get full functionality, install packages listed in
`backend/requirements.txt`.
"""

from __future__ import annotations

import argparse
import math
import os
import re
from pathlib import Path
from typing import List, Optional, Sequence, Tuple


class SimpleIndexer:
	"""Lightweight fallback indexer: term-frequency vectors + cosine similarity.

	Designed so the module can be imported without third-party packages.
	"""

	def __init__(self) -> None:
		self.docs: List[str] = []
		self.ids: List[str] = []
		self.vectors: List[dict] = []

	@staticmethod
	def _tokenize(text: str) -> List[str]:
		return re.findall(r"\b\w+\b", text.lower())

	def add(self, doc_id: str, text: str) -> None:
		tokens = self._tokenize(text)
		tf: dict = {}
		for t in tokens:
			tf[t] = tf.get(t, 0) + 1
		self.docs.append(text)
		self.ids.append(doc_id)
		self.vectors.append(tf)

	@staticmethod
	def _dot(a: dict, b: dict) -> float:
		s = 0.0
		for k, v in a.items():
			s += v * b.get(k, 0.0)
		return s

	@staticmethod
	def _norm(a: dict) -> float:
		s = 0.0
		for v in a.values():
			s += v * v
		return math.sqrt(s) if s > 0 else 1.0

	def _cosine(self, a: dict, b: dict) -> float:
		denom = self._norm(a) * self._norm(b)
		if denom == 0:
			return 0.0
		return self._dot(a, b) / denom

	def search(self, query: str, topk: int = 3) -> List[Tuple[float, str, str]]:
		q_tokens = self._tokenize(query)
		q_tf: dict = {}
		for t in q_tokens:
			q_tf[t] = q_tf.get(t, 0) + 1
		scored = []
		for i, vec in enumerate(self.vectors):
			score = self._cosine(q_tf, vec)
			scored.append((score, self.ids[i], self.docs[i]))
		scored.sort(key=lambda x: x[0], reverse=True)
		return scored[:topk]


class Agent:
	"""Minimal RAG agent.

	Usage examples:
	  agent = Agent()
	  agent.add_documents_from_dir('data/')
	  print(agent.answer('What is X?'))

	The LLM call uses OpenAI if the `openai` package is installed and
	`OPENAI_API_KEY` environment variable is set; otherwise a readable
	fallback is returned that contains the constructed prompt.
	"""

	def __init__(self, documents: Optional[Sequence[Tuple[str, str]]] = None) -> None:
		self.index = SimpleIndexer()
		if documents:
			for doc_id, text in documents:
				self.add_document(doc_id, text)

	def add_document(self, doc_id: str, text: str) -> None:
		self.index.add(doc_id, text)

	def add_documents_from_dir(self, dirpath: str, exts: Tuple[str, ...] = (".txt", ".md")) -> None:
		p = Path(dirpath)
		if not p.exists():
			raise FileNotFoundError(f"Directory not found: {dirpath}")
		for f in p.rglob("*"):
			if f.is_file() and f.suffix.lower() in exts:
				try:
					text = f.read_text(encoding="utf-8")
				except Exception:
					text = f.read_text(encoding="latin-1")
				self.add_document(str(f.resolve()), text)

	def retrieve(self, query: str, topk: int = 3) -> List[Tuple[float, str, str]]:
		return self.index.search(query, topk=topk)

	def _call_llm(self, prompt: str, model: Optional[str] = None, max_tokens: int = 512, temperature: float = 0.0) -> str:
		# Late import so module import stays lightweight.
		try:
			import openai
		except Exception:
			return "[FALLBACK] OpenAI SDK not installed or unavailable.\n\n" + prompt

		api_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("OPENAI_KEY")
		if not api_key:
			return "[FALLBACK] OPENAI_API_KEY not set.\n\n" + prompt

		openai.api_key = api_key
		try:
			resp = openai.ChatCompletion.create(
				model=model or "gpt-4",
				messages=[{"role": "user", "content": prompt}],
				max_tokens=max_tokens,
				temperature=temperature,
			)
			if resp and resp.get("choices"):
				return resp["choices"][0]["message"]["content"].strip()
			return str(resp)
		except Exception as exc:  # pragma: no cover - external call
			return f"[OPENAI ERROR] {exc}\n\nPrompt:\n{prompt}"

	def answer(self, query: str, topk: int = 3, llm_model: Optional[str] = None) -> str:
		hits = self.retrieve(query, topk=topk)
		context_parts = []
		for score, doc_id, text in hits:
			snippet = text.strip()[:2000]
			context_parts.append(f"[{doc_id}]\n{snippet}")
		context = "\n\n---\n\n".join(context_parts) if context_parts else ""
		prompt = (
			"Use the following retrieved documents to answer the question. If the answer"
			" is not contained in the documents, respond that you don't know.\n\n"
			f"Documents:\n{context}\n\nQuestion: {query}\n\nAnswer concisely."
		)
		return self._call_llm(prompt, model=llm_model)


def _cli_main() -> None:
	parser = argparse.ArgumentParser(description="Simple RAG agent (minimal)")
	parser.add_argument("--data", help="Directory with text files to index", default=None)
	parser.add_argument("--question", help="Question to ask the agent", default=None)
	parser.add_argument("--topk", help="Number of documents to retrieve", type=int, default=3)
	args = parser.parse_args()
	agent = Agent()
	if args.data:
		agent.add_documents_from_dir(args.data)
	if args.question:
		out = agent.answer(args.question, topk=args.topk)
		print(out)
	else:
		print("Agent ready. Provide --data to index files and --question to ask a question.")


if __name__ == "__main__":
	_cli_main()

