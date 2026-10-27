"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FeedVideo, ShareLink } from "./contract";
import { dateTime, entity, record, safeUrl } from "./wire";
import {
  ErrorNotice,
  Loading,
  Paged,
  RequireSession,
  Toggle,
  useEntity,
  useMutation,
  useSession,
  request,
} from "./client";
import { AccountNav, formText, Media, PropertyGrid, UserShell } from "./ui";
import { categories, regions } from "./labels";

export function Share({ path }: { path: string }) {
  const [link, setLink] = useState<ShareLink | null>(null),
    [error, setError] = useState<unknown>(null),
    [copied, setCopied] = useState(false);
  return (
    <span>
      <button
        className="button secondary small"
        type="button"
        onClick={async () => {
          setError(null);
          try {
            const value = entity(
              record(await request(path + "/share")).data,
              "ShareLink",
            );
            setLink(value);
            if (navigator.share) {
              try {
                await navigator.share({ title: value.title, url: value.url });
              } catch (e) {
                if (!(e instanceof Error && e.name === "AbortError")) throw e;
              }
            } else if (navigator.clipboard) {
              await navigator.clipboard.writeText(value.url);
              setCopied(true);
            }
          } catch (e) {
            setError(e);
          }
        }}
      >
        Chia sẻ
      </button>
      {link && (
        <a
          className="text-link"
          href={link.url}
          target="_blank"
          rel="noreferrer"
        >
          {copied ? "Đã sao chép liên kết" : "Mở liên kết chia sẻ"}
        </a>
      )}
      <ErrorNotice error={error} />
    </span>
  );
}
export function VideoCard({
  video,
  full = false,
}: {
  video: FeedVideo;
  full?: boolean;
}) {
  const { session } = useSession(),
    settings = useEntity(session ? "/me/settings" : null, "UserSettings");
  const [comments, setComments] = useState(false);
  return (
    <article className="user-panel">
      <div className="user-video">
        <Media
          key={video.media.id}
          asset={video.media}
          title={video.caption}
          autoplay={!!full && !!settings.data?.feedAutoplay}
          muted={settings.data?.feedMutedByDefault ?? true}
        />
      </div>
      <h2>
        <Link href={`/video/${video.id}`}>{video.caption}</Link>
      </h2>
      <p>
        <Link className="text-link" href={`/nguoi-dang/${video.author.id}`}>
          {video.author.displayName}
        </Link>{" "}
        · {video.author.role ?? "Người đăng"}
      </p>
      <p>
        {video.property.title} · {video.approximateArea}
      </p>
      <div className="user-actions">
        <Toggle
          path={`/videos/${video.id}/like`}
          active={!!session && video.isLiked}
          label="Thích"
          count={video.likeCount}
        />
        <Toggle
          path={`/videos/${video.id}/saved`}
          active={!!session && video.isSaved}
          label="Lưu video"
        />
        <Share path={`/videos/${video.id}`} />
      </div>
      <div className="user-actions">
        <Link className="button" href={`/lo-dat/${video.propertyId}`}>
          Hồ sơ lô đất
        </Link>
        <Link
          className="button secondary"
          href={`/lich-hen?propertyId=${video.propertyId}&sourceVideoId=${video.id}`}
        >
          Đặt lịch xem
        </Link>
        <button
          className="button secondary"
          type="button"
          aria-expanded={comments}
          onClick={() => setComments((v) => !v)}
        >
          Bình luận ({video.commentCount})
        </button>
      </div>
      {comments && <Comments videoId={video.id} />}
    </article>
  );
}
export function Feed({ id }: { id?: string }) {
  const [scope, setScope] = useState("recommended"),
    [region, setRegion] = useState(""),
    [category, setCategory] = useState("");
  const query = new URLSearchParams({
    feedScope: scope,
    limit: "6",
    ...(region ? { region } : {}),
    ...(category ? { category } : {}),
  });
  return (
    <UserShell
      title={id ? "Khám phá qua video" : "Video từ miền đất"}
      intro="Gặp người đăng, xem hồ sơ và tìm hiểu khu vực qua từng góc nhìn."
    >
      {id ? (
        <SingleVideo id={id} />
      ) : (
        <>
          <div className="user-panel user-fields">
            <label>
              Nội dung
              <select value={scope} onChange={(e) => setScope(e.target.value)}>
                <option value="recommended">Khám phá</option>
                <option value="following">Đang theo dõi</option>
              </select>
            </label>
            <label>
              Miền
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">Tất cả miền</option>
                {Object.entries(regions).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Loại đất
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Tất cả loại đất</option>
                {Object.entries(categories).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Paged
            path={"/feed?" + query}
            type="FeedVideo"
            empty="Chưa có video trong nhóm này."
          >
            {(items) => (
              <div className="user-grid">
                {items.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            )}
          </Paged>
        </>
      )}
    </UserShell>
  );
}
function SingleVideo({ id }: { id: string }) {
  const { data, error, mutate } = useEntity("/videos/" + id, "FeedVideo");
  return error ? (
    <ErrorNotice error={error} retry={() => void mutate()} />
  ) : data ? (
    <div className="user-narrow">
      <VideoCard video={data} full />
    </div>
  ) : (
    <Loading />
  );
}
function Comments({ videoId }: { videoId: string }) {
  const mutation = useMutation(),
    { session } = useSession();
  return (
    <section>
      <h3>Bình luận</h3>
      <Paged
        path={`/videos/${videoId}/comments?limit=20`}
        type="VideoComment"
        empty="Chưa có bình luận."
      >
        {(items) => (
          <ul className="user-list">
            {items.map((c) => (
              <li key={c.id}>
                <strong>{c.author.displayName}</strong>
                <p>{c.text}</p>
                <small>{dateTime(c.createdAt)}</small>
                {c.canDelete && (
                  <button
                    className="button secondary small"
                    disabled={mutation.busy}
                    onClick={() =>
                      void mutation.run(
                        `/videos/${videoId}/comments/${c.id}`,
                        "DELETE",
                        {},
                        () => true,
                      )
                    }
                  >
                    Xóa bình luận của tôi
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Paged>
      {session ? (
        <form
          className="user-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget,
              f = new FormData(form);
            const result = await mutation.run(
              `/videos/${videoId}/comments`,
              "POST",
              { text: formText(f, "text") },
              (raw) => entity(record(raw).data, "VideoComment"),
              true,
            );
            if (result) form.reset();
          }}
        >
          <label>
            Bình luận của bạn
            <textarea name="text" maxLength={1000} required />
          </label>
          <button className="button" disabled={mutation.busy}>
            Gửi bình luận
          </button>
        </form>
      ) : (
        <p>Đăng nhập để bình luận.</p>
      )}
      <ErrorNotice error={mutation.error} />
    </section>
  );
}
export function Author({
  id,
  consultant = false,
}: {
  id: string;
  consultant?: boolean;
}) {
  return (
    <UserShell title={consultant ? "Người đồng hành" : "Hồ sơ người đăng"}>
      {consultant ? <ConsultantRecord id={id} /> : <AuthorRecord id={id} />}
    </UserShell>
  );
}
function AuthorRecord({ id }: { id: string }) {
  const { data, error, mutate } = useEntity("/authors/" + id, "AuthorProfile"),
    { session } = useSession();
  if (error) return <ErrorNotice error={error} retry={() => void mutate()} />;
  if (!data) return <Loading />;
  return (
    <>
      <div className="user-panel">
        <Portrait url={data.author.avatarUrl} name={data.author.displayName} />
        <h2>{data.author.displayName}</h2>
        <p>
          {data.author.role ?? "Người đăng"} · {data.videoCount} video ·{" "}
          {data.followerCount} người theo dõi
        </p>
        <p>Người đăng nội dung không mặc nhiên là chủ sở hữu bất động sản.</p>
        {session?.profile.id !== id && (
          <Toggle
            path={`/authors/${id}/follow`}
            active={!!session && data.author.isFollowing}
            label="Theo dõi"
          />
        )}
        {data.consultantId && (
          <Link
            className="button secondary"
            href={"/chuyen-gia/" + data.consultantId}
          >
            Hồ sơ tư vấn
          </Link>
        )}
      </div>
      <Paged path={`/authors/${id}/videos?limit=6`} type="FeedVideo">
        {(items) => (
          <div className="user-grid">
            {items.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        )}
      </Paged>
    </>
  );
}
function ConsultantRecord({ id }: { id: string }) {
  const { data, error, mutate } = useEntity("/consultants/" + id, "Consultant"),
    { session } = useSession();
  const [tab, setTab] = useState("properties");
  if (error) return <ErrorNotice error={error} retry={() => void mutate()} />;
  if (!data) return <Loading />;
  return (
    <>
      <div className="user-panel">
        <Portrait url={data.avatarUrl} name={data.name} />
        <h2>{data.name}</h2>
        <p>
          {data.role} · {data.location}
        </p>
        <p>
          {data.videoCount} video · {data.followerCount} người theo dõi
          {data.rating === null ? "" : " · Đánh giá " + data.rating}
        </p>
        {data.nextAvailableAt && (
          <p>Khung giờ gần nhất: {dateTime(data.nextAvailableAt)}</p>
        )}
        <div className="user-actions">
          {session?.profile.id !== id && (
            <Toggle
              path={`/authors/${id}/follow`}
              active={!!session && data.isFollowing}
              label="Theo dõi"
            />
          )}
          <Link className="button" href={`/ho-tro?consultantId=${id}`}>
            Gửi yêu cầu tư vấn
          </Link>
        </div>
      </div>
      <div className="user-actions">
        {(
          [
            ["properties", "Lô đất"],
            ["videos", "Video"],
            ["reviews", "Đánh giá"],
          ] as const
        ).map(([v, l]) => (
          <button
            className="button secondary"
            key={v}
            aria-pressed={v === tab}
            onClick={() => setTab(v)}
          >
            {l}
          </button>
        ))}
      </div>
      {tab === "properties" ? (
        <Paged path={`/consultants/${id}/properties`} type="Property">
          {(items) => <PropertyGrid items={items} />}
        </Paged>
      ) : tab === "videos" ? (
        <Paged path={`/consultants/${id}/videos?limit=6`} type="FeedVideo">
          {(items) => (
            <div className="user-grid">
              {items.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          )}
        </Paged>
      ) : (
        <Paged path={`/consultants/${id}/reviews`} type="ConsultantReview">
          {(items) => (
            <ul className="user-list">
              {items.map((r) => (
                <li key={r.id}>
                  <strong>
                    {r.authorDisplayName} · {r.rating}/5
                  </strong>
                  <p>{r.text}</p>
                  <small>{dateTime(r.createdAt)}</small>
                </li>
              ))}
            </ul>
          )}
        </Paged>
      )}
    </>
  );
}
export function Portrait({ url, name }: { url: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  const src = safeUrl(url);
  return src && !failed ? (
    <Image
      unoptimized
      width={900}
      height={600}
      className="user-avatar"
      src={src}
      alt={name}
      onError={() => setFailed(true)}
    />
  ) : (
    <div className="user-avatar" role="img" aria-label={name} />
  );
}
export function Following() {
  return (
    <UserShell title="Đang theo dõi">
      <AccountNav />
      <RequireSession>
        <Paged
          path="/me/following"
          type="PublicAuthor"
          empty="Bạn chưa theo dõi người đăng nào."
        >
          {(items) => (
            <div className="user-grid">
              {items.map((a) => (
                <article className="user-panel" key={a.id}>
                  <Portrait url={a.avatarUrl} name={a.displayName} />
                  <h2>
                    <Link href={`/nguoi-dang/${a.id}`}>{a.displayName}</Link>
                  </h2>
                  <p>{a.role}</p>
                  <Toggle
                    path={`/authors/${a.id}/follow`}
                    active={a.isFollowing}
                    label="Theo dõi"
                  />
                </article>
              ))}
            </div>
          )}
        </Paged>
      </RequireSession>
    </UserShell>
  );
}
