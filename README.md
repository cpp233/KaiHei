## 技术栈

- next
- next-themes
- tailwindcss
- shadcn-ui
- prisma
- zod
- react-hook-form
- clerk
- livekit
- axios
- socket.io
- uploadthing
- zustand

## 功能一览

- 服务器管理和自定义
- 邀请链接生成和邀请系统（服务器）
- 服务器成员管理、权限调整
- 频道管理
- 频道类型：文字、语音、视频
- 群聊消息
- 服务器内搜索：用户、频道，支持拼音搜索
- 实时消息对话 (`Socket.io`)
- 不支持 Websocket 可回退到 HTTP 轮询 (`@tanstack/react-query` `useInfiniteQuery`)
- 对话支持发送存储 图片/PDF (`UploadThing`)
- 对话 Emoji 弹出框模块 (`emoji-mart`)
- 删除/编辑消息，并实时同步
- 1:1 对话和 1:1 视频/音频通话 (`livekit`)
- 响应式，支持移动端 UI( `TailwindCSS` )
- 支持暗黑模式 (`next-themes`)
- Prisma + MySQL 数据库
- 权限认证 (`Clerk`)

## 环境变量

| 变量名                                | 备注                  | 示例                                               |
| ------------------------------------- | --------------------- | -------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`   | Clerk                 |                                                    |
| `CLERK_SECRET_KEY`                    | Clerk                 |                                                    |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`       | Clerk                 | /sign-in                                           |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`       | Clerk                 | /sign-up                                           |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Clerk                 | /                                                  |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Clerk                 | /                                                  |
| `UPLOADTHING_SECRET`                  | UploadThing           |                                                    |
| `UPLOADTHING_APP_ID`                  | UploadThing           |                                                    |
| `DATABASE_URL`                        | 数据库                | "mysql://xxx:xxx@domain:port/db?ssl-mode=REQUIRED" |
| `LIVEKIT_API_KEY`                     | livekit               |
| `LIVEKIT_API_SECRET`                  | livekit               |
| `NEXT_PUBLIC_LIVEKIT_URL`             | livekit               |
| `NEXT_PUBLIC_SITE_URL`                | ws 用，需要服务端支持 |
