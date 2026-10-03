import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getGsap } from "../../src/components/motion/gsap-core";
import { StoryImageReveal } from "../../src/components/motion/story-image-reveal";
import { XlandStory } from "../../src/components/home/xland-story";

describe("motion foundation", () => {
  it("exports GSAP and ScrollTrigger without errors", () => {
    const { gsap, ScrollTrigger } = getGsap();
    expect(gsap).toBeDefined();
    expect(typeof gsap.to).toBe("function");
    expect(ScrollTrigger).toBeDefined();
  });

  it("StoryImageReveal renders children safely in server environment", () => {
    const html = renderToStaticMarkup(
      createElement(
        StoryImageReveal,
        null,
        createElement("img", { src: "/images/test.webp", alt: "Test image" })
      )
    );
    expect(html).toContain('data-motion-island="story-image"');
    expect(html).toContain('class="story-reveal-container"');
    expect(html).toContain('class="story-reveal-visual"');
    expect(html).toContain('src="/images/test.webp"');
  });

  it("XlandStory retains full semantic HTML and marketing links with motion wrapper", () => {
    const html = renderToStaticMarkup(createElement(XlandStory));
    expect(html).toContain('id="cach-hoat-dong"');
    expect(html).toContain('data-xland-story');
    expect(html).toContain('data-motion-island="story-image"');
    expect(html).toContain('href="/lo-dat"');
    expect(html).toContain('href="#nguoi-dong-hanh"');
    expect(html).toContain('Khám phá có chọn lọc');
    expect(html).toContain('01');
    expect(html).toContain('02');
    expect(html).toContain('03');
  });
});
