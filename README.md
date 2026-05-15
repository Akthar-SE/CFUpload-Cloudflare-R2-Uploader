# CFUpload-Cloudflare-R2-Uploader

![License](https://img.shields.io/github/license/Akthar-SE/CFUpload-Cloudflare-R2-Uploader?color=orange)
![Stars](https://img.shields.io/github/stars/Akthar-SE/CFUpload-Cloudflare-R2-Uploader?style=flat&logo=github)
![Issues](https://img.shields.io/github/issues/Akthar-SE/CFUpload-Cloudflare-R2-Uploader?color=brightgreen)

# Introducing CFUpload
<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/assets/brand/dark-logo.png">
    <source media="(prefers-color-scheme: light)" srcset="./public/assets/brand/light-logo.png">
    <img alt="CFUpload Logo" src="./public/brand/light-logo.png" width="300">
  </picture>
</p>

**CFUpload** is a high-performance, lightweight web application built to run at the edge using **Cloudflare Workers**. It provides a sleek, modern interface for managing files within **Cloudflare R2 Object Storage**, offering a cost-effective and ultra-fast alternative to traditional cloud storage dashboards.

Designed for developers and teams who value speed and simplicity, **CFUpload** eliminates the complexity of S3 management while taking full advantage of Cloudflare’s zero-egress fee model.

## 🚀 Features
* **Efficient File Uploads:** Seamlessly upload files of all sizes directly to your R2 buckets with optimized performance.
* **Upload From URL:** Save time and bandwidth by fetching files directly from a remote URL and storing them in your bucket..
* **Drag & Drop Interface:** Experience a modern web workflow—simply drag files into your browser to begin the upload process instantly.
* **Robust API Upload:** Integrate **CFUpload** into your own scripts or third-party applications using its lightweight API for programmatic management.
* **Comprehensive File Management:** Browse, organize, and delete your objects through a clean, intuitive, and responsive dashboard.
* **Lightweight Web Application:** Built as a Cloudflare Worker, the entire application scales automatically and runs within milliseconds of your users.

## Why CFUpload ?

Standard storage dashboards are often heavy and incur hidden costs. **CFUpload** is purpose-built to provide a "serverless" management experience that is easy to deploy, secure by default, and incredibly fast.

## 🏁 Quick Start

* **Clone the repository:**
   ```bash
   git clone https://github.com/Akthar-SE/CFUpload-Cloudflare-R2-Uploader.git

   cd CFUpload-Cloudflare-R2-Uploader

## ☁️ Cloudflare Setup
Setting up your Cloudflare environment is a straightforward process. Here is the quick-start guide to prepping your R2 storage for **CFUpload**:

### 1. Create a Cloudflare Account
Visit **https://dash.cloudflare.com** and sign up with your email. Once your email is verified, navigate to the R2 section in the sidebar menu. You may be prompted to add a payment method (R2 has a generous free tier, but a card is required to enable the service).

### 2. Create an R2 Bucket
* In the R2 dashboard, click **Create bucket**.
![Create Bucket](./screenshots/cloudflare-setup/step1_create_bucket.png)
* Give your bucket a unique name (e.g., **mybucket**).
![Bucket Name](./screenshots/cloudflare-setup/step2_bucket_name.png)
* Click **Create bucket** to finalize.
![Bucket Creation Finalize](./screenshots/cloudflare-setup/step3_finalize_bucket_creation.png)

### 3. Enable Public Development URL
* To access your files via a browser without a custom domain:
* Select your bucket and go to the **Settings** tab.
![Bucket Settings](./screenshots/cloudflare-setup/step4_bucket_settings.png)
![Bucket Settings Preview](./screenshots/cloudflare-setup/step5_bucket_settings_preview.png)
* Locate the **Public Development URL** section.
![Bucket Public Development URL](./screenshots/cloudflare-setup/step6_bucket_public_development_url.png)
* Click **Allow** and then toggle on the R2.dev Subdomain.
![Bucket Public Development URL](./screenshots/cloudflare-setup/step7_bucket_public_development_url_confirmation.png)
* Confirm to enable the Public Development URL and copy that url.
![Bucket Public Development URL Copy](./screenshots/cloudflare-setup/step8_bucket_public_development_url_copy.png)

### 4. Disable "Default Multipart Abort Rule"
* Cloudflare R2 automatically adds a lifecycle rule to delete incomplete multipart uploads after 7 days. To disable this:
* In your bucket settings, go to the **Object Lifecycle Rules** tab.
![Object Lifecycle Rules](./screenshots/cloudflare-setup/step9_bucket_object_lifecycle_rules.png)
* Find the rule titled **"Default Multipart Abort Rule"**.
![Object Lifecycle Rules Edit](./screenshots/cloudflare-setup/step10_bucket_object_lifecycle_rules_edit.png)
* Click the **Edit** (or three-dot) icon and toggle to disable.
![Default Multipart Abort Rule Preview](./screenshots/cloudflare-setup/step11_bucket_default_multipart_upload_rule_preview.png)
![Default Multipart Abort Rule Disable](./screenshots/cloudflare-setup/step12_bucket_default_multipart_upload_rule_disable.png)
![Default Multipart Abort Rule Disable Preview](./screenshots/cloudflare-setup/step13_bucket_default_multipart_upload_rule_disable_preview.png)

## 🏗️ Deployment
To get **CFUpload** up and running using npm, follow these quick steps to deploy your Worker to the Cloudflare network:

### 📦 Install the dependencies
1. **Install Dependencies:** 
    Navigate to your project directory and install the necessary packages.
    ```bash
    npm install
    ```
2. **Configure Wrangler:** Ensure your **wrangler.toml** is set up with your **Public Development URL** and your **R2 Bucket** name.
3. **Deploy:** 
    Run the deployment script to push your application to Cloudflare Workers.
    ```bash
    npx wrangler deploy
    ```
4. **Authorize Wrangler:** You will be prompted to open a Wrangler authentication access URL. Open this in the browser where you are logged into your Cloudflare account, review the requested permissions, and click **Authorize**.
![Wrangler Authorization](./screenshots/wrangler-authorization/step1_wrangler_authorization.png)
![Wrangler Review Permission](./screenshots/wrangler-authorization/step2_wrangler_authorization_review_permission.png)
![Wrangler Authorize Preview](./screenshots/wrangler-authorization/step3_wrangler_authorization_authorize_preview.png)
![Wrangler Authorize](./screenshots/wrangler-authorization/step4_wrangler_authorization_authorize.png)
![Wrangler Authorization Grated](./screenshots/wrangler-authorization/step5_wrangler_authorization_granted.png)
5. **Monitor Logs (Optional):**
    If you want to check real-time logs or debug the application, simply run the tail command after deployment:
    ```bash
    npx wrangler tail
    ```
6. **API Uploading:**
    To upload a file using standard Command Prompt (CMD) via curl, use the -F flag with the @ symbol to specify the file path.
    ```bash
    // Upload File Path
    curl --ssl-no-revoke -F "file=@C:\Documents\archive.zip" "https://cfupload.deploymeofficial.workers.dev/api/upload"

    // Upload File Path (Current Directory)
    curl --ssl-no-revoke -F "file=@archive.zip" "https://cfupload.deploymeofficial.workers.dev/api/upload"
    ```
Once the process completes, npm will provide you with a unique ***.workers**.dev URL where your management dashboard is live and ready to use.

## ⚡ Workers & Pages
![Cloudflare Workers & Pages](./screenshots/deployment/cloudflare_workers_and_pages_preview.png)

## 🖼️ Preview
**Homepage**
![CFUpload Main Preview](./screenshots/deployment/cfupload_worker_homepage_preview.png)

**Upload Result**
![CFUpload Upload Result Preview](./screenshots/deployment/cfupload_worker_upload_result_preview.png)

**My Files**
![CFUpload My Files Preview](./screenshots/deployment/cfupload_worker_myfiles_preview.png)

**Nigthmode**
![CFUpload My Files Nightmode Preview](./screenshots/deployment/cfupload_worker_myfiles_nightmode_preview.png)

## 🎥 Video Preview
https://github.com/user-attachments/assets/445d137a-48c8-4253-b909-cad00b7abf87

## [🚀 View Live Project](https://cfupload.deploymeofficial.workers.dev)

## ⚖️ License
* This project is licensed under MIT License. Feel free to use, modify, and distribute the code for your projects.

## 🤝 Support the Project
Contributions are welcome! Since **CFUpload** aims to stay lightweight, we prioritize optimizations that improve upload efficiency or UI performance without adding external dependencies. If you find this tool useful, feel free to ⭐ the repo!