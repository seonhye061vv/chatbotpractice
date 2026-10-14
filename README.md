# chatbotpractice

OpenRouter API를 사용하는 간단한 챗봇입니다. Vercel에 바로 배포할 수 있습니다.

## 구조

- `public/index.html` — 채팅 UI (정적 페이지)
- `api/chat.js` — Vercel 서버리스 함수. 브라우저 요청을 OpenRouter로 전달합니다 (API 키는 서버에만 보관).

## 환경 변수 (Vercel → Project Settings → Environment Variables)

| 이름 | 필수 | 설명 |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | ✅ | OpenRouter API 키 |
| `OPENROUTER_MODEL` | | 사용할 모델 (예: `openai/gpt-4o-mini`). 기본값 `openrouter/auto` |

환경 변수를 바꾼 뒤에는 재배포해야 적용됩니다.

## 로컬 실행

```bash
npm i -g vercel
vercel env pull   # 또는 .env.local 에 OPENROUTER_API_KEY=... 작성
vercel dev
```
