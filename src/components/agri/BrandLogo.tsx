import logoAsset from "@/assets/uzhavan-thunai-logo.png.asset.json";

export function BrandLogo({ className = "" }: { className?: string }) {
  return <img src={logoAsset.url} alt="Uzhavan Thunai logo" width={1254} height={1254} className={`shrink-0 object-contain ${className}`} />;
}