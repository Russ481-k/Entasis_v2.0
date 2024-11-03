import React from 'react';

import { Grid, Text } from '@chakra-ui/react';

import { DashboardStaticsThreatLog } from './grid/ThreatLog';

export const DashboardStatics = () => {
  return (
    <Grid
      height="80vh"
      gap={3}
      templateColumns={{
        base: 'repeat(2, 1fr)',
      }}
    >
      <DashboardStaticsThreatLog />
      <DashboardStaticsThreatLog />
      <Text
        fontSize="xs"
        gridColumn="1/-1"
        textAlign="center"
        color="gray.500"
        style={{ textWrap: 'balance' }}
      >
        Copyright 2024. Yun Su-Bin all rights reserved.
      </Text>
    </Grid>
  );
};
