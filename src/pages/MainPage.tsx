import { Box, Flex, Grid, HStack, Text, VStack } from "@seed-design/react";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { Chip } from "seed-design/ui/chip";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { Callout } from "seed-design/ui/callout";
import { CourseBadges } from "../components/CourseBadges";
import { Shell, SourceNotice } from "../components/Shell";
import { SITE_DESCRIPTION, SITE_TITLE } from "../config";
import type { Course } from "../lib/sheet";
import { useCourses } from "../lib/useCourses";

const ALL = "전체";

const FILTERS = [
  { key: "분야", label: "분야" },
  { key: "이수구분", label: "이수구분" },
  { key: "교육방식", label: "교육방식" },
  { key: "대상", label: "대상" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];
type FilterState = Record<FilterKey, string>;

const INITIAL_FILTERS: FilterState = { 분야: ALL, 이수구분: ALL, 교육방식: ALL, 대상: ALL };

function unique(values: string[]) {
  return [...new Set(values)];
}

function matchesQuery(course: Course, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return Object.values(course).some((v) => v.toLowerCase().includes(q));
}

export function MainPage() {
  const state = useCourses();
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const resultsRef = useRef<HTMLDivElement>(null);

  const courses = state.status === "ready" ? state.result.courses : [];

  const filtered = useMemo(
    () =>
      courses.filter(
        (c) => matchesQuery(c, query) && FILTERS.every(({ key }) => filters[key] === ALL || c[key] === filters[key]),
      ),
    [courses, query, filters],
  );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setQuery(draft);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const clearSearch = () => {
    setDraft("");
    setQuery("");
  };

  const resetAll = () => {
    clearSearch();
    setFilters(INITIAL_FILTERS);
  };

  const hasCondition = query !== "" || FILTERS.some(({ key }) => filters[key] !== ALL);

  return (
    <Shell>
      <Box bg="bg.brandWeak">
        <VStack className="page" px={{ base: "x4", md: "x6" }} py={{ base: "x8", md: "x12" }} gap="x6">
          <VStack gap="x2">
            <Text textStyle="t9Bold" color="fg.neutral">
              {SITE_TITLE}
            </Text>
            <Text textStyle="t5Regular" color="fg.neutralMuted">
              {SITE_DESCRIPTION}
            </Text>
          </VStack>
          <Grid columns={{ base: 1, sm: 3 }} gap="x3">
            <Stat label="전체 연수" value={courses.length} />
            <Stat label="필수 과정" value={courses.filter((c) => c.이수구분.startsWith("필수")).length} />
            <Stat label="온라인 과정" value={courses.filter((c) => c.교육방식 === "온라인").length} />
          </Grid>
        </VStack>
      </Box>

      <VStack className="page" px={{ base: "x4", md: "x6" }} pt="x6" gap="x5">
        {state.status === "ready" && <SourceNotice result={state.result} />}
        {state.status === "error" && (
          <Callout tone="critical" title="연수 목록을 불러오지 못했어요" description={state.message} />
        )}

        <form onSubmit={submit} role="search" aria-label="연수 검색">
          <HStack gap="x2" align="flex-end">
            <Box flexGrow={1}>
              <TextField label="연수 검색">
                <TextFieldInput
                  type="search"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="과정명, 담당부서(예: 정보화본부), 분야, 학습목표로 검색"
                />
              </TextField>
            </Box>
            <ActionButton type="submit" variant="brandSolid" size="large">
              검색
            </ActionButton>
            {(draft !== "" || query !== "") && (
              <ActionButton type="button" variant="neutralWeak" size="large" onClick={clearSearch}>
                지우기
              </ActionButton>
            )}
          </HStack>
        </form>

        <VStack gap="x3" aria-label="필터">
          {FILTERS.map(({ key, label }) => {
            const options = unique(courses.map((c) => c[key]));
            return (
              <Flex key={key} direction={{ base: "column", md: "row" }} gap={{ base: "x1_5", md: "x4" }} align="flex-start">
                <Box minWidth="72px" py="x1_5">
                  <Text textStyle="t3Bold" color="fg.neutralSubtle">
                    {label}
                  </Text>
                </Box>
                <Chip.RadioRoot
                  aria-label={label}
                  value={filters[key]}
                  onValueChange={(value) => setFilters((f) => ({ ...f, [key]: value }))}
                >
                  <HStack gap="x2" wrap>
                    {[ALL, ...options].map((option) => (
                      <Chip.RadioItem key={option} value={option} size="small">
                        <Chip.Label>{option}</Chip.Label>
                      </Chip.RadioItem>
                    ))}
                  </HStack>
                </Chip.RadioRoot>
              </Flex>
            );
          })}
        </VStack>

        <div ref={resultsRef} style={{ scrollMarginTop: 72 }}>
          <HStack justify="space-between" align="center" mb="x3">
            <Text textStyle="t4Bold" aria-live="polite">
              {state.status === "loading"
                ? "연수 목록을 불러오는 중…"
                : `${query ? `'${query}' 검색 결과 ` : "연수 목록 "}${filtered.length}개`}
            </Text>
            {hasCondition && (
              <ActionButton type="button" variant="neutralWeak" size="xsmall" onClick={resetAll}>
                조건 초기화
              </ActionButton>
            )}
          </HStack>

          {state.status === "ready" && filtered.length === 0 ? (
            <VStack align="center" gap="x2" py="x12" bg="bg.neutralWeak" borderRadius="r3">
              <Text textStyle="t5Bold">조건에 맞는 연수가 없어요</Text>
              <Text textStyle="t3Regular" color="fg.neutralSubtle">
                검색어를 바꾸거나 필터를 초기화해 보세요.
              </Text>
            </VStack>
          ) : (
            <Grid columns="repeat(auto-fill, minmax(320px, 1fr))" gap="x4">
              {filtered.map((course) => (
                <CourseCard key={course.과정코드} course={course} />
              ))}
            </Grid>
          )}
        </div>
      </VStack>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <VStack bg="bg.layerDefault" borderRadius="r3" px="x5" py="x4" gap="x1">
      <Text textStyle="t3Regular" color="fg.neutralSubtle">
        {label}
      </Text>
      <Text textStyle="t9Bold" color="fg.brand">
        {value}
      </Text>
    </VStack>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <a href={`./detail.html?code=${encodeURIComponent(course.과정코드)}`} style={{ display: "flex" }}>
      <VStack
        flexGrow={1}
        gap="x3"
        p="x5"
        borderRadius="r3"
        borderWidth="1"
        borderColor="stroke.neutralMuted"
        bg="bg.layerDefault"
      >
        <CourseBadges course={course} />
        <VStack gap="x1" flexGrow={1}>
          <Text textStyle="t5Bold">{course.과정명}</Text>
          <Text textStyle="t3Regular" color="fg.neutralMuted">
            {course.한줄소개}
          </Text>
        </VStack>
        <VStack gap="x0_5">
          <Text textStyle="t2Regular" color="fg.neutralSubtle">
            {course.교육시간} · {course.대상} · {course.담당부서}
          </Text>
          <Text textStyle="t2Regular" color="fg.neutralSubtle">
            교육기간 {course.교육기간}
          </Text>
        </VStack>
      </VStack>
    </a>
  );
}
