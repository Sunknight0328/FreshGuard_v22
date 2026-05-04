# 邮箱验证配置指南

## 📧 功能说明

时鲜管家现在支持邮箱验证功能：

### 注册流程
1. 用户输入真实邮箱和密码
2. 系统发送验证码到邮箱
3. 用户输入验证码完成注册
4. 验证成功后自动登录

### 忘记密码流程
1. 用户点击"忘记密码"
2. 输入注册时的邮箱
3. 系统发送重置密码链接到邮箱
4. 用户点击链接重置密码

---

## 🔧 Supabase 邮箱配置

### 方式一：使用 Supabase 内置邮件服务（推荐，简单）

Supabase 提供免费的邮件发送服务，无需额外配置。

#### 步骤 1：启用邮箱验证

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目
3. 进入 **Authentication** → **Providers**
4. 找到 **Email** 选项
5. 确保 **Enable Email provider** 已开启 ✅
6. 配置选项：
   - **Confirm email**: ✅ 开启（要求用户验证邮箱）
   - **Secure email change**: ✅ 开启（更改邮箱时需要验证）

#### 步骤 2：配置邮件模板（可选）

1. 进入 **Authentication** → **Email Templates**
2. 可以自定义以下模板：
   - **Confirm signup** - 注册验证邮件
   - **Magic Link** - 魔法链接邮件
   - **Change Email Address** - 更改邮箱验证
   - **Reset Password** - 重置密码邮件

**默认模板示例**：
```html
<h2>确认您的注册</h2>
<p>请输入以下验证码完成注册：</p>
<h1>{{ .Token }}</h1>
<p>此验证码将在 1 小时后过期。</p>
```

#### 步骤 3：测试邮件发送

1. 在应用中注册一个新账号
2. 检查邮箱（包括垃圾邮件文件夹）
3. 应该收到包含验证码的邮件

**注意**：
- Supabase 免费邮件服务有发送限制（每小时约 30 封）
- 邮件可能被标记为垃圾邮件
- 建议在生产环境使用自定义 SMTP（见方式二）

---

### 方式二：使用自定义 SMTP 服务器（生产环境推荐）

使用自己的 SMTP 服务器可以获得更好的邮件送达率和更高的发送限制。

#### 支持的 SMTP 服务商

| 服务商 | 免费额度 | 特点 |
|--------|---------|------|
| **SendGrid** | 100 封/天 | 稳定，送达率高 |
| **Mailgun** | 5,000 封/月 | 功能强大 |
| **Amazon SES** | 62,000 封/月 | AWS 生态 |
| **阿里云邮件推送** | 200 封/天 | 国内送达率好 |
| **腾讯云邮件推送** | 1,000 封/月 | 国内送达率好 |

#### 配置步骤（以 SendGrid 为例）

**步骤 1：创建 SendGrid 账号**

