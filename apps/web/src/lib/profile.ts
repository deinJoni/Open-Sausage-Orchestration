import {
  SOCIAL_KEYS,
  type SocialKey,
  WEB3_SOCIAL_KEYS,
  type Web3SocialKey,
} from "./constants";
import { getTextRecord, ipfsToHttp } from "./utils";

export type TextRecord = {
  key: string;
  value: string;
};

export type ProfileSocials = Partial<Record<SocialKey | Web3SocialKey, string>>;

export type ProfileInput = {
  ownerAddress: string;
  subdomain: { name: string; node: string } | null;
  rawTextRecords:
    | Array<{ key?: string | null; value?: string | null }>
    | null
    | undefined;
};

export type ArtistProfile = {
  address: string;
  subdomain: { name: string; node: string } | null;
  avatar: string;
  description: string;
  email: string;
  url: string;
  header: string;
  socials: ProfileSocials;
  textRecords: TextRecord[];
};

function normalizeTextRecords(
  records: ProfileInput["rawTextRecords"]
): TextRecord[] {
  if (!records) {
    return [];
  }
  return records.map((record) => ({
    key: record?.key ?? "",
    value: record?.value ?? "",
  }));
}

function buildSocials(records: TextRecord[]): ProfileSocials {
  const socials: ProfileSocials = {};
  for (const key of SOCIAL_KEYS) {
    const value = getTextRecord(records, key);
    if (value) {
      socials[key] = value;
    }
  }
  for (const key of WEB3_SOCIAL_KEYS) {
    const value = getTextRecord(records, key);
    if (value) {
      socials[key] = value;
    }
  }
  return socials;
}

export function buildProfile(input: ProfileInput): ArtistProfile {
  const textRecords = normalizeTextRecords(input.rawTextRecords);
  return {
    address: input.ownerAddress,
    subdomain: input.subdomain,
    avatar: ipfsToHttp(getTextRecord(textRecords, "avatar")),
    description: getTextRecord(textRecords, "description"),
    email: getTextRecord(textRecords, "email"),
    url: getTextRecord(textRecords, "url"),
    header: ipfsToHttp(getTextRecord(textRecords, "header")),
    socials: buildSocials(textRecords),
    textRecords,
  };
}
