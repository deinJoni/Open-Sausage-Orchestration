/**
 * Resolve IPFS URLs to HTTP gateway URLs
 * Converts ipfs:// protocol URLs to https://ipfs.io gateway
 */
export function resolveIPFS(url: string | undefined): string {
  if (!url) {
    return "";
  }

  if (url.startsWith("ipfs://")) {
    const hash = url.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${hash}`;
  }

  return url;
}
