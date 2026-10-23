import { Box, HStack, Text, VStack } from "@seed-design/react";
import type { ReactNode } from "react";
import { Callout } from "seed-design/ui/callout";
import type { LoadResult } from "../lib/sheet";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <Box bg="bg.layerDefault" minHeight="100vh">
      <Box
        as="header"
        className="no-print"
        bg="bg.layerDefault"
        borderColor="stroke.neutralMuted"
        style={{ position: "sticky", top: 0, zIndex: 10, borderBottomWidth: 1, borderBottomStyle: "solid" }}
      >
        <HStack className="page" px={{ base: "x4", md: "x6" }} py="x3" justify="space-between" align="center">
          <a href="./index.html" aria-label="2026 부산대학교 직무연수 홈">
            <HStack gap="x2" align="center">
              <Box bg="bg.brandSolid" color="fg.neutralInverted" borderRadius="r2" px="x2" py="x1">
                <Text textStyle="t3Bold">PNU</Text>
              </Box>
              <Text textStyle="t5Bold">직무연수 카탈로그</Text>
            </HStack>
          </a>
          <Text textStyle="t3Regular" color="fg.neutralSubtle">
            2026
          </Text>
        </HStack>
      </Box>
      <main>{children}</main>
      <Box as="footer" className="no-print" bg="bg.neutralWeak" mt="x10">
        <VStack className="page" px={{ base: "x4", md: "x6" }} py="x6" gap="x1">
          <Text textStyle="t3Medium">2026 부산대학교 직무연수 안내</Text>
          <Text textStyle="t2Regular" color="fg.neutralSubtle">
            연수 정보는 구글 시트에서 실시간으로 불러옵니다. 시트를 수정하면 새로고침 시 바로 반영됩니다.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

export function SourceNotice({ result }: { result: LoadResult }) {
  if (result.source === "sheet") return null;
  return (
    <Callout
      tone="warning"
      title="구글 시트에 연결하지 못해 백업 데이터를 표시 중이에요"
      description={`시트가 '링크가 있는 모든 사용자 · 뷰어'로 공개되어 있고 config.ts의 시트 ID가 맞는지 확인해 주세요. (사유: ${result.reason})`}
    />
  );
}
