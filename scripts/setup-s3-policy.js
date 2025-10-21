const {
  S3Client,
  PutBucketPolicyCommand,
  PutBucketAclCommand,
} = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

dotenv.config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

const bucketPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Sid: "PublicReadGetObject",
      Effect: "Allow",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
    },
  ],
};

async function setupBucketPolicy() {
  try {
    console.log(
      `🔧 Configurando política pública para o bucket: ${BUCKET_NAME}`
    );

    // Aplicar política de acesso público
    const policyCommand = new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy),
    });

    await s3Client.send(policyCommand);
    console.log("✅ Política de bucket aplicada com sucesso!");
    console.log("📋 Política aplicada:", JSON.stringify(bucketPolicy, null, 2));
  } catch (error) {
    console.error("❌ Erro ao configurar política do bucket:", error);

    if (error.name === "AccessDenied") {
      console.log("\n🚨 ATENÇÃO:");
      console.log(
        "Você precisa configurar as permissões do bucket S3 manualmente:"
      );
      console.log("1. Acesse o AWS Console S3");
      console.log("2. Vá até o bucket:", BUCKET_NAME);
      console.log('3. Aba "Permissions"');
      console.log('4. Desabilite "Block all public access"');
      console.log("5. Adicione a política bucket abaixo:\n");
      console.log(JSON.stringify(bucketPolicy, null, 2));
    }
  }
}

setupBucketPolicy();
