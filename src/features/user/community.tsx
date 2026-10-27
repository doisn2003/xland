"use client";
import Link from "next/link";
import { useState } from "react";
import type { XlandEvent } from "./contract";
import { dateTime, entity, money, record } from "./wire";
import {
  ErrorNotice,
  Loading,
  Paged,
  RequireSession,
  Toggle,
  useEntity,
  useFeatures,
  useMutation,
  useSession,
  useClock,
} from "./client";
import {
  AccountNav,
  ContactFields,
  formText,
  Gallery,
  Media,
  PropertyGrid,
  UserShell,
} from "./ui";
import { eventStatuses } from "./labels";
import { Portrait, Share, VideoCard } from "./social";

export function EventCard({ event }: { event: XlandEvent }) {
  const { session } = useSession();
  return (
    <article className="property-card">
      <div className="card-cover">
        <Media asset={event.media[0]} title={event.title} />
      </div>
      <div className="card-content">
        <p>
          {eventStatuses[event.status]} ·{" "}
          {dateTime(event.startsAt, event.timeZone)}
        </p>
        <h2>
          <Link href={"/su-kien/" + event.id}>{event.title}</Link>
        </h2>
        <p>{event.venueName}</p>
        <p>
          {money(event.ticketPriceVnd)} · {event.remainingSlots} chỗ
        </p>
        <Toggle
          path={`/events/${event.id}/saved`}
          active={!!session && event.isSaved}
          label="Lưu sự kiện"
        />
      </div>
    </article>
  );
}
export function Events({ id }: { id?: string }) {
  const [status, setStatus] = useState("");
  return (
    <UserShell
      title={id ? "Sự kiện Xland" : "Gặp gỡ và kết nối"}
      intro="Những cuộc gặp để hiểu hơn về thị trường và cộng đồng."
    >
      {id ? (
        <EventDetail id={id} />
      ) : (
        <>
          <div className="user-form">
            <label>
              Trạng thái
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Tất cả sự kiện</option>
                {Object.entries(eventStatuses).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Paged
            path={"/events" + (status ? "?status=" + status : "")}
            type="XlandEvent"
            empty="Chưa có sự kiện trong nhóm này."
          >
            {(items) => (
              <div className="user-grid">
                {items.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            )}
          </Paged>
        </>
      )}
    </UserShell>
  );
}
function EventDetail({ id }: { id: string }) {
  const { data, error, mutate } = useEntity("/events/" + id, "XlandEvent"),
    { session } = useSession();
  if (error) return <ErrorNotice error={error} retry={() => void mutate()} />;
  if (!data) return <Loading />;
  return (
    <>
      <Gallery media={data.media} title={data.title} />
      <div className="user-panel">
        <h2>{data.title}</h2>
        <p>{data.tags.join(" · ")}</p>
        <p>
          {dateTime(data.startsAt, data.timeZone)} –{" "}
          {dateTime(data.endsAt, data.timeZone)}
        </p>
        <p>
          {data.venueName} · {data.address}
        </p>
        <p>
          {eventStatuses[data.status]} · {data.remainingSlots}/{data.maxSlots}{" "}
          chỗ còn lại · {money(data.ticketPriceVnd)}
        </p>
        <div className="user-actions">
          <Toggle
            path={`/events/${id}/saved`}
            active={!!session && data.isSaved}
            label="Lưu sự kiện"
          />
          <Share path={"/events/" + id} />
        </div>
        <h3>Chương trình</h3>
        <ul className="user-list">
          {data.agenda.map((a, i) => (
            <li key={i}>
              <strong>
                {dateTime(a.startsAt, data.timeZone)} · {a.title}
              </strong>
              {a.description && <p>{a.description}</p>}
            </li>
          ))}
        </ul>
        <h3>Diễn giả</h3>
        <div className="user-grid">
          {data.speakers.map((s, i) => (
            <div key={i}>
              <Portrait url={s.avatarUrl} name={s.name} />
              <h3>{s.name}</h3>
              <p>{s.role}</p>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
        <ul className="user-list">
          {data.benefits.map((b, i) => (
            <li key={i}>
              <strong>{b.title}</strong>
              <p>{b.description}</p>
            </li>
          ))}
        </ul>
      </div>
      <RequireSession>
        <Register event={data} />
      </RequireSession>
    </>
  );
}
function Register({ event }: { event: XlandEvent }) {
  const { session } = useSession(),
    features = useFeatures(),
    mutation = useMutation(),
    [registered, setRegistered] = useState(false);
  const now = useClock();
  const allowed =
    features.data?.events === true &&
    event.status === "open" &&
    Date.parse(event.startsAt) > now &&
    event.remainingSlots > 0;
  return (
    <div className="user-panel">
      <h2>Đăng ký tham dự</h2>
      {registered ? (
        <p role="status">
          Đã tiếp nhận đăng ký, trạng thái đang chờ.{" "}
          <Link className="text-link" href="/dang-ky-su-kien">
            Xem đăng ký của bạn →
          </Link>
        </p>
      ) : (
        <form
          className="user-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const result = await mutation.run(
              `/events/${event.id}/registrations`,
              "POST",
              {
                contactName: formText(f, "contactName"),
                contactPhone: formText(f, "contactPhone"),
                attendeeCount: Number(f.get("count")),
              },
              (raw) => entity(record(raw).data, "EventRegistration"),
              true,
            );
            if (result) setRegistered(true);
          }}
        >
          <ContactFields
            name={session?.profile.displayName}
            phone={session?.profile.contactPhone ?? ""}
          />
          <label>
            Số người
            <input
              name="count"
              type="number"
              defaultValue={1}
              required
              min={1}
              max={Math.min(event.remainingSlots, 100)}
            />
          </label>
          <p>
            Đăng ký được tiếp nhận ở trạng thái đang chờ. Chưa mở thu phí sự
            kiện.
          </p>
          {!allowed && (
            <p className="user-notice">
              {features.data?.events
                ? "Sự kiện không còn nhận đăng ký."
                : "Sự kiện chưa mở tiếp nhận đăng ký trên website."}
            </p>
          )}
          <button className="button" disabled={mutation.busy || !allowed}>
            Gửi đăng ký
          </button>
        </form>
      )}
      <ErrorNotice error={mutation.error ?? features.error} />
    </div>
  );
}
export function Registrations() {
  return (
    <UserShell title="Đăng ký sự kiện">
      <AccountNav />
      <RequireSession>
        <Paged
          path="/me/event-registrations"
          type="EventRegistration"
          empty="Bạn chưa đăng ký sự kiện."
        >
          {(items) => (
            <div className="user-grid">
              {items.map((r) => (
                <article className="user-panel" key={r.id}>
                  <h2>
                    {r.status === "pending"
                      ? "Đang chờ"
                      : r.status === "registered"
                        ? "Đã đăng ký"
                        : "Đã hủy"}
                  </h2>
                  <p>
                    {r.attendeeCount} người · {money(r.ticketPriceVnd)}/người
                  </p>
                  <p>{r.notice}</p>
                  <p>{dateTime(r.createdAt)}</p>
                  <Link className="text-link" href={`/su-kien/${r.eventId}`}>
                    Xem sự kiện →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </Paged>
      </RequireSession>
    </UserShell>
  );
}
export function Clubs({ id }: { id?: string }) {
  return (
    <UserShell title="Cộng đồng Xland">
      {id ? (
        <ClubDetail id={id} />
      ) : (
        <Paged path="/clubs" type="Club" empty="Chưa có câu lạc bộ.">
          {(items) => (
            <div className="user-grid">
              {items.map((c) => (
                <article className="user-panel" key={c.id}>
                  <h2>
                    <Link href={`/cau-lac-bo/${c.id}`}>{c.title}</Link>
                  </h2>
                  <p>{c.regionLabel}</p>
                  <p>{c.summary}</p>
                  <Link className="text-link" href={`/cau-lac-bo/${c.id}`}>
                    Tìm hiểu cộng đồng →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </Paged>
      )}
    </UserShell>
  );
}
function ClubDetail({ id }: { id: string }) {
  const { data, error } = useEntity("/clubs/" + id, "Club");
  return error ? (
    <ErrorNotice error={error} />
  ) : !data ? (
    <Loading />
  ) : (
    <>
      <Gallery media={data.media} title={data.title} />
      <div className="user-panel">
        <h2>{data.title}</h2>
        <p>{data.regionLabel}</p>
        <p>{data.summary}</p>
        <p>{data.description}</p>
        <ul className="user-list">
          {data.activities.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
        <Link className="button" href="/su-kien">
          Khám phá sự kiện
        </Link>
      </div>
    </>
  );
}
export function Saved({ initialTab = "properties" }: { initialTab?: string }) {
  const [tab, setTab] = useState(initialTab);
  return (
    <UserShell title="Nội dung đã lưu">
      <AccountNav />
      <RequireSession>
        <div className="user-actions">
          {(
            [
              ["properties", "Lô đất"],
              ["videos", "Video"],
              ["events", "Sự kiện"],
            ] as const
          ).map(([v, l]) => (
            <button
              key={v}
              className="button secondary"
              aria-pressed={tab === v}
              onClick={() => {
                setTab(v);
                history.replaceState(null, "", "/da-luu?tab=" + v);
              }}
            >
              {l}
            </button>
          ))}
        </div>
        {tab === "videos" ? (
          <Paged
            path="/me/saved-videos?limit=6"
            type="FeedVideo"
            empty="Bạn chưa lưu video."
          >
            {(items) => (
              <div className="user-grid">
                {items.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
            )}
          </Paged>
        ) : tab === "events" ? (
          <Paged
            path="/me/saved-events"
            type="XlandEvent"
            empty="Bạn chưa lưu sự kiện."
          >
            {(items) => (
              <div className="user-grid">
                {items.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            )}
          </Paged>
        ) : (
          <>
            <p className="user-notice">
              Danh sách hiển thị lô đất đang được giới thiệu. Lô tạm dừng hoặc
              đã bán có thể không còn xuất hiện trong danh mục.
            </p>
            <Paged
              path="/properties?savedOnly=true"
              type="Property"
              empty="Bạn chưa lưu lô đất đang được giới thiệu."
            >
              {(items) => <PropertyGrid items={items} />}
            </Paged>
          </>
        )}
      </RequireSession>
    </UserShell>
  );
}
