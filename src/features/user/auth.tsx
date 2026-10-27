"use client";
import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { entity, record, returnTo, dateTime } from "./wire";
import {
  request,
  useSession,
  RequireSession,
  useEntity,
  useMutation,
  ErrorNotice,
  Loading,
  sessionChanged,
  useFeatures,
  useClock,
} from "./client";
import { AccountNav, formText, UserShell } from "./ui";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              type: string;
              theme: string;
              size: string;
              locale: string;
            },
          ) => void;
        };
      };
    };
  }
}
function GoogleLogin({
  clientId,
  destination,
}: {
  clientId: string;
  destination: string;
}) {
  const [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    host = useRef<HTMLDivElement>(null),
    mutation = useMutation();
  const run = useRef(mutation.run);
  useEffect(() => {
    run.current = mutation.run;
  });
  useEffect(() => {
    if (!ready || !window.google || !host.current) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      auto_select: false,
      callback: (response) => {
        void run
          .current(
            "/auth/google/sessions",
            "POST",
            { idToken: response.credential },
            (raw) => entity(record(raw).data, "Session"),
          )
          .then((session) => {
            if (session) sessionChanged(destination);
          });
      },
    });
    window.google.accounts.id.renderButton(host.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      locale: "vi",
    });
  }, [ready, clientId, destination]);
  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onReady={() => setReady(true)}
        onError={() => setFailed(true)}
      />
      <div ref={host} />
      <p>
        {failed
          ? "Không tải được đăng nhập Google. Hãy tải lại trang hoặc dùng phương thức khác."
          : !ready
            ? "Đang tải đăng nhập Google…"
            : mutation.busy
              ? "Đang đăng nhập…"
              : ""}
      </p>
      <ErrorNotice error={mutation.error} />
    </>
  );
}
export function Login({ destination }: { destination?: string }) {
  const now = useClock();
  const target = returnTo(destination),
    mutation = useMutation(),
    features = useFeatures();
  const { data: capabilities, error: capError } = useSWR(
    "/auth/capabilities",
    async (p) => record(record(await request(p)).data),
  );
  const google = capabilities && record(capabilities.google).enabled === true;
  const phone = capabilities && record(capabilities.phoneOtp).enabled === true;
  const [challenge, setChallenge] = useState<{
    id: string;
    phone: string;
    expiresAt: string;
    resendAt: string;
  } | null>(null);
  const { session } = useSession();
  return (
    <UserShell
      title="Đăng nhập Xland"
      intro="Tiếp nối hành trình của bạn trên website và ứng dụng."
    >
      <div className="user-panel user-narrow">
        {session && (
          <p>
            Bạn đang đăng nhập với {session.profile.displayName}.{" "}
            <Link className="text-link" href={target}>
              Tiếp tục →
            </Link>
          </p>
        )}
        <ErrorNotice error={capError} />
        {capabilities?.usernamePassword === true && (
          <form
            className="user-form"
            onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const session = await mutation.run(
                "/auth/sessions",
                "POST",
                {
                  username: formText(f, "username"),
                  password: String(f.get("password") ?? ""),
                },
                (raw) => entity(record(raw).data, "Session"),
              );
              if (session) sessionChanged(target);
            }}
          >
            <label>
              Tên đăng nhập
              <input
                name="username"
                required
                autoComplete="username"
                maxLength={64}
              />
            </label>
            <label>
              Mật khẩu
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                minLength={8}
                maxLength={128}
              />
            </label>
            <button className="button" disabled={mutation.busy}>
              Đăng nhập
            </button>
          </form>
        )}
        <ErrorNotice error={mutation.error} />
        {!capabilities && !capError && <Loading />}
        {google && features.data?.googleClientId ? (
          <div className="user-panel">
            <GoogleLogin
              clientId={features.data.googleClientId}
              destination={target}
            />
          </div>
        ) : google ? (
          <p className="user-notice">
            Đăng nhập Google trên website chưa được cấu hình.
          </p>
        ) : null}
        {phone && (
          <div className="user-panel">
            <h2>Đăng nhập bằng số điện thoại</h2>
            <form
              className="user-form"
              onSubmit={async (e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const result = await mutation.run(
                  "/auth/phone/challenges",
                  "POST",
                  { phone: formText(f, "phone") },
                  (raw) => record(record(raw).data),
                  true,
                );
                if (result)
                  setChallenge({
                    id: String(result.challengeId),
                    phone: String(result.maskedPhone),
                    expiresAt: String(result.expiresAt),
                    resendAt: String(result.resendAt),
                  });
              }}
            >
              <label>
                Số điện thoại
                <input type="tel" name="phone" required />
              </label>
              <button
                className="button secondary"
                disabled={
                  mutation.busy ||
                  (!!challenge && Date.parse(challenge.resendAt) > now)
                }
              >
                Gửi mã xác nhận
              </button>
            </form>
            {challenge && (
              <form
                className="user-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  const session = await mutation.run(
                    "/auth/phone/sessions",
                    "POST",
                    { challengeId: challenge.id, code: formText(f, "code") },
                    (raw) => entity(record(raw).data, "Session"),
                  );
                  if (session) sessionChanged(target);
                }}
              >
                <p>
                  Mã gửi đến {challenge.phone}, hết hạn{" "}
                  {dateTime(challenge.expiresAt)}.
                </p>
                <label>
                  Mã xác nhận
                  <input
                    name="code"
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </label>
                <button className="button" disabled={mutation.busy}>
                  Xác nhận mã
                </button>
              </form>
            )}
          </div>
        )}
        {capabilities && !phone && (
          <p className="user-notice">
            Đăng nhập bằng số điện thoại chưa khả dụng.
          </p>
        )}
      </div>
    </UserShell>
  );
}
export function Account({ settings = false }: { settings?: boolean }) {
  return (
    <UserShell title={settings ? "Cài đặt tài khoản" : "Tài khoản của bạn"}>
      <AccountNav />
      <RequireSession>{settings ? <Settings /> : <Profile />}</RequireSession>
    </UserShell>
  );
}
function Profile() {
  const { data, error, mutate } = useEntity("/me/profile", "UserProfile"),
    mutation = useMutation();
  const [saved, setSaved] = useState(false);
  return error ? (
    <ErrorNotice error={error} retry={() => void mutate()} />
  ) : !data ? (
    <Loading />
  ) : (
    <div className="user-panel user-narrow">
      <form
        key={data.updatedAt}
        className="user-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setSaved(false);
          const f = new FormData(e.currentTarget),
            phone = formText(f, "phone");
          const payload: Record<string, unknown> = {
            displayName: formText(f, "name"),
            contactPhone: phone || null,
          };
          if (f.has("clearAvatar")) payload.avatarUrl = null;
          const result = await mutation.run(
            "/me/profile",
            "PATCH",
            payload,
            (raw) => entity(record(raw).data, "UserProfile"),
          );
          if (result) {
            setSaved(true);
            void mutate();
          }
        }}
      >
        <label>
          Tên hiển thị
          <input
            name="name"
            required
            maxLength={100}
            defaultValue={data.displayName}
            autoComplete="name"
          />
        </label>
        <label>
          Điện thoại liên hệ
          <input
            name="phone"
            type="tel"
            defaultValue={data.contactPhone ?? ""}
            pattern="(0[0-9]{9}|\+[1-9][0-9]{8,14})"
            autoComplete="tel"
          />
        </label>
        <p>
          Số liên hệ không thay đổi phương thức đăng nhập.{" "}
          {data.contactVerified
            ? "Số điện thoại đã xác minh."
            : "Số điện thoại chưa xác minh."}
        </p>
        {data.avatarUrl && (
          <label className="checkbox">
            <input type="checkbox" name="clearAvatar" />
            Xóa ảnh đại diện hiện tại
          </label>
        )}
        <button className="button" disabled={mutation.busy}>
          Lưu hồ sơ
        </button>
        {saved && <p role="status">Đã cập nhật hồ sơ.</p>}
        <ErrorNotice error={mutation.error} />
      </form>
      <div className="user-actions">
        <button
          className="button secondary"
          disabled={mutation.busy}
          onClick={async () => {
            const result = await mutation.run(
              "/auth/sessions/current",
              "DELETE",
              {},
              () => true,
            );
            if (result) sessionChanged("/");
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
function Settings() {
  const { data, error } = useEntity("/me/settings", "UserSettings"),
    mutation = useMutation(),
    [saved, setSaved] = useState(false);
  return error ? (
    <ErrorNotice error={error} />
  ) : !data ? (
    <Loading />
  ) : (
    <div className="user-panel user-narrow">
      <form
        key={data.updatedAt}
        className="user-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setSaved(false);
          const f = new FormData(e.currentTarget);
          const result = await mutation.run(
            "/me/settings",
            "PATCH",
            {
              notificationConsent: f.has("notificationConsent"),
              feedAutoplay: f.has("feedAutoplay"),
              feedMutedByDefault: f.has("feedMutedByDefault"),
            },
            (raw) => entity(record(raw).data, "UserSettings"),
          );
          if (result) setSaved(true);
        }}
      >
        {[
          ["notificationConsent", "Đồng ý nhận thông báo"],
          ["feedAutoplay", "Tự phát video"],
          ["feedMutedByDefault", "Tắt tiếng video khi bắt đầu"],
        ].map(([name, label]) => (
          <label className="checkbox" key={name}>
            <input
              type="checkbox"
              name={name}
              defaultChecked={data[name as "feedAutoplay"]}
            />
            {label}
          </label>
        ))}
        <p>
          Múi giờ: {data.timeZone}. Ngôn ngữ: {data.locale}.
        </p>
        <button className="button" disabled={mutation.busy}>
          Lưu cài đặt
        </button>
        {saved && <p role="status">Đã lưu cài đặt.</p>}
        <ErrorNotice error={mutation.error} />
      </form>
    </div>
  );
}