1. 访问 [SendGrid](https://sendgrid.com/)
2. 注册免费账号
3. 验证邮箱

**步骤 2：创建 API Key**

1. 登录 SendGrid Dashboard
2. 进入 **Settings** → **API Keys**
3. 点击 **Create API Key**
4. 选择 **Full Access**
5. 复制 API Key（只显示一次！）

**步骤 3：配置 Supabase SMTP**

1. 登录 Supabase Dashboard
2. 进入 **Project Settings** → **Auth**
3. 滚动到 **SMTP Settings**
4. 填写以下信息：

```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [您的 SendGrid API Key]
Sender email: noreply@yourdomain.com
Sender name: 时鲜管家
```

5. 点击 **Save**

**步骤 4：验证发件人邮箱**

1. 在 SendGrid Dashboard 中
2. 进入 **Settings** → **Sender Authentication**
3. 验证您的发件人邮箱或域名

**步骤 5：测试发送**

1. 在应用中注册新账号
2. 检查邮件是否正常发送
3. 查看 SendGrid Dashboard 的发送统计

---

### 方式三：使用阿里云邮件推送（国内推荐）

#### 步骤 1：开通服务

1. 登录 [阿里云控制台](https://www.aliyun.com/)
2. 搜索"邮件推送"
3. 开通服务（免费版：200 封/天）

#### 步骤 2：配置发信域名

1. 进入邮件推送控制台
2. 添加发信域名（需要有自己的域名）
3. 配置 DNS 记录（SPF、MX、CNAME）
4. 等待验证通过

#### 步骤 3：创建发信地址

1. 在控制台创建发信地址
2. 例如：`noreply@yourdomain.com`

#### 步骤 4：获取 SMTP 信息

1. 进入 **SMTP 服务**
2. 创建 SMTP 密码
3. 记录以下信息：
   - SMTP 服务器地址
   - 端口（通常是 25 或 465）
   - 用户名
   - 密码

#### 步骤 5：配置 Supabase

在 Supabase Dashboard 的 SMTP Settings 中填写：

```
Host: smtpdm.aliyun.com
Port: 465
Username: [您的发信地址]
Password: [SMTP 密码]
Sender email: noreply@yourdomain.com
Sender name: 时鲜管家
```

---

## 🧪 测试邮箱验证功能

### 测试注册流程

1. **启动应用**
   ```bash
   npm run dev
   ```

2. **访问注册页面**
   - 打开 http://localhost:5173
   - 点击"立即注册"

3. **填写信息**
   - 邮箱：输入真实邮箱
   - 密码：至少 6 位

4. **发送验证码**
   - 点击"注册账号"按钮
   - 系统会发送验证码到邮箱

5. **输入验证码**
   - 检查邮箱（包括垃圾邮件）
   - 输入 6 位验证码
   - 点击"验证邮箱"

6. **验证成功**
   - 自动登录
   - 跳转到主页

### 测试忘记密码流程

1. **访问登录页面**
   - 点击"忘记密码？"

2. **输入邮箱**
   - 输入注册时的邮箱
   - 点击"忘记密码"

3. **检查邮件**
   - 打开邮箱
   - 找到重置密码邮件
   - 点击重置链接

4. **重置密码**
   - 输入新密码
   - 确认密码
   - 提交

5. **使用新密码登录**

---

## 🔍 常见问题

### Q1: 收不到验证码邮件？

**可能原因**：
1. 邮件在垃圾邮件文件夹
2. 邮箱地址输入错误
3. SMTP 配置错误
4. 邮件服务商限制

**解决方案**：
1. 检查垃圾邮件文件夹
2. 确认邮箱地址正确
3. 在 Supabase Dashboard 查看 Logs
4. 检查 SMTP 配置
5. 查看邮件服务商的发送日志

### Q2: 验证码输入后提示错误？

**可能原因**：
1. 验证码过期（通常 1 小时）
2. 验证码输入错误
3. 邮箱地址不匹配

**解决方案**：
1. 点击"重新发送"获取新验证码
2. 仔细检查验证码（6 位数字）
3. 确认邮箱地址正确

### Q3: 如何修改验证码有效期？

**答**：在 Supabase Dashboard 中：
1. 进入 **Authentication** → **Settings**
2. 找到 **Email OTP expiry**
3. 默认是 3600 秒（1 小时）
4. 可以修改为其他值

### Q4: 如何自定义邮件内容？

**答**：
1. 进入 **Authentication** → **Email Templates**
2. 选择要修改的模板
3. 编辑 HTML 内容
4. 可用变量：
   - `{{ .Token }}` - 验证码
   - `{{ .SiteURL }}` - 网站 URL
   - `{{ .ConfirmationURL }}` - 确认链接
5. 点击 **Save**

### Q5: 邮件被标记为垃圾邮件怎么办？

**解决方案**：
1. 使用自定义 SMTP（方式二）
2. 配置 SPF、DKIM、DMARC 记录
3. 使用已验证的域名
4. 避免使用垃圾邮件关键词
5. 提高发件人信誉度

### Q6: 免费额度用完了怎么办？

**Supabase 内置邮件**：
- 限制：约 30 封/小时
- 解决：升级到自定义 SMTP

**SendGrid 免费版**：
- 限制：100 封/天
- 解决：升级到付费计划（$19.95/月，40,000 封）

**阿里云邮件推送**：
- 限制：200 封/天
- 解决：购买资源包（￥8/万封）

---

## 📊 邮件发送监控

### Supabase Logs

1. 进入 **Logs** → **Auth Logs**
2. 查看邮件发送记录
3. 检查错误信息

### SMTP 服务商监控

**SendGrid**：
- Dashboard → Activity
- 查看发送、送达、打开、点击统计

**阿里云**：
- 邮件推送控制台
- 查看发送统计和失败原因

---

## 🔐 安全建议

### 1. 限制发送频率

在代码中添加发送频率限制：

```typescript
// 60 秒倒计时
const [countdown, setCountdown] = useState(0);

const handleSendCode = async () => {
  if (countdown > 0) {
    toast({
      variant: 'destructive',
      title: '请稍后再试',
      description: `请等待 ${countdown} 秒后再发送`,
    });
    return;
  }
  
  // 发送验证码...
  setCountdown(60);
};
```

### 2. 验证邮箱格式

```typescript
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

### 3. 防止暴力破解

- 限制验证码尝试次数
- 使用 Supabase Rate Limiting
- 添加图形验证码（可选）

### 4. 保护 SMTP 凭证

- 不要在代码中硬编码 SMTP 密码
- 使用 Supabase Dashboard 配置
- 定期更换 API Key

---

## 🎯 最佳实践

### 1. 邮件内容

- **清晰的主题**：例如"[时鲜管家] 验证您的邮箱"
- **友好的称呼**：例如"您好"
- **明确的说明**：告诉用户为什么收到这封邮件
- **突出的验证码**：使用大字体、加粗
- **有效期提示**：告知验证码有效期
- **联系方式**：提供客服联系方式

### 2. 用户体验

- **即时反馈**：发送后立即提示"验证码已发送"
- **倒计时**：显示重新发送倒计时
- **错误提示**：清晰的错误信息
- **自动填充**：支持从邮件复制粘贴

### 3. 性能优化

- **异步发送**：不阻塞用户操作
- **缓存策略**：避免重复发送
- **批量发送**：使用队列处理大量邮件

### 4. 监控和日志

- **记录发送日志**：时间、收件人、状态
- **监控送达率**：定期检查邮件送达情况
- **错误告警**：发送失败时及时通知

---

## 📚 相关文档

- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [Supabase Email OTP](https://supabase.com/docs/guides/auth/auth-email-otp)
- [SendGrid 文档](https://docs.sendgrid.com/)
- [阿里云邮件推送](https://help.aliyun.com/product/29412.html)

---

## 🆘 获取帮助

如果遇到问题：

1. **查看 Supabase Logs**
   - Dashboard → Logs → Auth Logs

2. **检查 SMTP 配置**
   - Dashboard → Project Settings → Auth → SMTP Settings

3. **查看邮件服务商日志**
   - SendGrid Dashboard
   - 阿里云控制台

4. **联系支持**
   - Supabase Support
   - 邮件服务商客服

---

**文档版本**: v1.0  
**最后更新**: 2025-11-19  
**维护者**: FreshGuard 开发团队
