

"use server";

import { supabaseAdmin } from "@/lib/supabase";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_RELEASES_REPO || "swatantra001/srilal-csc-releases";

export async function createGitHubRelease(formData: FormData) {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN not configured");

  const file = formData.get("file") as File;
  const version = formData.get("version") as string;
  const releaseNotes = (formData.get("releaseNotes") as string) || "";

  if (!file || !version) throw new Error("Missing file or version");
  
  console.log(`[Upload] Starting upload for ${file.name} (${file.size} bytes), version ${version}`);

  const tagName = `v${version}`;
  const releaseName = `SriLal CSC v${version}`;
  const [major, minor, patch] = version.split(".").map(Number);

  try {
    // 1. Delete existing release if any
    const existingRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/tags/${tagName}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (existingRes.status === 200) {
      const existing = await existingRes.json();
      console.log(`[Upload] Deleting existing release ${existing.id}`);
      
      await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/releases/${existing.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/git/refs/tags/${tagName}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
    }

    // 2. Create release
    console.log(`[Upload] Creating release ${tagName}`);
    const createRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tag_name: tagName,
          name: releaseName,
          body: releaseNotes || `Release ${tagName}`,
          draft: false,
          prerelease: false,
          generate_release_notes: false,
        }),
      }
    );

    if (!createRes.ok) {
      const err = await createRes.json();
      console.error("[Upload] Create release failed:", err);
      throw new Error(`GitHub API error: ${err.message || createRes.statusText}`);
    }

    const release = await createRes.json();
    console.log(`[Upload] Release created: ${release.id}, upload_url: ${release.upload_url}`);

    // 3. Upload APK
    const uploadUrl = release.upload_url.replace(
      "{?name,label}",
      `?name=${encodeURIComponent(file.name)}`
    );
    console.log(`[Upload] Upload URL: ${uploadUrl}`);
    
    const arrayBuffer = await file.arrayBuffer();
    console.log(`[Upload] File loaded: ${arrayBuffer.byteLength} bytes`);

    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/vnd.android.package-archive",
      },
      body: arrayBuffer,
    });

    console.log(`[Upload] Upload response status: ${uploadRes.status}`);
    
    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("[Upload] Upload failed:", errText);
      throw new Error(`Upload failed: ${uploadRes.status} ${uploadRes.statusText}`);
    }

    const asset = await uploadRes.json();
    console.log(`[Upload] Asset uploaded: ${asset.browser_download_url}`);

    // 4. Save to Supabase
    const { error: dbError } = await supabaseAdmin
      .from("app_versions")
      .insert({
        major_version: major,
        minor_version: minor,
        patch_version: patch,
        apk_url: asset.browser_download_url,
        release_notes: releaseNotes,
        github_release_id: release.id,
      });

    if (dbError) {
      console.error("[Upload] DB insert failed:", dbError);
      throw dbError;
    }

    console.log(`[Upload] Success! Download: ${asset.browser_download_url}`);
    
    return {
      success: true,
      version,
      tagName,
      downloadUrl: asset.browser_download_url,
      size: asset.size,
      releaseId: release.id,
    };
  } catch (error: any) {
    console.error("[Upload] Fatal error:", error);
    throw new Error(error.message || "Failed to create GitHub release");
  }
}

export async function getLatestGitHubRelease() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      { headers, next: { revalidate: 300 } }
    );

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`GitHub API: ${res.statusText}`);
    }

    const release = await res.json();
    const apkAsset = release.assets.find(
      (a: any) => a.name.endsWith(".apk") || a.content_type === "application/vnd.android.package-archive"
    );
    if (!apkAsset) return null;

    return {
      version: release.tag_name.replace(/^v/, ""),
      downloadUrl: apkAsset.browser_download_url,
      size: apkAsset.size,
      publishedAt: release.published_at,
      releaseNotes: release.body,
    };
  } catch (error: any) {
    console.error("Failed to fetch latest release:", error);
    return null;
  }
}

export async function listGitHubReleases() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases`,
      { headers, next: { revalidate: 60 } }
    );

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function deleteGitHubRelease(releaseId: number) {
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN required");

  const getRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/releases/${releaseId}`,
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  if (!getRes.ok) return false;
  const release = await getRes.json();

  const delRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/releases/${releaseId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (delRes.ok && release.tag_name) {
    await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/git/refs/tags/${release.tag_name}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
  }

  return delRes.ok;
}