"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import type { AvailabilitySlot, BookingInput, Property } from "./contract";
import {
  dateTime,
  decode,
  entity,
  localDate,
  money,
  record,
  uuidPattern,
} from "./wire";
import {
  ErrorNotice,
  Loading,
  Empty,
  Paged,
  RequireSession,
  request,
  useEntity,
  useFeatures,
  useMutation,
  useSession,
} from "./client";
import { AccountNav, ContactFields, formText, UserShell } from "./ui";
import {
  bookingStatuses,
  paymentStatuses,
  supportKinds,
  supportStatuses,
} from "./labels";

export function Support({
  propertyId,
  consultantId,
}: {
  propertyId?: string;
  consultantId?: string;
}) {
  return (
    <UserShell
      title="Hỗ trợ của Xland"
      intro="Gửi nhu cầu của bạn để bộ phận hỗ trợ tiếp nhận."
    >
      <AccountNav />
      <RequireSession>
        {propertyId || consultantId ? (
          <SupportForm propertyId={propertyId} consultantId={consultantId} />
        ) : (
          <div className="user-notice">
            Chọn một lô đất hoặc chuyên gia để gửi yêu cầu phù hợp.{" "}
            <Link className="text-link" href="/lo-dat">
              Khám phá lô đất →
            </Link>
          </div>
        )}
        <h2>Yêu cầu đã gửi</h2>
        <Paged
          path="/me/support-requests"
          type="SupportRequest"
          empty="Bạn chưa gửi yêu cầu hỗ trợ."
        >
          {(items) => (
            <div className="user-grid">
              {items.map((item) => (
                <article className="user-panel" key={item.id}>
                  <h3>{supportKinds[item.kind]}</h3>
                  <p>
                    {supportStatuses[item.status]} · {dateTime(item.createdAt)}
                  </p>
                  <p>{item.recipientLabel}</p>
                  <p>{item.notice}</p>
                  <small>Mã yêu cầu: {item.id}</small>
                </article>
              ))}
            </div>
          )}
        </Paged>
      </RequireSession>
    </UserShell>
  );
}
function SupportForm({
  propertyId,
  consultantId,
}: {
  propertyId?: string;
  consultantId?: string;
}) {
  const { session } = useSession(),
    mutation = useMutation(),
    [sent, setSent] = useState(false);
  const p = useEntity(
    propertyId ? `/properties/${propertyId}` : null,
    "Property",
  );
  const c = useEntity(
    consultantId ? `/consultants/${consultantId}` : null,
    "Consultant",
  );
  if (p.error || c.error) return <ErrorNotice error={p.error ?? c.error} />;
  if ((propertyId && !p.data) || (consultantId && !c.data)) return <Loading />;
  if (sent)
    return (
      <p className="user-notice" role="status">
        Đã tiếp nhận yêu cầu. Bộ phận hỗ trợ chưa phân công người tư vấn; bạn có
        thể theo dõi bên dưới.
      </p>
    );
  return (
    <div className="user-panel">
      <h2>{p.data?.title ?? c.data?.name}</h2>
      <form
        className="user-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const result = await mutation.run(
            "/support-requests",
            "POST",
            {
              kind: formText(f, "kind"),
              propertyId: propertyId ?? null,
              consultantId: consultantId ?? null,
              message: formText(f, "message"),
              contactName: formText(f, "contactName"),
              contactPhone: formText(f, "contactPhone"),
              consentToShareContact: f.has("consent"),
            },
            (raw) => entity(record(raw).data, "SupportRequest"),
            true,
          );
          if (result) setSent(true);
        }}
      >
        <label>
          Nội dung cần hỗ trợ
          <select name="kind">
            {Object.entries(supportKinds).map(([v, l]) => (
              <option value={v} key={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <ContactFields
          name={session?.profile.displayName}
          phone={session?.profile.contactPhone ?? ""}
        />
        <label>
          Lời nhắn
          <textarea name="message" maxLength={2000} required />
        </label>
        <label className="checkbox">
          <input type="checkbox" name="consent" required />
          Tôi đồng ý chia sẻ họ tên, số điện thoại và nội dung yêu cầu với bộ
          phận hỗ trợ Xland để xử lý nhu cầu này.
        </label>
        <p>
          Yêu cầu được lưu trong tài khoản. Chưa có tư vấn trực tiếp hoặc thời
          gian phản hồi cam kết.
        </p>
        <button className="button" disabled={mutation.busy}>
          {mutation.busy ? "Đang gửi…" : "Gửi yêu cầu"}
        </button>
        <ErrorNotice error={mutation.error} />
      </form>
    </div>
  );
}
export function Bookings({
  propertyId,
  sourceVideoId,
}: {
  propertyId?: string;
  sourceVideoId?: string;
}) {
  return (
    <UserShell
      title={propertyId ? "Đặt lịch xem thực địa" : "Lịch xem thực địa"}
      intro="Theo dõi yêu cầu và thông tin xác nhận từ Xland."
    >
      <AccountNav />
      <RequireSession>
        {propertyId && (
          <BookingForm propertyId={propertyId} sourceVideoId={sourceVideoId} />
        )}
        <h2>Lịch của bạn</h2>
        <Paged
          path="/me/bookings"
          type="Booking"
          empty="Bạn chưa có lịch xem thực địa."
        >
          {(items) => (
            <div className="user-grid">
              {items.map((item) => (
                <article className="user-panel" key={item.id}>
                  <h3>
                    <Link href={`/lich-hen/${item.id}`}>
                      {item.property.title}
                    </Link>
                  </h3>
                  <p>{bookingStatuses[item.status]}</p>
                  <p>
                    {dateTime(
                      item.confirmedStartsAt ?? item.requestedStartsAt,
                      item.timeZone,
                    )}
                  </p>
                  <p>
                    {item.attendeeCount} người ·{" "}
                    {paymentStatuses[item.paymentStatus]}
                  </p>
                  <Link className="text-link" href={`/lich-hen/${item.id}`}>
                    Xem yêu cầu →
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
function BookingForm({
  propertyId,
  sourceVideoId,
}: {
  propertyId: string;
  sourceVideoId?: string;
}) {
  const property = useEntity("/properties/" + propertyId, "Property");
  if (property.error) return <ErrorNotice error={property.error} />;
  if (!property.data) return <Loading />;
  return (
    <BookingFields property={property.data} sourceVideoId={sourceVideoId} />
  );
}
function BookingFields({
  property,
  sourceVideoId,
}: {
  property: Property;
  sourceVideoId?: string;
}) {
  const router = useRouter();
  const { session } = useSession(),
    feature = useFeatures(),
    mutation = useMutation();
  const [from, setFrom] = useState(() => localDate()),
    [to, setTo] = useState(() =>
      localDate(new Date(Date.now() + 14 * 86400000)),
    );
  const [slotId, setSlotId] = useState(""),
    [review, setReview] = useState<BookingInput | null>(null);
  const policy = useEntity("/booking-deposit-policy", "DepositPolicy");
  const datesValid =
    from &&
    to &&
    Date.parse(to) >= Date.parse(from) &&
    Date.parse(to) - Date.parse(from) < 31 * 86400000;
  const slots = useSWR(
    datesValid && property.status === "listed"
      ? `/properties/${property.id}/availability?fromDate=${from}&toDate=${to}`
      : null,
    async (path) =>
      decode(
        record(await request(path)).data,
        "List<AvailabilitySlot>",
      ) as AvailabilitySlot[],
  );
  const slot = slots.data?.find((s) => s.id === slotId),
    enabled = feature.data?.booking === true;
  return (
    <div className="user-panel">
      <h2>{property.title}</h2>
      {property.status !== "listed" ? (
        <p className="user-notice">Lô đất hiện không nhận lịch xem.</p>
      ) : (
        <>
          <div className="user-fields">
            <label>
              Từ ngày
              <input
                type="date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setSlotId("");
                  setReview(null);
                }}
              />
            </label>
            <label>
              Đến ngày
              <input
                type="date"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setSlotId("");
                  setReview(null);
                }}
              />
            </label>
          </div>
          {!datesValid && (
            <p role="alert">Chọn khoảng ngày hợp lệ, tối đa 31 ngày.</p>
          )}
          <ErrorNotice
            error={slots.error ?? policy.error ?? feature.error}
            retry={() => void slots.mutate()}
          />
          {slots.isLoading && <Loading />}
          {slots.data?.length === 0 && (
            <Empty>Chưa có khung giờ trong khoảng ngày này.</Empty>
          )}
          {!enabled && (
            <p className="user-notice">
              Đặt lịch đang chờ hoàn thiện chính sách tiếp nhận.{" "}
              <Link
                className="text-link"
                href={`/ho-tro?propertyId=${property.id}`}
              >
                Gửi nhu cầu xem đất →
              </Link>
            </p>
          )}
          {policy.data && (
            <p className="user-notice">
              {policy.data.notice}.{" "}
              {policy.data.livePaymentEnabled
                ? ""
                : "Chưa mở thu tiền; gửi yêu cầu không có nghĩa lịch đã được xác nhận."}
            </p>
          )}
          {review ? (
            <div className="user-panel">
              <h3>Kiểm tra yêu cầu</h3>
              <p>
                {slot && dateTime(slot.startsAt, slot.timeZone)} ·{" "}
                {review.attendeeCount} người
              </p>
              <p>
                {review.contactName} · {review.contactPhone}
              </p>
              <p>{slot?.meetingArea.label} (khu vực đề xuất)</p>
              <p>
                {review.transportMode === "self_arranged"
                  ? "Tự di chuyển"
                  : "Cần hỗ trợ di chuyển"}
                {review.requestDocuments ? " · Cần tài liệu" : ""}
                {review.requestLoanAdvice ? " · Cần tư vấn vay" : ""}
              </p>
              {review.note && <p>{review.note}</p>}
              <div className="user-actions">
                <button
                  className="button"
                  disabled={mutation.busy || !enabled || !slot?.isAvailable}
                  onClick={async () => {
                    const result = await mutation.run(
                      "/bookings",
                      "POST",
                      review,
                      (raw) => entity(record(raw).data, "Booking"),
                      true,
                    );
                    if (result) router.push("/lich-hen/" + result.id);
                  }}
                >
                  Gửi yêu cầu xem đất
                </button>
                <button
                  className="button secondary"
                  disabled={mutation.busy}
                  onClick={() => setReview(null)}
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          ) : (
            <form
              className="user-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!slot?.isAvailable) return;
                const f = new FormData(e.currentTarget);
                setReview({
                  propertyId: property.id,
                  slotId,
                  sourceVideoId:
                    sourceVideoId && uuidPattern.test(sourceVideoId)
                      ? sourceVideoId
                      : null,
                  attendeeCount: Number(f.get("attendeeCount")),
                  transportMode: formText(f, "transportMode") as
                    | "self_arranged"
                    | "needs_assistance",
                  requestDocuments: f.has("requestDocuments"),
                  requestLoanAdvice: f.has("requestLoanAdvice"),
                  contactName: formText(f, "contactName"),
                  contactPhone: formText(f, "contactPhone"),
                  note: formText(f, "note") || null,
                });
              }}
            >
              <label>
                Khung giờ
                <select
                  required
                  name="slotId"
                  value={slotId}
                  onChange={(e) => setSlotId(e.target.value)}
                >
                  <option value="">Chọn khung giờ</option>
                  {slots.data?.map((s) => (
                    <option key={s.id} value={s.id} disabled={!s.isAvailable}>
                      {dateTime(s.startsAt, s.timeZone)}
                      {s.isAvailable
                        ? ` · Tối đa ${s.maxAttendees} người`
                        : ` · ${s.unavailableReason}`}
                    </option>
                  ))}
                </select>
              </label>
              <ContactFields
                name={session?.profile.displayName}
                phone={session?.profile.contactPhone ?? ""}
              />
              <label>
                Số người tham dự
                <input
                  type="number"
                  name="attendeeCount"
                  min={1}
                  max={slot?.maxAttendees ?? 1}
                  defaultValue={1}
                  required
                />
              </label>
              <label>
                Di chuyển
                <select name="transportMode">
                  <option value="self_arranged">Tự di chuyển</option>
                  <option value="needs_assistance">Cần hỗ trợ</option>
                </select>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="requestDocuments" />
                Cần tài liệu hồ sơ
              </label>
              <label className="checkbox">
                <input type="checkbox" name="requestLoanAdvice" />
                Cần tư vấn vay
              </label>
              <label>
                Ghi chú
                <textarea name="note" maxLength={2000} />
              </label>
              <button
                className="button"
                disabled={!slot?.isAvailable || !enabled}
              >
                Xem lại yêu cầu
              </button>
            </form>
          )}
          <ErrorNotice error={mutation.error} />
        </>
      )}
    </div>
  );
}
export function BookingDetail({ id }: { id: string }) {
  return (
    <UserShell title="Chi tiết lịch xem">
      <AccountNav />
      <RequireSession>
        <BookingRecord id={id} />
      </RequireSession>
    </UserShell>
  );
}
function BookingRecord({ id }: { id: string }) {
  const { data, error, mutate } = useEntity("/bookings/" + id, "Booking");
  if (error) return <ErrorNotice error={error} retry={() => void mutate()} />;
  if (!data) return <Loading />;
  return (
    <>
      <div className="user-panel">
        <h2>{data.property.title}</h2>
        <p>
          {bookingStatuses[data.status]} · {paymentStatuses[data.paymentStatus]}
        </p>
        <dl className="user-facts">
          <div>
            <dt>Giờ yêu cầu</dt>
            <dd>{dateTime(data.requestedStartsAt, data.timeZone)}</dd>
          </div>
          <div>
            <dt>Giờ xác nhận</dt>
            <dd>
              {data.confirmedStartsAt
                ? dateTime(data.confirmedStartsAt, data.timeZone)
                : "Chưa xác nhận"}
            </dd>
          </div>
          <div>
            <dt>Điểm hẹn</dt>
            <dd>
              {data.confirmedMeetingLabel ??
                data.proposedMeetingArea.label + " (đề xuất)"}
            </dd>
          </div>
          <div>
            <dt>Người liên hệ</dt>
            <dd>
              {data.contactName} · {data.maskedContactPhone}
            </dd>
          </div>
          <div>
            <dt>Số người</dt>
            <dd>{data.attendeeCount}</dd>
          </div>
          <div>
            <dt>Yêu cầu bổ sung</dt>
            <dd>
              {[
                data.transportMode === "needs_assistance"
                  ? "Hỗ trợ di chuyển"
                  : "Tự di chuyển",
                data.requestDocuments ? "Tài liệu" : "",
                data.requestLoanAdvice ? "Tư vấn vay" : "",
              ]
                .filter(Boolean)
                .join(" · ")}
            </dd>
          </div>
        </dl>
        <p>{data.depositPolicy.notice}</p>
        <div className="user-actions">
          <button
            className="button secondary"
            disabled
            title="Chính sách đổi/hủy chưa được cấu hình"
          >
            Đổi / hủy lịch chưa khả dụng
          </button>
          <Link
            className="button"
            href={`/ho-tro?propertyId=${data.propertyId}`}
          >
            Liên hệ hỗ trợ
          </Link>
          <Link className="text-link" href={`/lo-dat/${data.propertyId}`}>
            Xem lô đất →
          </Link>
        </div>
        <h3>Lịch sử trạng thái</h3>
        <ul className="user-list">
          {data.history.map((h) => (
            <li key={h.id}>
              {dateTime(h.occurredAt, data.timeZone)} ·{" "}
              {bookingStatuses[h.toStatus]}
              <br />
              {h.publicNote} · {h.actorLabel}
            </li>
          ))}
        </ul>
      </div>
      <h2>Thông tin thanh toán</h2>
      <Paged path={`/bookings/${id}/payments`} type="PaymentRecord">
        {(items) => items.map((p) => <Payment key={p.id} id={p.id} />)}
      </Paged>
    </>
  );
}
function Payment({ id }: { id: string }) {
  const { data, error } = useEntity("/payments/" + id, "PaymentRecord"),
    mutation = useMutation();
  return error ? (
    <ErrorNotice error={error} />
  ) : !data ? (
    <Loading />
  ) : (
    <div className="user-panel">
      <p>
        {paymentStatuses[data.status]} · {money(data.amountVnd)}
      </p>
      <p>{data.notice}</p>
      <p>Cập nhật {dateTime(data.updatedAt)}</p>
      <button
        className="button secondary"
        disabled={mutation.busy}
        onClick={() =>
          void mutation.run("/payments/" + id + "/refresh", "POST", {}, (raw) =>
            entity(record(raw).data, "PaymentRecord"),
          )
        }
      >
        Tải trạng thái hiện tại
      </button>
      <p>
        Tải trạng thái chỉ đọc kết quả đang có; không phải xác minh chuyển tiền.
      </p>
      <ErrorNotice error={mutation.error} />
    </div>
  );
}
