import Link from "next/link";
import { PropertyImage } from "@/components/property-image";
import { Icon } from "@/components/icon";
import { StoryImageReveal } from "@/components/motion/story-image-reveal";

interface StoryStep {
  number: string;
  title: string;
  description: string;
}

const STORY_STEPS: StoryStep[] = [
  {
    number: "01",
    title: "Khám phá có chọn lọc",
    description: "Tìm kiếm theo khu vực, ngân sách và không gian sống. Thông tin then chốt được thể hiện trực quan ngay từ đầu.",
  },
  {
    number: "02",
    title: "Hiểu rõ từng lựa chọn",
    description: "Cảnh quan thực địa, diện tích, mặt tiền và lối tiếp cận được minh bạch cạnh nhau để bạn có cơ sở vững chắc.",
  },
  {
    number: "03",
    title: "Kết nối bước tiếp theo",
    description: "Gặp gỡ chuyên viên phụ trách khu vực, đặt lịch khảo sát thực địa hoặc tìm hiểu phương án phân đoạn bằng NFT.",
  },
];

export function XlandStory() {
  return (
    <section
      className="xland-story section"
      id="cach-hoat-dong"
      aria-labelledby="story-title"
      data-xland-story
    >
      <div className="container story-inner">
        <div className="story-content" data-story-content>
          <div className="story-header" data-story-header>
            <p className="eyebrow" data-story-eyebrow>
              VỀ XLAND
            </p>
            <h2 id="story-title" className="story-title" data-story-title>
              Mỗi miền đất,
              <br />
              <em>một khởi đầu đáng hiểu.</em>
            </h2>
            <p className="story-lead" data-story-lead>
              Từ góc phố đến khoảng xanh, Xland đặt thông tin và người đồng hành
              cạnh nhau để bạn tìm hiểu một lựa chọn phù hợp.
            </p>
          </div>

          <ol className="story-steps" data-story-steps>
            {STORY_STEPS.map((step) => (
              <li className="story-step-item" key={step.number} data-story-step>
                <span className="story-step-num" aria-hidden="true">
                  {step.number}
                </span>
                <div className="story-step-body">
                  <h3 className="story-step-title">{step.title}</h3>
                  <p className="story-step-desc">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="story-actions" data-story-actions>
            <Link className="button story-cta" href="/lo-dat" data-story-cta>
              Khám phá các lô đất <Icon name="arrow" />
            </Link>
            <Link
              className="text-link story-sublink"
              href="#nguoi-dong-hanh"
              data-story-sublink
            >
              Gặp người đồng hành <Icon name="arrow" />
            </Link>
          </div>
        </div>

        <div className="story-media" data-story-media>
          <div className="story-media-frame">
            <StoryImageReveal>
              <PropertyImage
                src="/images/xland-story.webp"
                alt="Cảnh quan thung lũng xanh và dòng sông uốn lượn tại Việt Nam"
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 480px"
                className="story-photo"
              />
            </StoryImageReveal>
          </div>
          <p className="story-media-caption">
            <span className="caption-tag">Bối cảnh tự nhiên</span> · Chiều sâu
            không gian đồi nương và dòng sông tại Việt Nam
          </p>
        </div>
      </div>
    </section>
  );
}
