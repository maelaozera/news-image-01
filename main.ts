import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const IMAGE_NAME = "entry.png";
const OUTPUT_DIR_ENV = "MAKEFUN_OUTPUT_DIR";
const FALLBACK_OUTPUT_DIR = "/output";

function fingerprint(filePath: string): string {
  const hasher = createHash("sha256");
  hasher.update(readFileSync(filePath));
  return hasher.digest("hex");
}

function run(): void {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const origin = resolve(scriptDir, IMAGE_NAME);
  const destinationDir = resolve(
    process.env[OUTPUT_DIR_ENV] ?? FALLBACK_OUTPUT_DIR,
  );
  const destination = join(destinationDir, IMAGE_NAME);

  if (!existsSync(origin)) {
    throw new Error(`Source image not found: ${origin}`);
  }
  const originSize = statSync(origin).size;
  if (originSize === 0) {
    throw new Error(`Source image is empty: ${origin}`);
  }

  mkdirSync(destinationDir, { recursive: true });
  copyFileSync(origin, destination);

  const originFingerprint = fingerprint(origin);
  const destinationFingerprint = fingerprint(destination);
  if (originFingerprint !== destinationFingerprint) {
    throw new Error(
      `Copy verification failed: ${originFingerprint} != ${destinationFingerprint}`,
    );
  }
  const destinationSize = statSync(destination).size;
  if (destinationSize !== originSize) {
    throw new Error(
      `Size mismatch after copy: ${originSize} != ${destinationSize}`,
    );
  }

  console.log(
    `Copied ${IMAGE_NAME} to ${destination} (sha256 ${destinationFingerprint})`,
  );
}

run();
