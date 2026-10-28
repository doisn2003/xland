"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEntity, usePage, ErrorNotice, Loading, Empty } from "./client";
import { propertyKeys } from "./routes";
import { PropertyGrid } from "./ui";
import { categories, regions } from "./labels";

export function catalogParams(
  raw: Record<string, string | string[] | undefined>,
) {
  const params = new URLSearchParams();
  for (const key of [...propertyKeys, "cursor"]) {
    const value = raw[key];
    if (Array.isArray(value))
      throw new Error("Mỗi bộ lọc chỉ được xuất hiện một lần.");
    if (value) params.set(key, value);
  }
  return params.toString();
}
export function Catalog({
  query = "",
  home = false,
}: {
  query?: string;
  home?: boolean;
}) {
  const router = useRouter(),
    params = new URLSearchParams(query);
  const [province, setProvince] = useState(params.get("provinceCode") ?? "");
  const { data: locations, error: locationError } = useEntity(
    "/catalog/locations" +
      (province ? "?provinceCode=" + encodeURIComponent(province) : ""),
    "FilterCatalog",
  );
  const { data, error, isLoading, mutate } = usePage(
    "/properties?" + query + (query ? "&" : "") + "limit=" + (home ? 6 : 12),
    "Property",
  );
  function navigate(cursor: string | null) {
    const next = new URLSearchParams(query);
    next.delete("cursor");
    if (cursor) next.set("cursor", cursor);
    router.push("/lo-dat" + (next.size ? "?" + next.toString() : ""));
  }
  return (
    <section
      id={home ? "kham-pha" : undefined}
      className={home ? "container section" : ""}
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">MIỀN ĐẤT CỦA BẠN</p>
          <h2>
            {home ? "Khám phá những khởi đầu mới." : "Tìm lô đất phù hợp"}
          </h2>
        </div>
        {home && (
          <Link className="text-link" href="/lo-dat">
            Xem tất cả →
          </Link>
        )}
      </div>
      {!home && (
        <details
          className="user-filter-disclosure"
          open={query.length > 0 || undefined}
        >
          <summary>Bộ lọc và sắp xếp</summary>
          <form
            key={query}
            className="user-panel user-filters"
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget),
                next = new URLSearchParams();
              for (const key of propertyKeys.filter((k) => k !== "savedOnly")) {
                const entries = form.getAll(key).map(String).filter(Boolean);
                if (entries.length) next.set(key, entries.join(","));
              }
              router.push("/lo-dat" + (next.size ? "?" + next.toString() : ""));
            }}
          >
            <label>
              Từ khóa
              <input
                name="query"
                defaultValue={params.get("query") ?? ""}
                maxLength={100}
                placeholder="Tên, mã hoặc khu vực"
              />
            </label>
            <label>
              Loại đất
              <select
                name="category"
                defaultValue={params.get("category") ?? ""}
              >
                <option value="">Tất cả loại đất</option>
                {Object.entries(categories).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Miền
              <select
                name="regions"
                multiple
                defaultValue={params.get("regions")?.split(",") ?? []}
                size={3}
              >
                {Object.entries(regions).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tỉnh / Thành phố
              <select
                name="provinceCode"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              >
                <option value="">Tất cả tỉnh / thành</option>
                {locations?.provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Xã / phường / đặc khu
              <select
                name="communeCode"
                key={province}
                defaultValue={
                  province === params.get("provinceCode")
                    ? (params.get("communeCode") ?? "")
                    : ""
                }
                disabled={!province}
              >
                <option value="">Tất cả xã / phường</option>
                {locations?.communes.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Sắp xếp
              <select
                name="sort"
                defaultValue={params.get("sort") ?? "relevant"}
              >
                <option value="relevant">Phù hợp</option>
                <option value="newest">Mới cập nhật</option>
                <option value="price_asc">Giá tăng dần</option>
                <option value="price_desc">Giá giảm dần</option>
                <option value="area_asc">Diện tích tăng dần</option>
              </select>
            </label>
            <label>
              Giá từ (VNĐ)
              <input
                name="minPriceVnd"
                inputMode="numeric"
                pattern="[0-9]+"
                maxLength={20}
                defaultValue={params.get("minPriceVnd") ?? ""}
              />
            </label>
            <label>
              Giá đến (VNĐ)
              <input
                name="maxPriceVnd"
                inputMode="numeric"
                pattern="[0-9]+"
                maxLength={20}
                defaultValue={params.get("maxPriceVnd") ?? ""}
              />
            </label>
            <label>
              Diện tích
              <select
                name="areaBands"
                multiple
                size={3}
                defaultValue={params.get("areaBands")?.split(",") ?? []}
              >
                <option value="below_100">Dưới 100 m²</option>
                <option value="from_100_to_200">100–200 m²</option>
                <option value="above_200">Trên 200 m²</option>
              </select>
            </label>
            <label>
              Đường rộng từ (m)
              <input
                name="minRoadWidthM"
                inputMode="decimal"
                pattern="[0-9]+(\.[0-9]{1,6})?"
                defaultValue={params.get("minRoadWidthM") ?? ""}
              />
            </label>
            <label>
              Hồ sơ tài liệu
              <select
                name="hasDocuments"
                defaultValue={params.get("hasDocuments") ?? ""}
              >
                <option value="">Không giới hạn</option>
                <option value="true">Có tài liệu</option>
                <option value="false">Chưa có tài liệu</option>
              </select>
            </label>
            <div className="user-actions">
              <button className="button" type="submit">
                Áp dụng bộ lọc
              </button>
              <Link
                className="button secondary"
                href="/lo-dat"
                onClick={() => setProvince("")}
              >
                Xóa bộ lọc
              </Link>
            </div>
            <ErrorNotice error={locationError} />
          </form>
        </details>
      )}
      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorNotice
          error={error}
          retry={() => {
            if (params.has("cursor")) navigate(null);
            else void mutate();
          }}
        />
      ) : (
        data && (
          <>
            <p className="user-notice" role="status">
              {data.meta.total} lô đất
              {data.meta.selectedCriteriaCount
                ? ` · ${data.meta.selectedCriteriaCount} tiêu chí`
                : ""}
            </p>
            {data.data.length ? (
              <PropertyGrid items={data.data} />
            ) : (
              <Empty>
                Không tìm thấy lô đất phù hợp. Hãy điều chỉnh bộ lọc.
              </Empty>
            )}
            {!home && (
              <div className="user-actions pagination">
                {params.has("cursor") && (
                  <button
                    className="button secondary"
                    onClick={() => navigate(null)}
                  >
                    Về trang đầu
                  </button>
                )}
                {data.meta.hasMore && (
                  <button
                    className="button"
                    onClick={() => navigate(data.meta.nextCursor)}
                  >
                    Trang tiếp theo
                  </button>
                )}
              </div>
            )}
          </>
        )
      )}
    </section>
  );
}
