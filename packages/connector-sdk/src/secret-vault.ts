export interface SecretReference {
  key: string;
  provider: "environment" | "local-vault";
}

export class SecretVault {
  get(reference: SecretReference): string | undefined {
    if (reference.provider === "environment") {
      return process.env[reference.key];
    }

    throw new Error("Local encrypted vault is not implemented yet.");
  }

  has(reference: SecretReference): boolean {
    return Boolean(this.get(reference));
  }
}
