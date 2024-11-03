import React from 'react';

import { Alert, AlertIcon, AlertTitle, Flex, Stack } from '@chakra-ui/react';

import {
  AdminLayoutPage,
  AdminLayoutPageContent,
} from '@/features/admin/AdminLayoutPage';

import { DashboardStatics } from './DashboardStatics';

export default function PageAdminDashboard() {
  return (
    <AdminLayoutPage containerMaxWidth="container.md">
      <AdminLayoutPageContent>
        <Flex flexDir="column">
          <Flex gap={2} mb={2}>
            <Alert
              status="success"
              colorScheme="brand"
              borderRadius="md"
              width="50%"
            >
              <AlertIcon />
              <Flex alignItems="center" justifyContent="space-between" flex={1}>
                <AlertTitle fontSize="lg">LONG</AlertTitle>
              </Flex>
            </Alert>
            <Alert
              status="success"
              colorScheme="brand"
              borderRadius="md"
              width="50%"
            >
              <AlertIcon />
              <Flex alignItems="center" justifyContent="space-between" flex={1}>
                <AlertTitle fontSize="lg">SHORT</AlertTitle>
              </Flex>
            </Alert>
          </Flex>
          <Stack spacing={4}>
            <DashboardStatics />
          </Stack>
        </Flex>
      </AdminLayoutPageContent>
    </AdminLayoutPage>
  );
}
