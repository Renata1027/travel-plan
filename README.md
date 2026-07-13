# 旅行计事本

给男朋友看的旅行计划页面。纯静态网页，无需构建工具。

## 本地预览

直接双击打开 `index.html`，或者在项目目录下运行：

    npx serve .

然后在浏览器打开命令行里打印出的地址。

## 运行测试

    npm test

跑的是 `js/budget.js`、`js/route-svg.js`、`js/data.js` 这几个纯逻辑模块的单元测试（Node 内置测试框架，不需要额外安装依赖）。要求 Node.js >= 18。

## 上线前需要你自己做的三件事

Claude 不会替你注册第三方账号，以下步骤需要你自己完成：

1. **申请免费表单服务（用来接收男朋友的留言/批准预算）**
   - 打开 https://formspree.io ，免费注册一个账号，创建一个新表单。
   - 复制它给你的表单地址，格式类似 `https://formspree.io/f/xxxxxxx`。
   - 把这个地址发给 Claude，或者自己打开 `js/app.js`，把顶部的 `FORM_ENDPOINT` 常量替换成这个真实地址。
   - 替换后，重新打开页面测试一下"批准预算"或"发送留言"，应该会显示"已发送！"，并且你的邮箱（renata.rt.1027@gmail.com）能收到一封通知邮件。

2. **建一个 GitHub 仓库并把代码推上去**
   - 在 https://github.com 上新建一个仓库（比如叫 `travel-plan`）。
   - 按 GitHub 给出的提示，把这个本地项目 push 上去。

3. **用 Vercel 部署（免费）**
   - 打开 https://vercel.com ，可以直接用 GitHub 账号登录。
   - 选择"Import Project"，选中刚才的 GitHub 仓库。
   - 因为是纯静态网站，Vercel 会自动识别，不需要填构建命令，直接点部署即可。
   - 部署完成后会拿到一个形如 `https://travel-plan-xxxx.vercel.app` 的链接，这个链接可以直接发给男朋友。

## 之后怎么更新内容

把新的行程内容告诉 Claude，由 Claude 修改 `js/data.js` 并帮你 `git push`；Vercel 检测到仓库更新后会自动重新部署，链接不会变。
