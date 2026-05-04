# QQ 邮箱 SMTP 配置指南

## 📧 配置信息

您的 QQ 邮箱 SMTP 配置信息：

```
邮箱地址: 1353708458@qq.com
授权码: asxjqzkpnogyihaa
SMTP 服务器: smtp.qq.com
端口: 465 (SSL) 或 587 (TLS)
```

---

## 🚀 快速配置（3 分钟）

### 步骤 1：登录 Supabase Dashboard

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目（freshguard）
3. 进入 **Project Settings**（左下角齿轮图标）

### 步骤 2：配置 SMTP 设置

1. 在左侧菜单选择 **Auth**
2. 滚动到页面底部，找到 **SMTP Settings** 部分
3. 点击 **Enable Custom SMTP**
4. 填写以下信息：

```
Sender name: 时鲜管家
Sender email: 1353708458@qq.com

Host: smtp.qq.com
Port number: 465
Username: 1353708458@qq.com
Password: asxjqzkpnogyihaa

Minimum interval between emails being sent: 60 (秒)
```

5. 点击 **Save** 保存配置

### 步骤 3：测试邮件发送

1. **启动应用**：
   ```bash
   npm run dev
   ```

2. **注册新账号**：
   - 访问 http://localhost:5173
   - 点击"立即注册"
   - 输入测试邮箱（例如：test@example.com）
   - 输入密码（至少 6 位）
   - 再次输入密码确认
   - 点击"注册账号"

3. **检查邮箱**：
   - 打开测试邮箱
   - 查找来自 1353708458@qq.com 的邮件
   - 邮件主题：`Confirm Your Signup`
   - 复制邮件中的 6 位验证码

4. **完成验证**：
   - 在应用中输入验证码
   - 点击"验证邮箱"
   - 验证成功后自动登录

---

## 📊 配置详解

### SMTP 端口说明

QQ 邮箱支持两种端口：

| 端口 | 协议 | 说明 | 推荐 |
|------|------|------|------|
| **465** | SSL | 加密连接，更安全 | ✅ 推荐 |
| **587** | TLS | STARTTLS 加密 | ⭐ 备选 |

**建议使用 465 端口（SSL）**，安全性更高。

### 授权码说明

**什么是授权码？**
- 授权码是 QQ 邮箱提供的专用密码
- 用于第三方客户端登录
- 不是 QQ 密码

**您的授权码**：`asxjqzkpnogyihaa`

**注意**：
- ⚠️ 请妥善保管授权码，不要泄露
- ⚠️ 如果授权码泄露，请立即在 QQ 邮箱中重新生成

### 发件人信息

```
发件人名称: 时鲜管家
发件人邮箱: 1353708458@qq.com
```

用户收到的邮件将显示：
```
发件人: 时鲜管家 <1353708458@qq.com>
```

---

## 🔍 验证配置是否成功

### 方法 1：查看 Supabase Logs

1. 进入 Supabase Dashboard
2. 点击左侧 **Logs**
3. 选择 **Auth Logs**
4. 查找邮件发送记录
5. 检查是否有错误信息

### 方法 2：测试注册

1. 使用真实邮箱注册
2. 检查是否收到验证码邮件
3. 如果收到，说明配置成功 ✅

### 方法 3：检查垃圾邮件

如果没有收到邮件：
1. 检查垃圾邮件文件夹
2. 检查邮箱的拦截设置
3. 将 1353708458@qq.com 添加到白名单

---

## ⚠️ 常见问题

### Q1: 配置后收不到邮件？

**可能原因**：
1. SMTP 配置错误
2. 授权码输入错误
3. QQ 邮箱被限制发送
4. 收件人邮箱拦截

**解决方案**：
1. **检查配置**：
   - 确认 Host: `smtp.qq.com`
   - 确认 Port: `465`
   - 确认 Username: `1353708458@qq.com`
   - 确认 Password: `asxjqzkpnogyihaa`

2. **查看 Supabase Logs**：
   - Dashboard → Logs → Auth Logs
   - 查看错误信息

3. **检查 QQ 邮箱**：
   - 登录 QQ 邮箱
   - 检查是否有发送失败的邮件
   - 检查是否被限制发送

4. **测试其他邮箱**：
   - 尝试发送到 Gmail、163 等不同邮箱
   - 确认是否是收件人邮箱的问题

### Q2: 提示"SMTP 认证失败"？

**原因**：授权码错误或过期

**解决方案**：
1. 确认授权码：`asxjqzkpnogyihaa`
2. 如果不对，重新生成授权码：
   - 登录 QQ 邮箱
   - 设置 → 账户 → POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务
   - 生成新的授权码
   - 更新 Supabase SMTP 配置

### Q3: 邮件被标记为垃圾邮件？

**原因**：QQ 邮箱的发件人信誉度

**解决方案**：
1. **短期方案**：
   - 提醒用户检查垃圾邮件文件夹
   - 将发件人添加到白名单

2. **长期方案**：
   - 使用企业邮箱（更高信誉度）
   - 配置 SPF、DKIM、DMARC 记录
   - 使用专业邮件服务（SendGrid、阿里云等）

### Q4: QQ 邮箱有发送限制吗？

**是的，QQ 邮箱有发送限制**：

| 限制类型 | 限制值 |
|---------|--------|
| 每天发送量 | 约 500 封 |
| 每小时发送量 | 约 50 封 |
| 单次发送量 | 约 20 封 |

**超过限制会怎样？**
- 邮件发送失败
- 可能被临时限制发送
- 严重时可能被封禁

**建议**：
- 开发测试：QQ 邮箱足够
- 生产环境：使用专业邮件服务

