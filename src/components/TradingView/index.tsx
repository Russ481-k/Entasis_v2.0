import React, { memo, useEffect, useRef, useState } from 'react';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { APP_PATH } from '@/features/app/constants';
import {
  FormFieldsRegister,
  zFormFieldsRegister,
} from '@/features/auth/schemas';
import { trpc } from '@/lib/trpc/client';

import { useToastError } from '../Toast';
import UploadStrategy from '../UploadStrategy';

interface CryptoData {
  symbol: string;
  price: string;
  priceChange: number;
  openPrice: number;
}

type CryptoDataMap = { [key: string]: CryptoData };

const TradingViewWidget = () => {
  const toastError = useToastError();
  const router = useRouter();
  const { t, i18n } = useTranslation(['common', 'auth']);

  const { colorMode } = useColorMode();
  const container = useRef<HTMLDivElement>(null);

  const [cryptoData, setCryptoData] = useState<CryptoDataMap>({
    BTCUSDT: { symbol: 'BTCUSDT', price: '', priceChange: 0, openPrice: 0 },
    ETHUSDT: { symbol: 'ETHUSDT', price: '', priceChange: 0, openPrice: 0 },
    SOLUSDT: { symbol: 'SOLUSDT', price: '', priceChange: 0, openPrice: 0 },
  });
  // 차트 생성 함수
  const createChart = () => {
    if (container.current) {
      container.current.innerHTML = ''; // 기존 차트 제거
      const script = document.createElement('script');
      script.src =
        'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = `
        {
          "height": 650,
          "autosize": true,
          "symbol": "BINANCE:BTCUSDT",
          "interval": "15",
          "timezone": "Asia/Seoul",
          "theme": "${colorMode === 'dark' ? 'dark' : 'light'}",
          "style": "1",
          "locale": "en",
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "calendar": false,
          "studies": [
            "STD;Divergence%1Indicator"
          ],
          "support_host": "https://www.tradingview.com"
        }`;
      container.current.appendChild(script);
    }
  };

  // 컬러 모드가 변경될 때마다 차트 다시 생성
  useEffect(() => {
    createChart();
  }, [colorMode]);

  useEffect(() => {
    // 당일 시가 가져오기
    const fetchOpenPrices = async () => {
      try {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
        for (const symbol of symbols) {
          const response = await fetch(
            `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=1`
          );
          const data: [
            number,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            number,
            string,
            string,
            string,
          ][] = await response.json();

          setCryptoData((prev) => {
            if (
              !data ||
              !Array.isArray(data) ||
              data.length === 0 ||
              !Array.isArray(data[0]) ||
              data[0].length < 2
            ) {
              console.error('Invalid data format received');
              return prev; // 유효하지 않은 데이터 형식이면 상태를 변경하지 않습니다.
            }

            const openPriceStr = data[0][1];
            if (typeof openPriceStr !== 'string') {
              console.error('Invalid open price data type');
              return prev;
            }

            const openPrice = parseFloat(openPriceStr);
            if (isNaN(openPrice)) {
              console.error('Invalid open price received');
              return prev; // 유효하지 않은 시가이면 상태를 변경하지 않습니다.
            }

            const existingData = prev[symbol];
            if (!existingData) {
              // 만약 해당 심볼에 대한 데이터가 없다면, 새로운 데이터를 생성합니다.
              return {
                ...prev,
                [symbol]: {
                  symbol: symbol,
                  price: '',
                  priceChange: 0,
                  openPrice: openPrice,
                },
              };
            }

            // 기존 데이터가 있다면, 업데이트합니다.
            const updatedData: CryptoDataMap = {
              ...prev,
              [symbol]: {
                ...existingData,
                openPrice: openPrice,
              },
            };
            return updatedData;
          });
        }
      } catch (error) {
        console.error('Error fetching open prices:', error);
      }
    };

    fetchOpenPrices();

    const ws = new WebSocket(
      'wss://stream.binance.com:9443/ws/btcusdt@ticker/ethusdt@ticker/solusdt@ticker'
    );
    ws.onmessage = (event: MessageEvent) => {
      const data: { s: string; c: string } = JSON.parse(event.data);
      const symbol = data.s;
      const currentPrice = parseFloat(data.c);

      setCryptoData((prev) => {
        const cryptoInfo = prev[symbol];
        if (!cryptoInfo) return prev;

        const openPrice = cryptoInfo.openPrice;
        const changePercent =
          openPrice !== 0 ? ((currentPrice - openPrice) / openPrice) * 100 : 0;

        const updatedData: CryptoDataMap = {
          ...prev,
          [symbol]: {
            symbol: cryptoInfo.symbol,
            price: currentPrice.toFixed(2),
            priceChange: changePercent,
            openPrice: cryptoInfo.openPrice,
          },
        };

        return updatedData;
      });
    };

    return () => {
      ws.close();
    };
  }, [colorMode]);

  const getPriceColor = (priceChange: number): string => {
    if (priceChange > 0) return 'green.500';
    if (priceChange < 0) return 'red.500';
    return 'gray.500';
  };

  const register = trpc.auth.register.useMutation({
    onSuccess: (data, variables) => {
      router.push(`${APP_PATH}/register/${data.token}?id=${variables.id}`);
    },
    onError: () => {
      toastError({
        title: t('auth:register.feedbacks.registrationError.title'),
      });
    },
  });

  const form = useForm<FormFieldsRegister>({
    resolver: zodResolver(zFormFieldsRegister()),
    defaultValues: {
      name: '',
      id: '',
      language: i18n.language,
    },
  });

  return (
    <Accordion allowMultiple width="100%">
      <AccordionItem>
        <h2>
          <AccordionButton
            _hover={{
              backgroundColor:
                colorMode === 'light' ? 'gray.200' : 'whiteAlpha.100',
            }}
          >
            <Flex flex="1" alignItems="center" gap={5}>
              {Object.values(cryptoData).map((crypto) => (
                <Flex textAlign="left" gap={2} width={210}>
                  <Text fontWeight={500} fontSize="sm">
                    {crypto.symbol}
                  </Text>
                  <Text
                    color={getPriceColor(crypto.priceChange)}
                    fontSize="sm"
                    width={180}
                  >
                    {crypto.price} ({crypto.priceChange > 0 ? '+' : ''}
                    {crypto.priceChange.toFixed(2)}%)
                  </Text>
                </Flex>
              ))}
            </Flex>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel gap={2}>
          <Flex gap={3}>
            <Box
              className="tradingview-widget-container"
              flex={3}
              ref={container}
            />
            <UploadStrategy />
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default memo(TradingViewWidget);
