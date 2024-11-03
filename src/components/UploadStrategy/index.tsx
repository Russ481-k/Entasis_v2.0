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
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Textarea,
  useColorMode,
} from '@chakra-ui/react';
import html2canvas from 'html2canvas';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ReactQuill from 'react-quill';

import Editor from './Editor';

const UploadStrategy = () => {
  const quillInstance = useRef<ReactQuill>(null);
  return (
    <Box flex={1}>
      <Link
        href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.core.css"
        rel="stylesheet"
      />
      <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.core.js"></script>
      <Flex flexDir="column" mb={3}>
        <Flex gap={2}>
          <Box width="100%">
            <InputGroup border-collapse="collapse">
              <InputLeftAddon
                borderBottomLeftRadius={0}
                justifyContent="center"
                width={120}
              >
                Direction
              </InputLeftAddon>
              <Input type="text" borderBottomRightRadius={0} />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon
                borderLeftRadius={0}
                justifyContent="center"
                width={120}
              >
                Target Price
              </InputLeftAddon>
              <Input type="text" borderRightRadius={0} />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon
                justifyContent="center"
                borderTopLeftRadius={0}
                width={120}
              >
                Cut-Off Price
              </InputLeftAddon>
              <Input type="text" borderTopRightRadius={0} />
            </InputGroup>
          </Box>
        </Flex>
      </Flex>
      <Flex>
        <Editor
          forwardedRef={quillInstance}
          // value={contents}
          // onChange={setContents}
          // modules={modules}
          placeholder="내용을 입력해주세요."
        />
      </Flex>
      <Flex gap={2}>
        <Button width="50%">Clear</Button>
        <Button width="50%">Upload Strategy</Button>
      </Flex>
    </Box>
  );
};

export default UploadStrategy;
