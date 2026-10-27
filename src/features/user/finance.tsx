"use client";
import Link from "next/link";
import { useState } from "react";
import type { Property, FinanceResult } from "./contract";
import { entity, record, money, dateTime } from "./wire";
import {
  ErrorNotice,
  Paged,
  RequireSession,
  useMutation,
  useSession,
} from "./client";
import { AccountNav, formText, UserShell } from "./ui";

export function FinanceCalculator({ property }: { property: Property }) {
  const mutation = useMutation(),
    { session } = useSession();
  const [equity, setEquity] = useState(
    ((BigInt(property.priceTotal) * BigInt(30)) / BigInt(100)).toString(),
  );
  const valid =
    /^(0|[1-9][0-9]{0,19})$/.test(equity) &&
    BigInt(equity) <= BigInt(property.priceTotal);
  const loan = valid
    ? (BigInt(property.priceTotal) - BigInt(equity)).toString()
    : "";
  const [result, setResult] = useState<FinanceResult | null>(null),
    [label, setLabel] = useState("Phương án " + property.code),
    [saved, setSaved] = useState(false);
  return (
    <section id="tai-chinh" className="user-panel">
      <h2>Ước tính tài chính</h2>
      <p>Giá hiện hành: {money(property.priceTotal)}</p>
      <form
        className="user-form"
        onChange={() => {
          setResult(null);
          setSaved(false);
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!valid) return;
          const f = new FormData(e.currentTarget);
          const calculated = await mutation.run(
            "/finance/estimates",
            "POST",
            {
              propertyId: property.id,
              equityVnd: equity,
              loanVnd: loan,
              termMonths: Number(f.get("termMonths")),
              annualRatePercent: formText(f, "rate"),
              method: formText(f, "method"),
            },
            (raw) => entity(record(raw).data, "FinanceResult"),
          );
          if (calculated) setResult(calculated);
        }}
      >
        <label>
          Vốn tự có (VNĐ)
          <input
            disabled={mutation.busy}
            value={equity}
            onChange={(e) => setEquity(e.target.value)}
            inputMode="numeric"
            pattern="[0-9]+"
            maxLength={20}
            required
          />
        </label>
        <p>
          Khoản vay:{" "}
          {loan ? money(loan) : "Vốn tự có phải từ 0 đến giá lô đất."}
        </p>
        <label>
          Thời hạn vay
          <select name="termMonths" defaultValue="240" disabled={mutation.busy}>
            {Array.from({ length: 26 }, (_, i) => (i + 5) * 12).map((v) => (
              <option key={v} value={v}>
                {v / 12} năm
              </option>
            ))}
          </select>
        </label>
        <label>
          Lãi suất năm (%)
          <input
            disabled={mutation.busy}
            name="rate"
            inputMode="decimal"
            pattern="[0-9]+(\.[0-9]{1,6})?"
            defaultValue="8"
            required
          />
        </label>
        <label>
          Phương pháp
          <select name="method" disabled={mutation.busy}>
            <option value="equal_installment">Trả đều hàng tháng</option>
            <option value="declining_balance">Dư nợ giảm dần</option>
          </select>
        </label>
        <button className="button" disabled={mutation.busy || !valid}>
          Tính ước tính
        </button>
      </form>
      {result && (
        <div className="user-panel">
          <FinanceSummary result={result} />
          {session ? (
            <>
              <label>
                Tên kế hoạch
                <input
                  className="user-plan-label"
                  disabled={mutation.busy}
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  maxLength={100}
                />
              </label>
              <div className="user-actions">
                <button
                  className="button"
                  disabled={mutation.busy || !label.trim() || saved}
                  onClick={async () => {
                    const plan = await mutation.run(
                      "/me/finance-plans",
                      "POST",
                      { label: label.trim(), input: result.input },
                      (raw) => entity(record(raw).data, "SavedFinancePlan"),
                      true,
                    );
                    if (plan) setSaved(true);
                  }}
                >
                  {saved ? "Đã lưu kế hoạch" : "Lưu kế hoạch"}
                </button>
                <Link className="text-link" href="/tai-chinh">
                  Kế hoạch đã lưu →
                </Link>
              </div>
            </>
          ) : (
            <Link
              className="button secondary"
              href={
                "/dang-nhap?returnTo=" +
                encodeURIComponent(`/lo-dat/${property.id}#tai-chinh`)
              }
            >
              Đăng nhập để lưu kế hoạch
            </Link>
          )}
        </div>
      )}
      <ErrorNotice error={mutation.error} />
    </section>
  );
}
function FinanceSummary({ result }: { result: FinanceResult }) {
  return (
    <>
      <dl className="user-facts">
        <div>
          <dt>Thanh toán tháng đầu</dt>
          <dd>{money(result.monthlyPaymentVnd)}</dd>
        </div>
        <div>
          <dt>Gốc tháng đầu</dt>
          <dd>{money(result.firstMonthPrincipalVnd)}</dd>
        </div>
        <div>
          <dt>Lãi tháng đầu</dt>
          <dd>{money(result.firstMonthInterestVnd)}</dd>
        </div>
        <div>
          <dt>Tổng lãi</dt>
          <dd>{money(result.totalInterestVnd)}</dd>
        </div>
        <div>
          <dt>Tổng gốc và lãi</dt>
          <dd>{money(result.totalRepaymentVnd)}</dd>
        </div>
      </dl>
      <p>{result.estimateNotice}</p>
    </>
  );
}
export function FinancePlans() {
  const mutation = useMutation();
  return (
    <UserShell title="Kế hoạch tài chính">
      <AccountNav />
      <RequireSession>
        <ErrorNotice error={mutation.error} />
        <Paged
          path="/me/finance-plans"
          type="SavedFinancePlan"
          empty="Chưa có kế hoạch. Mở hồ sơ lô đất để tính và lưu phương án của bạn."
        >
          {(items) => (
            <div className="user-grid">
              {items.map((plan) => (
                <article className="user-panel" key={plan.id}>
                  <h2>{plan.label}</h2>
                  <p>Lưu ngày {dateTime(plan.createdAt)}</p>
                  {plan.result ? (
                    <FinanceSummary result={plan.result} />
                  ) : (
                    <p>
                      Kế hoạch cũ chưa có kết quả được lưu. Mở lô đất để tính
                      lại theo giá hiện hành.
                    </p>
                  )}
                  <div className="user-actions">
                    <Link
                      className="text-link"
                      href={`/lo-dat/${plan.propertyId}#tai-chinh`}
                    >
                      Xem lô đất →
                    </Link>
                    <button
                      className="button secondary"
                      disabled={mutation.busy}
                      onClick={() =>
                        void mutation.run(
                          "/me/finance-plans/" + plan.id,
                          "DELETE",
                          {},
                          () => true,
                        )
                      }
                    >
                      Xóa kế hoạch
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Paged>
      </RequireSession>
    </UserShell>
  );
}
