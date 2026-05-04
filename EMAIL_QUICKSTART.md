# 邮箱验证快速配置（5分钟）

## 🚀 最简单的方式：使用 Supabase 内置邮件

### 步骤 1：启用邮箱验证（1 分钟）

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择您的项目
3. 进入 **Authentication** → **Providers**
4. 找到 **Email** 选项
5. 确保以下选项已开启：
   - ✅ **Enable Email provider**
   - ✅ **Confirm email**（要求验证邮箱）
6. 点击 **Save**

### 步骤 2：测试功能（2 分钟）

1. **启动应用**：
   ```bash
   npm run dev
   ```

2. **注册新账号**：
   - 访问 http://localhost:5173
   - 点击"立即注册"
   - 输入真实邮箱（例如：test@gmail.com）
   - 输入密码（至少 6 位）
   - 点击"注册账号"

3. **检查邮箱**：
   - 打开您的邮箱
   - 查找来自 Supabase 的邮件
   - 邮件主题：`Confirm Your Signup`
   - 复制邮件中的 6 位验证码

4. **输入验证码**：
   - 在应用中输入验证码
   - 点击"验证邮箱"
   - 验证成功后自动登录

### 步骤 3：测试忘记密码（2 分钟）

1. **退出登录**：
   - 点击右上角头像
   - 选择"退出登录"

2. **忘记密码**：
   - 在登录页面点击"忘记密码？"
   - 输入注册时的邮箱
   - 点击"忘记密码"

3. **检查邮箱**：
   - 打开邮箱
   - 查找重置密码邮件
   - 点击邮件中的重置链接

4. **重置密码**：
   - 输入新密码
   - 确认密码
   - 提交

5. **使用新密码登录**

---

## ✅ 完成！

现在您的应用已经支持：
- ✅ 邮箱注册
- ✅ 邮箱验证码
- ✅ 忘记密码
- ✅ 邮件重置密码

---

## ⚠️ 注意事项

### 1. 邮件可能在垃圾邮件文件夹

Supabase 内置邮件服务发送的邮件可能被标记为垃圾邮件。

**解决方案**：
- 检查垃圾邮件文件夹
- 将发件人添加到白名单
- 生产环境使用自定义 SMTP（见下文）

### 2. 发送限制

Supabase 免费邮件服务有限制：
- 约 30 封/小时
- 适合开发和测试
- 不适合生产环境

**解决方案**：
- 开发测试：使用内置邮件（当前配置）
- 生产环境：配置自定义 SMTP（见 EMAIL_VERIFICATION_GUIDE.md）

### 3. 验证码有效期

默认验证码有效期：1 小时

**修改方法**：
1. 进入 **Authentication** → **Settings**
2. 找到 **Email OTP expiry**
3. 修改为其他值（秒）
4. 点击 **Save**

---

## 🚀 生产环境配置（推荐）

如果要部署到生产环境，建议使用自定义 SMTP 服务：

### 推荐服务商

| 服务商 | 免费额度 | 配置难度 | 国内送达率 |
|--------|---------|---------|-----------|
| **SendGrid** | 100 封/天 | ⭐⭐ | ⭐⭐⭐ |
| **阿里云邮件推送** | 200 封/天 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **腾讯云邮件推送** | 1,000 封/月 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 快速配置 SendGrid（5 分钟）

1. **注册 SendGrid**：
   - 访问 https://sendgrid.com/
   - 注册免费账号

2. **创建 API Key**：
   - 进入 Settings → API Keys
   - 创建 Full Access API Key
   - 复制 API Key

3. **配置 Supabase**：
   - 进入 Project Settings → Auth
   - 滚动到 SMTP Settings
   - 填写：
     ```
     Host: smtp.sendgrid.net
     Port: 587
     Username: apikey
     Password: [您的 API Key]
     Sender email: noreply@yourdomain.com
     Sender name: 时鲜管家
     ```
   - 点击 Save

4. **测试发送**：
   - 注册新账号
   - 检查邮件是否正常发送

详细配置步骤见：`EMAIL_VERIFICATION_GUIDE.md`

---

## 🔍 故障排查

### 问题 1：收不到邮件

**检查清单**：
- [ ] 检查垃圾邮件文件夹
- [ ] 确认邮箱地址正确
- [ ] 查看 Supabase Logs（Dashboard → Logs → Auth Logs）
- [ ] 检查 SMTP 配置（如果使用自定义 SMTP）

### 问题 2：验证码错误

**可能原因**：
- 验证码过期（1 小时）
- 输入错误
- 邮箱地址不匹配

**解决方案**：
- 点击"重新发送"
- 仔细检查验证码
- 确认邮箱地址

### 问题 3：倒计时不工作

**检查**：
- 浏览器控制台是否有错误
- 刷新页面重试

---

## 📚 相关文档

- **详细配置**：`EMAIL_VERIFICATION_GUIDE.md`
- **Supabase 配置**：`SUPABASE_QUICKSTART.md`
- **完整指南**：`SUPABASE_GUIDE.md`

---

## 💡 提示

1. **开发环境**：使用 Supabase 内置邮件即可
2. **生产环境**：强烈建议配置自定义 SMTP
3. **国内用户**：推荐使用阿里云或腾讯云邮件推送
4. **国外用户**：推荐使用 SendGrid 或 Mailgun

---

**配置时间**: 5 分钟  
**难度**: ⭐⭐☆☆☆（简单）  
**文档版本**: v1.0