### Q5: 如何更换发件邮箱？

**步骤**：
1. 准备新的邮箱和授权码
2. 登录 Supabase Dashboard
3. 进入 Project Settings → Auth → SMTP Settings
4. 更新邮箱和授权码
5. 点击 Save
6. 测试新配置

### Q6: 授权码忘记了怎么办？

**解决方案**：
1. 登录 QQ 邮箱（https://mail.qq.com）
2. 点击右上角 **设置**
3. 选择 **账户**
4. 找到 **POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务**
5. 点击 **生成授权码**
6. 按提示完成验证
7. 复制新的授权码
8. 更新 Supabase SMTP 配置

---

## 🎨 自定义邮件模板

### 修改邮件内容

1. 进入 Supabase Dashboard
2. 选择 **Authentication** → **Email Templates**
3. 选择要修改的模板：
   - **Confirm signup** - 注册验证邮件
   - **Magic Link** - 魔法链接邮件
   - **Change Email Address** - 更改邮箱验证
   - **Reset Password** - 重置密码邮件

### 注册验证邮件模板示例

```html
<h2>欢迎注册时鲜管家！</h2>
<p>感谢您注册时鲜管家，这是一款智能食材保质期管理应用。</p>
<p>请使用以下验证码完成注册：</p>
<div style="background: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
  <h1 style="color: #22c55e; font-size: 32px; margin: 0;">{{ .Token }}</h1>
</div>
<p>此验证码将在 <strong>1 小时</strong>后过期。</p>
<p>如果您没有注册时鲜管家，请忽略此邮件。</p>
<hr>
<p style="color: #666; font-size: 12px;">
  此邮件由时鲜管家自动发送，请勿回复。<br>
  如有问题，请联系客服。
</p>
```

### 可用变量

- `{{ .Token }}` - 验证码（6 位数字）
- `{{ .SiteURL }}` - 网站 URL
- `{{ .ConfirmationURL }}` - 确认链接
- `{{ .Email }}` - 用户邮箱

---

## 📈 监控和统计

### 查看发送统计

**Supabase Dashboard**：
1. 进入 **Logs** → **Auth Logs**
2. 筛选邮件相关日志
3. 查看发送成功/失败数量

**QQ 邮箱**：
1. 登录 QQ 邮箱
2. 查看 **已发送** 文件夹
3. 查看发送历史

### 监控指标

建议监控以下指标：
- 📊 发送成功率
- 📊 发送失败率
- 📊 每日发送量
- 📊 用户验证成功率

---

## 🔐 安全建议

### 1. 保护授权码

- ❌ 不要在代码中硬编码授权码
- ❌ 不要将授权码提交到 Git
- ✅ 只在 Supabase Dashboard 中配置
- ✅ 定期更换授权码

### 2. 限制发送频率

在代码中已实现 60 秒倒计时：
```typescript
const [countdown, setCountdown] = useState(0);

// 发送验证码后
setCountdown(60);
```

### 3. 验证邮箱格式

```typescript
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

### 4. 防止滥用

- 限制单个 IP 的注册次数
- 添加图形验证码（可选）
- 监控异常发送行为

---

## 🚀 生产环境建议

### 当前配置适用场景

✅ **适合**：
- 个人项目
- 小型应用（< 100 用户/天）
- 开发测试环境

⚠️ **不适合**：
- 大型应用（> 500 用户/天）
- 商业项目
- 需要高送达率的场景

### 升级方案

如果需要更好的邮件服务，建议升级到：

| 服务商 | 免费额度 | 送达率 | 国内速度 | 推荐度 |
|--------|---------|--------|---------|--------|
| **阿里云邮件推送** | 200 封/天 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **腾讯云邮件推送** | 1,000 封/月 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **SendGrid** | 100 封/天 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

详细配置见：`EMAIL_VERIFICATION_GUIDE.md`

---

## 📋 配置检查清单

配置完成后，请检查以下项目：

- [ ] SMTP Host 设置为 `smtp.qq.com`
- [ ] SMTP Port 设置为 `465`
- [ ] Username 设置为 `1353708458@qq.com`
- [ ] Password 设置为 `asxjqzkpnogyihaa`
- [ ] Sender email 设置为 `1353708458@qq.com`
- [ ] Sender name 设置为 `时鲜管家`
- [ ] 点击 Save 保存配置
- [ ] 测试注册功能
- [ ] 检查是否收到验证码邮件
- [ ] 验证码可以正常使用
- [ ] 忘记密码功能正常

---

## 💡 提示

1. **首次配置**：建议先在测试环境验证配置正确
2. **定期检查**：定期检查 QQ 邮箱是否正常
3. **备份授权码**：将授权码保存在安全的地方
4. **监控发送**：定期查看发送统计，避免超限
5. **用户提醒**：在应用中提示用户检查垃圾邮件

---

## 📚 相关文档

- **邮箱验证功能**：`EMAIL_VERIFICATION_GUIDE.md`
- **快速配置**：`EMAIL_QUICKSTART.md`
- **Supabase 配置**：`SUPABASE_GUIDE.md`

---

## 🆘 需要帮助？

如果遇到问题：

1. **查看日志**：
   - Supabase Dashboard → Logs → Auth Logs

2. **检查配置**：
   - 对照本文档检查每一项配置

3. **测试连接**：
   - 使用邮件客户端测试 SMTP 连接

4. **联系支持**：
   - Supabase Support
   - QQ 邮箱客服

---

**配置时间**: 3 分钟  
**难度**: ⭐⭐☆☆☆（简单）  
**文档版本**: v1.0  
**最后更新**: 2025-11-19
