# andasy.hcl app configuration file generated for jobportal on Wednesday, 15-Apr-26 15:36:59 CAT
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "jobportal"

app {

  env = {
    ADMIN_EMAIL="admin@tech.com"
    ADMIN_PASS="klab@2026"
    ADMIN_USERNAME="admin"
    ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173,https://job-portal-front-topaz.vercel.app"
    CLOUDINARY_API_KEY="492548582171892"
    CLOUDINARY_API_SECRET="a7b1bBUdr6tc_alU_qdZrZrLqCk"
    CLOUDINARY_CLOUD_NAME="dvm7ocouc"
    EMAIL_FROM="tresormugisha07@gmail.com"
    EMAIL_HOST="smtp.gmail.com"
    EMAIL_PASSWORD="xadnvczsubuhlrbz"
    EMAIL_PORT="587"
    EMAIL_USER="tresormugisha07@gmail.com"
    EXPIRATION_TOKEN="1d"
    JWT_EXPIRES_IN="14d"
    JWT_SECRET="a3f8c2e1d4b7a9f0e5c8d2b1a4f7e0c3d6b9a2f5e8c1d4b7a0f3e6c9d2b5a8"
    MONGO_URI="mongodb+srv://tresormugisha07_db_user:abukXulTINQe1p7S@cluster3.ptayz6x.mongodb.net/?appName=Cluster3"
    PORT=5000
    REFRESH_TOKEN_EXPIRES_IN="7d"
    REFRESH_TOKEN_SECRET="b4g9d3f2e5c8a1d4b7e0c3f6a9d2b5e8c1f4a7d0b3e6c9f2a5d8b1e4c7f0a3"
    RESEND_API_KEY="re_hT7wFSyQ_KRk4DEsc84xxZtMEBs7JfCQZw"
    SALT_ROUNDS="12"
    SMTP_SECURE="true"
  }

  port = 5000

  primary_region = "fsn"

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "jobportal"
  }

}
