# Local LLM Setup - Qwen2.5-1.5B

## Hardware
- Mac Mini Late 2014 (Intel i7-4578U, 16GB RAM)
- CPU-only inference

## Models Available
| Model | Size | Speed | Use Case |
|-------|------|-------|----------|
| qwen2.5:1.5b | 986 MB | ~4.5 tok/s | **Default** - All services |
| qwen3.5:4b | 3.4 GB | ~1-2 tok/s | Higher quality (slow) |
| qwen3.5:9b | 6.6 GB | ~0.5 tok/s | Best quality (very slow) |

## Usage

```bash
# Start ollama server (if not running)
OLLAMA_KV_CACHE_TYPE="q8_0" ollama serve

# Interactive chat
ollama run qwen2.5:1.5b

# API call (used by all ezoai.jp services)
curl http://localhost:11434/api/chat -d '{
  "model": "qwen2.5:1.5b",
  "messages": [{"role": "user", "content": "Hello"}],
  "stream": false,
  "options": {"num_ctx": 2048, "temperature": 0.7}
}'
```

## Environment Variables
All services use these env vars:
- `OLLAMA_URL` - Default: `http://localhost:11434`
- `OLLAMA_MODEL` - Default: `qwen2.5:1.5b`

## Running Services Locally
```bash
# Start Ollama
ollama serve &

# Start any service
cd /Users/lily/dev/02dev/ai-kaukau
npm run dev
```
