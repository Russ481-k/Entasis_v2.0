import React, { useRef } from 'react';

import {
  Flex,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
} from '@chakra-ui/react';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { AgGridReact } from 'ag-grid-react';
import dayjs from 'dayjs';

import { zLogs } from '../../monitoring/schemas';

export const DashboardStaticsThreatLog = () => {
  const { colorMode } = useColorMode();

  const gridRef = useRef<AgGridReact<ColDef<zLogs>[]>>(null);

  return (
    <GridItem
      borderRadius="lg"
      bg="blackAlpha.200"
      borderWidth={1}
      borderColor={colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300'}
      colSpan={{
        base: 1,
      }}
      overflow="hidden"
      height={{
        base: '600px',
      }}
    >
      <Flex flexDir="column">
        <Tabs
          size="md"
          colorScheme="facebook"
          bgColor={colorMode === 'light' ? 'white' : ''}
        >
          <TabList>
            <Tab>Rescent 20 Rows</Tab>
            <Tab>Critical Rescent 7 Days</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0} pt={1}>
              <div
                className={
                  colorMode === 'light'
                    ? 'ag-theme-quartz'
                    : 'ag-theme-quartz-dark'
                }
                style={{
                  width: '100%',
                  height: '600px',
                  zIndex: 0,
                }}
              >
                <AgGridReact
                  ref={gridRef}
                  rowData={[
                    {
                      receiveTime: '',
                      deviceName: '',
                      serial: '',
                      description: '',
                    },
                  ]}
                  columnDefs={[
                    {
                      headerName: 'Receive Time',
                      field: 'receiveTime',
                      sortable: true,
                      filter: true,
                      width: 170,
                      valueFormatter: (params: ValueFormatterParams) =>
                        dayjs(params.value / 1000000).format(
                          'YYYY-MM-DD HH:mm:ss'
                        ),
                    },
                    {
                      headerName: 'Device Name',
                      field: 'deviceName',
                      sortable: true,
                      filter: true,
                      width: 160,
                    },
                    {
                      headerName: 'Serial Number',
                      field: 'serial',
                      filter: true,
                      width: 160,
                    },
                    {
                      headerName: 'Description',
                      field: 'description',
                      filter: true,
                      flex: 1,
                    },
                  ]}
                />
              </div>
            </TabPanel>
            <TabPanel p={0} pt={1}>
              <div
                className={
                  colorMode === 'light'
                    ? 'ag-theme-quartz'
                    : 'ag-theme-quartz-dark'
                }
                style={{
                  width: '100%',
                  height: '600px',
                  zIndex: 0,
                  borderRadius: 0,
                  borderWidth: 0,
                }}
              >
                <AgGridReact
                  ref={gridRef}
                  rowData={[
                    {
                      receiveTime: '',
                      deviceName: '',
                      serial: '',
                      description: '',
                    },
                  ]}
                  columnDefs={[
                    {
                      headerName: 'Receive Time',
                      field: 'receiveTime',
                      sortable: true,
                      filter: true,
                      width: 170,
                      valueFormatter: (params: ValueFormatterParams) =>
                        dayjs(params.value / 1000000).format(
                          'YYYY-MM-DD HH:mm:ss'
                        ),
                    },
                    {
                      headerName: 'Device Name',
                      field: 'deviceName',
                      sortable: true,
                      filter: true,
                      width: 160,
                    },
                    {
                      headerName: 'Serial Number',
                      field: 'serial',
                      filter: true,
                      flex: 1,
                    },
                    {
                      headerName: 'Description',
                      field: 'description',
                      filter: true,
                      flex: 1,
                    },
                  ]}
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </GridItem>
  );
};
