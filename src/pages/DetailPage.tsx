import { Box, Grid, HStack, Text, VStack } from "@seed-design/react";
import { useState, type ReactNode } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { Callout } from "seed-design/ui/callout";
import { CourseBadges } from "../components/CourseBadges";
import { Shell, SourceNotice } from "../components/Shell";
import { splitList, type Course } from "../lib/sheet";
import { useCourses } from "../lib/useCourses";

export function DetailPage() {
  const state = useCourses();
  const code = new URLSearchParams(window.location.search).get("code") ?? "";

  let body: ReactNode;
  if (state.status === "loading") {
    body = <Text textStyle="t4Regular">연수 정보를 불러오는 중…</Text>;
  } else if (state.status === "error") {
    body = <Callout tone="critical" title="연수 정보를 불러오지 못했어요" description={state.message} />;
  } else {
    const course = state.result.courses.find((c) => c.과정코드 === code);
    body = (
      <>
        <SourceNotice result={state.result} />
        {course ? <CourseDetail course={course} /> : <NotFound code={code} />}
      </>
    );
    if (course) document.title = `${course.과정명} | 2026 부산대학교 직무연수`;
  }

  return (
    <Shell>
      <VStack className="page" px={{ base: "x4", md: "x6" }} pt="x6" gap="x5">
        {body}
      </VStack>
    </Shell>
  );
}

function NotFound({ code }: { code: string }) {
  return (
    <VStack align="center" gap="x3" py="x12" bg="bg.neutralWeak" borderRadius="r3">
      <Text textStyle="t6Bold">{code ? "해당 연수를 찾을 수 없어요" : "연수 코드가 지정되지 않았어요"}</Text>
      {code && (
        <Text textStyle="t3Regular" color="fg.neutralSubtle">
          요청한 과정코드: {code}
        </Text>
      )}
      <ActionButton asChild variant="brandSolid" size="medium">
        <a href="./index.html">전체 연수 목록으로</a>
      </ActionButton>
    </VStack>
  );
}

function CourseDetail({ course }: { course: Course }) {
  const [copied, setCopied] = useState(false);
  const goals = splitList(course.학습목표);
  const modules = splitList(course.주요내용);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <VStack gap="x6">
      <nav aria-label="breadcrumb" className="no-print">
        <HStack gap="x1_5" wrap>
          <a href="./index.html">
            <Text textStyle="t2Regular" color="fg.neutralSubtle">
              연수 목록
            </Text>
          </a>
          <Text textStyle="t2Regular" color="fg.neutralSubtle">
            ›
          </Text>
          <Text textStyle="t2Regular" color="fg.neutralSubtle">
            {course.분야}
          </Text>
          <Text textStyle="t2Regular" color="fg.neutralSubtle">
            ›
          </Text>
          <Text textStyle="t2Medium">{course.과정코드}</Text>
        </HStack>
      </nav>

      <VStack gap="x3">
        <CourseBadges course={course} />
        <Text as="h1" textStyle="t9Bold">
          {course.과정명}
        </Text>
        <Text textStyle="t5Regular" color="fg.neutralMuted">
          {course.한줄소개}
        </Text>
      </VStack>

      <Grid columns={{ base: 1, md: "minmax(0, 1fr) 340px" }} gap="x8" alignItems="flex-start">
        <VStack gap="x8">
          <Section title="연수 소개">
            <Text textStyle="t4Regular" color="fg.neutralMuted" style={{ lineHeight: 1.7 }}>
              {course.상세소개}
            </Text>
          </Section>

          <Section title="학습 목표">
            <VStack as="ul" gap="x2" style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {goals.map((goal) => (
                <HStack as="li" key={goal} gap="x2" align="flex-start">
                  <Text textStyle="t4Bold" style={{ color: "var(--pnu-green)" }}>
                    ✓
                  </Text>
                  <Text textStyle="t4Regular">{goal}</Text>
                </HStack>
              ))}
            </VStack>
          </Section>

          <Section title="주요 교육 내용">
            <Grid columns={{ base: 1, sm: 2 }} gap="x3">
              {modules.map((item, index) => (
                <HStack
                  key={item}
                  gap="x3"
                  align="center"
                  p="x4"
                  bg="bg.neutralWeak"
                  borderRadius="r3"
                >
                  <Text textStyle="t4Bold" color="fg.brand">
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                  <Text textStyle="t4Medium">{item}</Text>
                </HStack>
              ))}
            </Grid>
          </Section>

          <HStack className="no-print">
            <ActionButton asChild variant="neutralWeak" size="medium">
              <a href="./index.html">← 전체 연수 목록으로</a>
            </ActionButton>
          </HStack>
        </VStack>

        <aside className="sticky-side">
          <VStack gap="x4" p="x5" borderRadius="r3" borderWidth="1" borderColor="stroke.neutralMuted" bg="bg.layerDefault">
            <Text textStyle="t5Bold">교육 정보</Text>
            <VStack as="dl" gap="x3" style={{ margin: 0 }}>
              <Info label="교육시간" value={course.교육시간} />
              <Info label="대상" value={course.대상} />
              <Info label="정원" value={course.정원} />
              <Info label="교육기간" value={course.교육기간} />
              <Info label="신청기간" value={course.신청기간} />
              <Info label="담당부서" value={course.담당부서} />
              <Info label="문의" value={course.문의} />
            </VStack>
            <VStack gap="x2" className="no-print">
              <ActionButton asChild variant="brandSolid" size="large">
                <a href={course.신청링크} target="_blank" rel="noopener noreferrer">
                  수강 신청하기
                </a>
              </ActionButton>
              <HStack gap="x2">
                <Box flexGrow={1}>
                  <ActionButton type="button" variant="neutralWeak" size="medium" onClick={copyLink} style={{ width: "100%" }}>
                    {copied ? "복사됨 ✓" : "링크 복사"}
                  </ActionButton>
                </Box>
                <Box flexGrow={1}>
                  <ActionButton type="button" variant="neutralWeak" size="medium" onClick={() => window.print()} style={{ width: "100%" }}>
                    인쇄
                  </ActionButton>
                </Box>
              </HStack>
            </VStack>
          </VStack>
        </aside>
      </Grid>
    </VStack>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <VStack as="section" gap="x3">
      <Text as="h2" textStyle="t6Bold">
        {title}
      </Text>
      {children}
    </VStack>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <HStack justify="space-between" gap="x4" align="flex-start">
      <Text as="dt" textStyle="t3Regular" color="fg.neutralSubtle" style={{ flexShrink: 0 }}>
        {label}
      </Text>
      <Text as="dd" textStyle="t3Medium" style={{ margin: 0, textAlign: "right" }}>
        {value}
      </Text>
    </HStack>
  );
}
