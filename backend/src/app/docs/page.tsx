"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function DocsPage() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    fetch("/api/docs")
      .then((r) => r.json())
      .then(setSpec)
      .catch(() => setSpec(null));
  }, []);

  if (!spec) return <div style={{ padding: 16 }}>Loading Swagger docs...</div>;

  return <SwaggerUI spec={spec} />;
}