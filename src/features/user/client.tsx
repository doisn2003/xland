"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import { useRouter } from "next/navigation";
import type { WireTypes, Session } from "./contract";
import { ApiError, entity, page, record, type Page } from "./wire";

export async function request(
  path: string,
  method = "GET",
  body?: unknown,
  key?: string,
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch("/api/xland" + path, {
      method,
      credentials: "same-origin",
      cache: "no-store",
      headers: {
        ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
        ...(key ? { "Idempotency-Key": key } : {}),
      },
      ...(method === "GET" ? {} : { body: JSON.stringify(body ?? {}) }),
      signal: AbortSignal.timeout(25000),
    });
  } catch {
    throw new ApiError(
      504,
      "NETWORK_ERROR",
      method === "GET"
        ? "Không thể kết nối. Vui lòng thử lại."
        : "Chưa nhận được kết quả. Giữ nguyên nội dung và thử lại để kiểm tra yêu cầu này.",
    );
  }
  let raw: Record<string, unknown>;
  try {
    raw = record(await response.json());
  } catch {
    throw new ApiError(
      502,
      "INVALID_RESPONSE",
      "Không thể đọc phản hồi của máy chủ.",
    );
  }
  if (!response.ok) {
    const error = record(raw.error);
    if (
      response.status === 401 &&
      path !== "/auth/session" &&
      !path.startsWith("/auth/")
    )
      window.dispatchEvent(new Event("xland-session-expired"));
    throw new ApiError(
      response.status,
      String(error.code),
      String(error.message),
      typeof raw.requestId === "string" ? raw.requestId : undefined,
      Array.isArray(error.details)
        ? (error.details as { field: string; code: string }[])
        : undefined,
      response.headers.get("retry-after") ?? undefined,
    );
  }
  return raw;
}
export async function getEntity<K extends keyof WireTypes>(
  path: string,
  type: K,
): Promise<WireTypes[K]> {
  return entity(record(await request(path)).data, type);
}
export async function getPage<K extends keyof WireTypes>(
  path: string,
  type: K,
): Promise<Page<WireTypes[K]>> {
  return page(await request(path), type);
}
export function useEntity<K extends keyof WireTypes>(
  path: string | null,
  type: K,
) {
  return useSWR(path, (p) => getEntity(p, type));
}
export function usePage<K extends keyof WireTypes>(
  path: string | null,
  type: K,
) {
  return useSWR(path, (p) => getPage(p, type));
}

