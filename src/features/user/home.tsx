"use client";
import { usePage } from "./client";
import { ConsultantSummary } from "./detail";
export function HomeConsultants() {
  const { data } = usePage("/properties?limit=6", "Property");
  const ids = [...new Set(data?.data.map((p) => p.consultantId) ?? [])].slice(
    0,
    3,
  );
  return (
    <section id="nguoi-dong-hanh" className="container section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">NGƯỜI ĐỒNG HÀNH</p>
          <h2>
            Thêm góc nhìn.
            <br />
            Gần hơn với lựa chọn.
          </h2>
        </div>
      </div>
      <div className="user-grid">
        {ids.map((id) => (
          <ConsultantSummary key={id} id={id} />
        ))}
      </div>
    </section>
  );
}
