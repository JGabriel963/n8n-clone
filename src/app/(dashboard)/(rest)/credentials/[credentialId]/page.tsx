import React from "react";

interface PageProps {
  params: Promise<{ credentialId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { credentialId } = await params;

  return <div>Credential {credentialId}</div>;
}