const SessionContext = createContext<{
  session: Session | null;
  loading: boolean;
  error?: Error;
}>({ session: null, loading: true });
export const useSession = () => useContext(SessionContext);
let tabId = "";
function currentTab() {
  return (tabId ||= crypto.randomUUID());
}
export function useClock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
}
function SessionScope({ children }: { children: React.ReactNode }) {
  const { data, error, isLoading } = useSWR("/auth/session", async (path) => {
    try {
      return await getEntity(path, "Session");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null;
      throw error;
    }
  });
  const { mutate } = useSWRConfig();
  useEffect(() => {
    const expired = () => {
      void mutate(() => true, undefined, { revalidate: false });
      void mutate("/auth/session");
    };
    // Other tabs reload on login/logout so account-scoped caches never cross identities.
    const channel =
      typeof BroadcastChannel === "undefined"
        ? null
        : new BroadcastChannel("xland-session");
    if (channel)
      channel.onmessage = (event) => {
        if (event.data?.sender !== currentTab()) window.location.reload();
      };
    window.addEventListener("xland-session-expired", expired);
    return () => {
      channel?.close();
      window.removeEventListener("xland-session-expired", expired);
    };
  }, [mutate]);
  return (
    <SessionContext
      value={{ session: data ?? null, loading: isLoading, error }}
    >
      {children}
    </SessionContext>
  );
}
export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        shouldRetryOnError: false,
        revalidateOnFocus: true,
        dedupingInterval: 1500,
      }}
    >
      <SessionScope>{children}</SessionScope>
    </SWRConfig>
  );
}
export function sessionChanged(destination: string) {
  const channel =
    typeof BroadcastChannel === "undefined"
      ? null
      : new BroadcastChannel("xland-session");
  channel?.postMessage({ type: "changed", sender: currentTab() });
  channel?.close();
  window.location.assign(destination);
}
export function ErrorNotice({
  error,
  retry,
}: {
  error: unknown;
  retry?: () => void;
}) {
  if (!error) return null;
  const api = error instanceof ApiError ? error : null;
  return (
    <div className="user-notice error" role="alert">
      <p>{error instanceof Error ? error.message : "Không thể tải dữ liệu."}</p>
      {api?.details?.some((d) => d.code === "PRICE_MISMATCH") && (
        <p>
          Hãy tải lại hồ sơ để dùng giá hiện hành trước khi tính hoặc lưu kế
          hoạch.
        </p>
      )}
      {api?.requestId && <small>Mã yêu cầu: {api.requestId}</small>}
      {api?.retryAfter && <p>Vui lòng thử lại sau {api.retryAfter} giây.</p>}
      <div className="user-actions">
        {api?.status === 401 && <LoginLink />}
        {retry && (
          <button className="button secondary" type="button" onClick={retry}>
            Thử lại
          </button>
        )}
      </div>
    </div>
  );
}
export function LoginLink() {
  return (
    <Link
      className="button"
      href={
        "/dang-nhap?returnTo=" +
        encodeURIComponent(
          typeof window === "undefined"
            ? "/tai-khoan"
            : window.location.pathname + window.location.search,
        )
      }
    >
      Đăng nhập
    </Link>
  );
}
export function RequireSession({ children }: { children: React.ReactNode }) {
  const { session, loading, error } = useSession();
  return loading ? (
    <Loading />
  ) : error ? (
    <ErrorNotice error={error} />
  ) : !session ? (
    <div className="user-panel">
      <h2>Tiếp tục với tài khoản Xland</h2>
      <p>
        Dùng cùng tài khoản trên website và ứng dụng để xem dữ liệu của bạn.
      </p>
      <LoginLink />
    </div>
  ) : (
    children
  );
}
export function Loading() {
  return (
    <p className="user-notice" role="status">
      Đang tải…
    </p>
  );
}
export function Empty({
  children = "Chưa có nội dung.",
}: {
  children?: React.ReactNode;
}) {
  return <div className="user-empty">{children}</div>;
}
export function useMutation() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<unknown>(null),
    lock = useRef(false);
  const { mutate } = useSWRConfig();
  const pending = useRef(new Map<string, string>());
  async function run<T>(
    path: string,
    method: string,
    body: unknown,
    parse: (raw: unknown) => T,
    idempotent = false,
  ): Promise<T | undefined> {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError(null);
    let fingerprint: string | undefined;
    try {
      let key: string | undefined;
      if (idempotent) {
        const hash = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(path + JSON.stringify(body)),
        );
        fingerprint =
          "xland-request:" +
          Array.from(new Uint8Array(hash))
            .map((v) => v.toString(16).padStart(2, "0"))
            .join("");
        try {
          key = sessionStorage.getItem(fingerprint) ?? undefined;
        } catch {
          /* Memory fallback when browser storage is disabled. */
        }
        key ??= pending.current.get(fingerprint) ?? crypto.randomUUID();
        pending.current.set(fingerprint, key);
        try {
          sessionStorage.setItem(fingerprint, key);
        } catch {
          /* No contacts, payload or credentials are persisted. */
        }
      }
      const value = parse(await request(path, method, body, key));
      if (fingerprint) {
        pending.current.delete(fingerprint);
        try {
          sessionStorage.removeItem(fingerprint);
        } catch {}
      }
      void mutate(
        (k) =>
          typeof k === "string" &&
          (!k.startsWith("/auth/") || path === "/me/profile"),
        (value) => value,
        { revalidate: true },
      );
      return value;
    } catch (error) {
      setError(error);
      return undefined;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return { busy, error, run };
}
export function useFeatures() {
  return useSWR(
    "/capabilities",
    async (p) =>
      record(record(await request(p)).data) as {
        booking: boolean;
        events: boolean;
        googleClientId: string;
      },
  );
}
export function Toggle({
  path,
  active,
  label,
  count,
}: {
  path: string;
  active: boolean;
  label: string;
  count?: number;
}) {
  const { session, loading } = useSession(),
    mutation = useMutation(),
    router = useRouter();
  return (
    <span className="user-toggle">
      <button
        type="button"
        className="button secondary small"
        aria-pressed={active}
        disabled={mutation.busy || loading}
        onClick={async () => {
          if (!session) {
            router.push(
              "/dang-nhap?returnTo=" +
                encodeURIComponent(location.pathname + location.search),
            );
            return;
          }
          await mutation.run(path, active ? "DELETE" : "PUT", {}, (raw) =>
            entity(record(raw).data, "MutationResult"),
          );
        }}
      >
        {mutation.busy
          ? "Đang lưu…"
          : `${active ? "✓ " : ""}${label}${count === undefined ? "" : " · " + count}`}
      </button>
      <ErrorNotice error={mutation.error} />
    </span>
  );
}
export function Paged<K extends keyof WireTypes>({
  path,
  type,
  children,
  empty,
  refreshKey = "",
}: {
  path: string;
  type: K;
  children: (items: WireTypes[K][]) => React.ReactNode;
  empty?: string;
  refreshKey?: string;
}) {
  return (
    <PageContent key={path + refreshKey} path={path} type={type} empty={empty}>
      {children}
    </PageContent>
  );
}
function PageContent<K extends keyof WireTypes>({
  path,
  type,
  children,
  empty,
}: {
  path: string;
  type: K;
  children: (items: WireTypes[K][]) => React.ReactNode;
  empty?: string;
}) {
  const [cursor, setCursor] = useState<string | null>(null);
  const { data, error, isLoading, mutate } = usePage(
    path +
      (cursor
        ? (path.includes("?") ? "&" : "?") +
          "cursor=" +
          encodeURIComponent(cursor)
        : ""),
    type,
  );
  if (error)
    return (
      <ErrorNotice
        error={error}
        retry={() => {
          if (cursor) setCursor(null);
          else void mutate();
        }}
      />
    );
  if (isLoading || !data) return <Loading />;
  return (
    <>
      {!data.data.length ? <Empty>{empty}</Empty> : children(data.data)}
      <div className="user-actions pagination">
        {cursor && (
          <button className="button secondary" onClick={() => setCursor(null)}>
            Về trang đầu
          </button>
        )}
        {data.meta.hasMore && (
          <button
            className="button"
            onClick={() => setCursor(data.meta.nextCursor)}
          >
            Trang tiếp theo
          </button>
        )}
      </div>
    </>
  );
}
